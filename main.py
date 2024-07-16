import logging
import sys
import uvicorn

from aiogram import Bot, Dispatcher, types, BaseMiddleware
from aiogram.client.default import DefaultBotProperties
from aiogram.filters import CommandStart
from aiogram.types import Message, Update
from aiogram.types.web_app_info import WebAppInfo
from aiogram.enums import ParseMode
from config import BOT_TOKEN, WEB_URL, DB_URL

from typing import AsyncGenerator, Callable, Awaitable, Any
from datetime import datetime, timedelta
from pytz import UTC
from tortoise import Tortoise

from fastapi import FastAPI, Request, Response
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from models import User

FARMING_TIME = 3  # *60*60 # 3 часа


class UserMiddleware(BaseMiddleware):
    async def __call__(
            self,
            handler: Callable[[Message, dict[str, Any]], Awaitable[Any]],
            event: Message,
            data: dict[str, Any],
    ) -> Any:
        user = await User.get_or_create(id=event.from_user.id, username=event.from_user.full_name)
        data['user'] = user[0]
        return await handler(event, data)


async def lifespan(app: FastAPI) -> AsyncGenerator:
    await bot.set_webhook(
        url=f"{WEB_URL}/webhook",
        allowed_updates=dp.resolve_used_update_types(),
        drop_pending_updates=True,
    )
    await Tortoise.init(db_url=DB_URL, modules={"models": ["models"]})
    await Tortoise.generate_schemas()
    yield
    await Tortoise.close_connections()


bot = Bot(BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.MARKDOWN_V2))
dp = Dispatcher()
dp.message.middleware(UserMiddleware())
app = FastAPI(lifespan=lifespan)
templates = Jinja2Templates(directory="./docs/templates")
app.mount("/static", StaticFiles(directory="./docs/static"), name="static")


@dp.message(CommandStart())
async def start(message: Message, user: User) -> None:
    """
    This handler receives messages with `/start` command
    :param message:
    :return:
    """
    markup = types.inline_keyboard_markup.InlineKeyboardMarkup(
        inline_keyboard=[[
            types.InlineKeyboardButton(
                text="launch",
                web_app=WebAppInfo(url=WEB_URL)
            )
        ]],
        resize_keyboard=True
    )
    await message.answer(
        f"Hello {message.from_user.full_name}, this is web app", reply_markup=markup
    )


@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/game")
async def root(request: Request):
    return templates.TemplateResponse("game.html", {"request": request})


@app.post("/webhook")
async def webhook(request: Request) -> None:
    update = Update.model_validate(await request.json(), context={"bot": bot})
    await dp.feed_update(bot, update)


# Запросы с главной страницы


@app.post("/Get_current_cash")
async def load_cash(request: Request, data: dict) -> dict:
    # print("id:",data["data"])
    user = await User.filter(id=data["data"]).first()
    replystf = user.start_farm_time.isoformat() if user.start_farm_time else None
    return {"balance": user.balance, "start_farm_time": replystf}  # нужно ещё вернуть время начала фарминга


@app.post("/Farm_start")
async def start_farm(request: Request, data: dict) -> dict:
    print("data:", data["data"])
    user = await User.filter(id=data["data"]).first()
    print(user)
    user.start_farm_time = datetime.utcnow()
    await user.save()
    replystf = user.start_farm_time.isoformat()
    return {"start_farm_time": replystf}


@app.post("/Farm_end")
async def end_farm(request: Request, data: dict):
    user = await User.filter(id=data["data"]).first()
    ans = False
    stf_aware = user.start_farm_time.replace(tzinfo=UTC)
    if (stf_aware + timedelta(hours=FARMING_TIME)) < datetime.utcnow().replace(tzinfo=UTC):
        user.balance += 40
        user.start_farm_time = None
        ans = True
        await user.save()
    return ans


# Запросы со станицы с игрой


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    uvicorn.run(app)
# async def main() -> None:
#     await dp.start_polling(bot)
