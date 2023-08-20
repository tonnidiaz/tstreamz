from flask import Flask, Response, request,jsonify, render_template
from user.models import User
import pymongo, json, jwt, datetime
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
import mongoengine as engine
from flask_mail import Mail, Message
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os

app = Flask(__name__)

 

# Routes
from user.routes import router as user_router
from api.routes import router as api_router
from messages.routes import router as messages_router
from mail.routes import router as mail_router
from analytics.routes import router as analytics_router


app.config['DEBUG'] = True
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=48)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['MAIL_SERVER'] = "smtp.gmail.com"
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
#app.config['MAIL_DEBUG'] = True
app.config['MAIL_USERNAME'] = os.getenv('ADMIN_EMAIL')
app.config['MAIL_PASSWORD'] = os.getenv('ADMIN_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('ADMIN_EMAIL')
#app.config['MAIL_MAX_EMAILS'] = 1
#app.config['MAIL_SUPPRESS_SEND'] = False
#app.config['MAIL_ASCII_ATTACHEMENTS'] = False
# Connect Database

db = 'tunedstreamz'
try:
    if os.environ['ENV'] == 'prod':
        engine.connect(host=os.getenv('MONGO_URL'), db=db, ssl=True,ssl_cert_reqs='CERT_NONE')
    else:
        engine.connect(host=os.getenv('MONGO_URL_LOCAL'), db=db)
except Exception as e:
    print(e)
 


app.register_blueprint(user_router)
app.register_blueprint(api_router)
app.register_blueprint(messages_router)
app.register_blueprint(mail_router)
app.register_blueprint(analytics_router)

bcrypt = Bcrypt(app)
CORS(app, origins="*")
jwt = JWTManager(app)
mail = Mail(app)
def send_email(subject, message, recipients):
    msg = Message(
    subject= subject,
    sender=os.getenv('ADMIN_EMAIL'),
    recipients=recipients)

    msg.html = message
    try:
        res = mail.send(msg)
        return {"data" :res, "message" :'Email sent successfully'}
    except Exception as e:
        print(e)
        return {"message" : "Could not send email"}, 401

@app.route('/')
def index():

    return 'Index'

if __name__ == '__main__':

    app.run(port=5000, debug=True)




