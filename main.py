import asyncio
import logging
import sys

from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import Message
from aiogram.types.web_app_info import WebAppInfo
from aiogram.enums import ParseMode
from config import BOT_TOKEN


dp = Dispatcher()


@dp.message(CommandStart())
async def start(message: Message) -> None:
    """
    This handler receives messages with `/start` command
    :param message:
    :return:
    """
    markup = types.inline_keyboard_markup.InlineKeyboardMarkup(
        inline_keyboard=[[
            types.InlineKeyboardButton(
                text="launch",
                web_app=WebAppInfo(url="https://danyamokhno.github.io/Tg_mini_app/")
            )
        ]],
        resize_keyboard=True
    )
    await message.answer(
        f"Hello {message.from_user.full_name}, this is web app", reply_markup=markup, parse_mode=ParseMode.MARKDOWN_V2
    )


async def main() -> None:
    bot = Bot(BOT_TOKEN)
    await dp.start_polling(bot)


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
