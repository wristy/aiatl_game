from pymongo import MongoClient

MONGO_URI = 'mongodb://localhost:27017'
DB_NAME = 'aiatl'

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
