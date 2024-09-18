import os
import dotenv

dotenv.load_dotenv(dotenv_path=".env")

BOT_TOKEN = os.getenv("BOT_TOKEN")
WEB_URL = os.getenv("WEB_URL")
DB_URL = os.getenv("DB_URL")