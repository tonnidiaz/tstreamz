
from flask import Flask,jsonify, request, Response, Blueprint
from threading import Thread
import jwt, datetime,json,random, string, uuid
from dotenv import load_dotenv
import os,json, requests
from flask_bcrypt import Bcrypt
from random import *
from temps.models import TempToken
from flask_mail import Mail, Message
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required, verify_jwt_in_request
from user.models import User, AnonymousUser as AU

router = Blueprint('mail', __name__)

load_dotenv()

mail = Mail()
def send_email(subject, message, recipients):
    msg = Message(
        
    subject= subject,
    sender="TunedStreamz <admin@tunedstreamz.cc>",
    recipients=recipients)
    
    msg.html = message
    
    try:
        mail.send(msg)
        return {"message" :'Email sent successfully'}
    except Exception as e:
        
        print('Could not send email Exception')        
        print(e)
        return {"message" : "Could not send email"}, 401

@router.post("/admin/sendmail")
def send_mail():
    
    form = request.form
    html = form['message']
    subject = form['subject']
    to = form['to']
    to = to.split(',')
    r = send_email(subject, html, to)
    
    return r

@router.get('/users/emails')
def users():
    users = User.objects()
    
    def clean_users(user):

        #user = user.to_json()
        return user.email

    data = list(map(clean_users, users))
    #print(data)

    return {'users': data}