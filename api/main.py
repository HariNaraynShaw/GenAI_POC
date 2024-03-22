import datetime
import string 
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi import FastAPI, File, UploadFile, Query, Path
from database import get_leaderboard_details,insert_into_employee_details,get_weekly_details
from pydantic import BaseModel, Field
from typing import List, Optional
app = FastAPI()

# templates = Jinja2Templates(directory="../ui/build")
# app.mount('/static', StaticFiles(directory="../ui/build/static"), 'static')

class UserModel(BaseModel):
    user_name: str
    email_id: str
    lines_of_code: int
    weekly_performance:float
    reusability_refactoring:float
    time: Optional[str] = None
    score:Optional[float] = None


@app.get('/weeklydata')
async def weekly_data():
    data = get_weekly_details()
    return { 'data': data}

@app.get('/leaderboard')
async def leaderboard_data():
    data = get_leaderboard_details()
    return { 'data': 'data'}
# @app.get("/testuser")
# async def react_app():
    # print(f'Rest of path: {rest_of_path}')
    # return {'Hello testing'}
    # return templates.TemplateResponse('index.html', { 'request': req })

@app.post('/submit')
async def username(userdetails: UserModel):
    # userdetails = {
    #     "username": 'Hari',
    #      "emailid": 'Harinarayan.shaw@infosys.com',
    #      "lines_of_code": 400,
    #      "weekly_performance":20,
    #      "reusability_refactoring":3.5,
    # }
    userdetails.time = datetime.datetime.now()
    print(userdetails)
    result = {
         "user_name": userdetails.user_name,
         "email_id": userdetails.email_id,
         "lines_of_code": userdetails.lines_of_code,
         "weekly_performance":userdetails.weekly_performance,
         "reusability_refactoring":userdetails.reusability_refactoring,
         "score":userdetails.score,
         "time": userdetails.time,
         

     }
    # result = {"userDetails":{
    #      "user_name": userdetails['username'],
    #      "email_id": userdetails['email'],
    #      "lines_of_code": userdetails['lines_of_code'],
    #      "weekly_performance":userdetails['weekly_performance'],
    #      "reusability_refactoring":userdetails['reusability_refactoring'],
    #      "time": userdetails.time
    #  }}
  
    
    user_details = insert_into_employee_details(result)
    return { 'username': user_details }



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)