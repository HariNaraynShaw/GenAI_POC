import json
from pymongo.mongo_client import MongoClient
import uuid
import datetime 
uri = "mongodb+srv://Infosyspoc:Infosyspoc@cluster0.upvoyof.mongodb.net/?retryWrites=true&w=majority"
def connect_db():
    # Create a new client and connect to the server
    client = MongoClient(uri)


    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)
    return client

def insert_into_employee_details(req):
    client=connect_db()
    try:
        db = client["InfosysCopilot"] 
        collection = db["employee_details"]
        # result = collection.insert_one(resume_json)
        result = collection.replace_one({"_id": req['email_id']},req, upsert=True)
        print(f"Document inserted with ID: {result.upserted_id}")
    except Exception as e :
        print(e)
    # Close the connection
    client.close()


def get_leaderboard_details():
    client=connect_db()
    try:
        db = client["InfosysCopilot"] 
        collection = db["employee_details"]
        result = collection.find({}).sort('score',-1)
        json_data = []
        for document in result:
            json_data.append(document)
        return json_data
    except Exception as e :
        print(e)
    finally:
        client.close()

def get_weekly_details():
    client=connect_db()
    try:
        db = client["InfosysCopilot"] 
        collection = db["employee_details"]
        today_date = datetime.datetime.now()
        start_date = today_date - datetime.timedelta(days = 7)
        result = collection.find({"time":{"$gte":start_date}}).sort('score',-1)
        documents = list(result)
        return documents
    except Exception as e :
        print(e)
    # Close the connection
    client.close()