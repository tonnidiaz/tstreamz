
from flask import Flask,jsonify, request, Response, Blueprint
from threading import Thread
from utils.functions import send_mail
from user.models import User, AnonymousUser as AU, OTP
import jwt, datetime,json,random, string, uuid
from dotenv import load_dotenv
import os, cloudinary,json, requests, re, time, asyncio
import cloudinary.uploader
from flask_bcrypt import Bcrypt
from random import *
from temps.models import TempToken
from flask_mail import Mail, Message
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required, verify_jwt_in_request
from temps.models import TempPath, TempToken

router = Blueprint('user', __name__)
bcrypt = Bcrypt()

load_dotenv()

mail = Mail()



def validate_email(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    return True if re.match(regex, email) else False
 
# Configure cloudinary
cloudinary.config(cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'), api_key=os.getenv('CLOUDINARY_API_KEY'), 
    api_secret=os.getenv('CLOUDINARY_API_SECRET'))
def gen_id(N):

    ids_path = os.path.join(os.path.dirname(__file__), 'ids.json')
    with open(ids_path) as f:
        users = json.load(f)['users']
        
        ran_id = str(''.join(choices(string.ascii_lowercase + string.digits, k = N)))
    if ran_id in users:
        gen_id(N)
    else:
        users.append(ran_id)
        with open(ids_path, 'w') as f:
            json.dump({"users" : users},f) 
        return ran_id

def gen_pass():
    
    characters = string.ascii_letters + string.punctuation  + string.digits
    password =  "".join(choice(characters) for x in range(randint(8, 16)))
    return password

def gen_token(identity, time={'h' : 24}):
    
    k = list(time.keys())[0] 
    v = list(time.values())[0]
    if k == 'h':
        token = create_access_token(identity=identity, expires_delta=datetime.timedelta(hours=v))

    elif k == 'm':
        token = create_access_token(identity=identity, expires_delta=datetime.timedelta(minutes=v))

    return token

@router.route('/users', methods=['GET'])
def users():
    
    try:
        users = User.objects()

        def clean_users(user):

            user = user.to_json()
            return json.loads(user)

        data = list(map(clean_users, users))
        #print(data)

        return {'users': data}
    except Exception as e:
        print(e)
        return "A server-side error has occured", 500
    
    

def gen_code():

    codes = TempToken.objects()
    _min = 100000
    _max = 999999
    code = randint(_min, _max - 1)
    def fun():
        code_exists = TempToken.objects(code=code).first()

        if code_exists:
            gen_code()
        else:
            return code

    c = fun()
    return c


async def fun():
    print('This is fun')
@router.get('/test')
def test():

    
    def funo():
        time.sleep(5)
        print('Hello')
    thread = Thread(target=funo)
    thread.start()
    return 'ok'


@router.route('/auth/signup', methods=['POST'])

def signup():

    method = request.args['method']
    try:
        username = request.form.get('username')

        email = request.form.get('email')
        oiid = request.form.get('iid')
        password = request.form.get('password')
        existing_email = User.objects(email=email)

        if method == 'google':
            iid = gen_id(7)
            username = iid
            password = gen_pass()

            if existing_email:
                #login user
                user = User.objects(email=email)
                if user:
                    user = user[0]._data
                    del user['password']
                    user['id'] = str(user['id'])
                    token = gen_token( email, {'h' : 24})

                    songs = get_songs(user)
                    return {'user': user, 'token': token}

        iid = gen_id(7)
        hashed_pass = bcrypt.generate_password_hash(password)
        existing_username = User.objects(username=username)

        if existing_username:
            if existing_username[0].is_verified:
                return {'message' : f'User with username {username} already exists!'}, 400
            else:
                existing_username[0].delete()

        if existing_email:
            if existing_email[0].is_verified:
                return {'message' : f'User with email {email} already exists!'}, 400
            else:
                existing_email[0].delete()

        user = User()
        for key, value in request.form.items():
            setattr(user, key, value)
        if not validate_email(email):
            return {'message' : 'Please enter a valid email address.'}, 400
        if oiid:
            user.password = password
        else:
            user.password = hashed_pass.decode()
        user.iid = iid
        user.username = username
        user.save()

        otp = OTP()
        otp.user = f"{user.id}"
        otp.date_created = datetime.datetime.now()
        otp.save()

        try:   

            def del_tkn():
                time.sleep(300)
                otp.delete()
                print('Code expred and deleted.')
            thread = Thread(target=del_tkn)
            thread.start()

            link = f"{os.getenv('CLIENT_URL')}/auth/signup/complete/{otp.id}"
            print(link)
            return send_mail(
                subject= "TunedStreamz validation email",
                 body = f"""
            <h1>Thank you for signing up to TunedStreamz!</h1>
               
            <p>Use this link to verify your email:</p>
            <p>Do not share this link with anyone!</p>
            <a href="{link}">{link}</a>
                  <p>The link is <b>valid</b> for only <b>5 minutes</b>.</p>

            
            <p>For support please contact us at <a href="mailto:{os.getenv("ADMIN_EMAIL")}">{os.getenv("ADMIN_EMAIL")}</a></p>
            </div>

        </body>
        </html>
                 """ ,
                  recipients=[email],
                   res={"msg": "Signup successful!"})

        except Exception as e:
            print(e)
            return Response(
                response= 'Something went wrong!',
                status= 500,
            )
    except Exception as e:
            print(e)
            return 'Something went wrong', 500

@router.post('/auth/code/reset')
def reset_code():
    token = request.form.get('tkn');
    r_token = request.form.get('r_tkn');
    print(r_token)
    #temp_token = TempToken.objects(token=token).first();
    temp_token = TempToken()
    if r_token:
        info = jwt.decode(r_token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
        identity = info['sub']
        email = identity['email']
        token = gen_token(identity, {'m' : 5})
        OTP = gen_code()

        temp_token.token = token
        temp_token.code = OTP
        temp_token.save()

        def del_code():
            time.sleep(300)
            temp_token.delete()
            print('Code expired')

        thread  = Thread(target=del_code)
        thread.start()

        #return {'token': token, 'OTP': OTP}
        return send_email(
                    subject= "TunedStreamz validation email",
                     message = f"""
                     <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style type="text/css">


                        .TunedStreamz{{
                            font: medium/ 1.5  Arial,Helvetica,sans-serif !important;
                            margin: auto;
                            padding: 10px;
                            color: black;

                        }}





                        .btn {{
                            cursor: pointer;
                            display: inline-block;
                            min-height: 1em;
                            outline: 0;
                            border: none;
                            vertical-align: baseline;
                            background: #e0e1e2 none;
                            color: rgba(0,0,0,.6);
                            font-family: Lato,"Helvetica Neue",Arial,Helvetica,sans-serif;
                            margin: 0 .25em 0 0;
                            padding: .78571429em 1.5em;
                            text-transform: none;
                            text-shadow: none;
                            font-weight: 600;
                            line-height: 1em;
                            font-style: normal;
                            text-align: center;
                            text-decoration: none;
                            border-radius: .28571429rem;
                            box-shadow: inset 0 0 0 1px transparent,inset 0 0 0 0 rgba(34,36,38,.15);
                            -webkit-user-select: none;
                            -ms-user-select: none;
                            user-select: none;
                            transition: opacity .1s ease,background-color .1s ease,color .1s ease,box-shadow .1s ease,background .1s ease;
                            will-change: "";
                            -webkit-tap-highlight-color: transparent;
                        }}
                        .btn-primary {{
                            color: #fff !important;
                            background-color: #0d6efd !important;
                            border-color: #0d6efd !important;

                        }}
                </style>
            </head>
            <body>

                <div class="TunedStreamz">

                <h1>Thank you for signing up to TunedStreamz!</h1>

                <p>Here is your OTP:</p>
                <p>Do not share this OTP with anyone!</p>
                <p style="text-align: center; color: rgb(223, 101, 1);font-size: 25px;font-weight: bold;letter-spacing: 2.5px">{temp_token.code}</p>
                <h3>The OTP is valid only for 5 minutes.</h3>

                <p>For support please contact us at <a href="mailto:{os.getenv("ADMIN_EMAIL")}">{os.getenv("ADMIN_EMAIL")}</a></p>
                </div>

            </body>
            </html>
                     """ ,
                      recipients=[email],
                       res={'token': token})

    else:
        return 'Invalid token', 400

@router.get("/auth/otp/<oid>")
def get_otp(oid):
    otp = OTP.objects(id=oid)
    if otp:
        usr = User.objects(id=otp[0].user)
        if usr:
            print("Saving user...")
            usr[0].update(is_verified = True ) 
            usr[0].save()
            otp.delete()
            token = gen_token(usr[0].email)
            return {'token' : token}
        else:
            return "Not found", 404
        
    else:
        return "Code not found", 404

@router.post('/auth/getuser')
@jwt_required()
def get_user():
    email = validate(request)['sub']
    user = User.objects(email = email).first()
    token = request.headers['Authorization'].split(' ')[1]
    if user:
        return jsonify({'user' : user.to_json(), 'token': token})

    else:
        return 'invalid token', 404


@router.route('/auth/login', methods=['POST'])

def login():
    
    email = request.form.get('email')
    password = request.form.get('password')
    user = User.objects(email=email).first()


    if user:

        password_correct = bcrypt.check_password_hash(bytes(user.password, encoding='utf-8'), password)
        if password_correct:
            token = gen_token(email)
            
            data = user.to_json()
            return {'user' : json.loads(data), 'token' : token}
        else:
            print("Incorrect pass")
            return {"message" : "Incorrect Password"}, 400
    else:
        print("User does not exist")
        return {"message" : "User does not exist"}, 400

    return email
    


@router.route('/user/<iid>', methods=['GET', 'POST'])
def user(iid):

    user = User.objects(iid = iid).first()
    if request.method == 'GET':

        if user:
            query = request.args
            user = user.to_json()

            return {'user' : json.loads(user)}

        else:
            return {'message' : 'No such user'}, 404
    else:

        try:

            if user:
                user = user[0]._data
                del user['id']
                del user['password']
                return jsonify({'user' : user})
            else:
                return {'message' : "User with those credentials not found."}, 404

        except Exception as e:
            print(e)
            return {"message" : 'Something went wrong!'}, 500

def validate(request):
    token = request.headers['Authorization'].split(' ')[1]
    info = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
    return info

@router.route('/auth/confirm', methods=['POST'])
def confirm():

    token = request.args['token']

    if token:
        try:
            info = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
            email = info['sub']['email']
            if User.objects(email = email):
                return {'token' : gen_token(email)}, 302
            else:
                user = User()
                for key, val in info['sub'].items():
                    setattr(user, key, val)

                if True:
                    user.is_verified = True
                    user.save()
                    if email != f'{os.getenv("ADMIN_EMAIL")}':
                        admin = User.objects(email=f'{os.getenv("ADMIN_EMAIL")}').first()
                        admin.save()

                    user = user._data
                    del user['password']
                    user['id'] = str(user['id'])
                    return {'user' : user, 'token' : gen_token(user['email'])}

        except Exception as e:
            print(e)

            if str(e) == 'Signature verification failed':
                return {'message' : 'Invalid Token'}, 401
            return {'message' : 'Something went wrong'}, 500
    return {'data': 'Conf'}


@router.route('/auth/forgot', methods=['POST'])
def forgot():

    try:
        email = request.form['email']
        user = User.objects(email=email).first()
        if user:
            tp = TempPath()
            tp.user = email
            tp.save()

            message = f"""<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">


            .TunedStreamz{{
                     font: medium/ 1.5  Arial,Helvetica,sans-serif !important;
                margin: auto;
                padding: 10px;
        }}

            .TunedStreamz *, .TunedStreamz{{
                -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
            }}

            .TunedStreamz::-webkit-scrollbar{{
                display: none;
              }}

            .btn {{
                display: inline-block;
                font-weight: 400;
                line-height: 1.5;
                color: #212529;
                text-align: center;
                text-decoration: none;
                vertical-align: middle;
                cursor: pointer;
                -webkit-user-select: none;
                -moz-user-select: none;
                user-select: none;
                background-color: transparent;
                border: 1px solid transparent;
                padding: .375rem .75rem;
                font-size: 1rem;
                border-radius: .25rem;
                transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;}}
            .btn-primary {{
                color: #fff;
                background-color: #0d6efd;
                border-color: #0d6efd;
            }}

            .brand{{
                font-weight: 800
            }}
            .red{{
                background-color: #db2828;
                color: #fff !important;
                text-shadow: none;
                background-image: none;
            }}
    </style>
</head>
<body>

    <div class="TunedStreamz">

        <h1 style="font-size: 24px">Reset Password</h1>
        <p>You have requested to reset your password for your <a href="{os.getenv('CLIENT_URL')}" class="brand">TunedStreamz</a> account.</p>

        <a style="font-weight: normal" class="red btn"  href="{os.getenv('CLIENT_URL') + '/auth/reset/' + str(tp.id)}">Reset password</a>

        <p>

            If button does not work, use this url: 
            <a href="{os.getenv('CLIENT_URL') + '/auth/reset/' + str(tp.id)}">{os.getenv('CLIENT_URL') + '/auth/reset/' + str(tp.id)}</a>
        </p>
    <p>For support please contact us at <a href="mailto:{os.getenv("ADMIN_EMAIL")}">{os.getenv("ADMIN_EMAIL")}</a></p>
    </div>
    
</body>
</html>"""

            try:
                send_email('Recover password', message, [email], res=None)
            except Exception as e:
                print(e)
                return {"message" : 'Something went wrong. We could not send the email.'}, 500
        else:
            return {'message' : 'No user with specified email found!'},404
        return 'Hang on'

    except Exception as e:
        print(e)
        return {"message" : 'Something went wrong'}, 500

@router.route('/auth/reset',methods=['POST'])
def reset():

    if request.method  == 'POST':
        try:
            oid = request.args['oid']
            temp = TempPath.objects(pk=oid).first()
            if temp:
                user = User.objects(email = temp.user).first()

                password = request.form['password']
                hashed_pass = bcrypt.generate_password_hash(password)
                user.password = hashed_pass.decode()
                user.save()
                temp.delete()
                return "Password reset successful!"

            else:
                return {'message' : 'UNAUTHORIZED'}, 401
        except Exception as e: 
            print(e)
            return {"message" : 'Something went wrong'}, 500
        
        
@router.route('/user/<iid>/terminate', methods=['POST'])
def terminate(iid):

    try:
        token = request.headers['Authorization'].split(' ')[1]

        if token:

            info = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
            if info:
                user = User.objects.get(email= info['sub'])

                image = None
                try:
                    image = Media.objects(name=user.avatar.split('/')[-1]).first()
                except Exception as e:
                    pass
                if image:
                    image.delete()
                    print('Avatar deleted')
                user.delete()
            return {'data' : 'User account deleted successfully'}
    except Exception as e:
        print(e)
        return {'message' : 'Something went wrong'}, 500

@router.route('/user/<iid>/confirm-password', methods=['POST'])
@jwt_required()
def confirm_pass(iid):

    try:
        email = email = validate(request)['sub']
        password = request.form['password']
        if email:
            user = User.objects(email=email).first()

            if user:
                pass_correct = bcrypt.check_password_hash(bytes(user.password, encoding='utf-8'), password)
                if pass_correct:
                    return 'Password correct', 200

                else:
                    return {"message" : "Incorrect password"}, 400

            else:

                return "Unauthorized", 401

    except Exception as e:
        print(e)
        return 'Something went wrong', 500

@router.route('/delpic/<oid>', methods=['POST'])
def delpic(oid):
    print(oid)
    try:
        img = Media.objects(pk=oid)
    except Exception as e:
        print(e)
    return 'working'

import mongoengine as me
@router.post('/visit')
def visit():
    form = request.form
    if 'ip'in form:
        ip = form['ip']
        print(ip)
        user = AU()
        try:
            user.ip = ip
            
            user.save()
            print('New anonymous user saved')
            return 'OK', 200
        except me.NotUniqueError:
            return '', 200
        
    else:
        return 'No IP',400

@router.post('/account/change-pass')
@jwt_required()
def change_pass():

    try:
        form = request.form
        email = validate(request)['sub']

        user =User.objects(email=email).first()
        if user:
            opass = form['opass']
            pwd = form['pwd']

            pswd_correct = bcrypt.check_password_hash(bytes(user.password, encoding='utf-8'), opass)
            if pswd_correct:
                hashed_pass = bcrypt.generate_password_hash(pwd)
                user.password = hashed_pass
                return 'Password changed successfully'

            else:
                return 'Incorrect old Password', 400
        else:

            return 'No user with specified email found', 404
        
    except Exception as e:
        print(e)
        return 'Something went wrong', 500
    




@router.route('/user/watchlist', methods=[ 'GET', 'POST' ])
@jwt_required()
def watchlist():
    
    email = validate(request)['sub']
    
    user = User.objects(email = email).first()
    
    if request.method == 'POST':
        
        args = request.args
        form = request.form
        if 'watchlist' in form:
            
            user.watchlist = form['watchlist']
            user.save()
            return 'Saved to watchlist'
        else:
            return "Bad request", 401
    else:
        wlist = user.watchlist
       
        return {'watchlist' : wlist}
    
@router.get('/api/daily')
def get_daily():
    now = datetime.datetime.now()
    s = now.strftime("%m_%d_%Y")
    print(s)
    url = f'http://files.tmdb.org/p/exports/movie_ids_{s}.json.gz'
    print(url)
    
    return 'Ok'

@router.route('/user/<iid>/update', methods=['GET', 'POST'])
@jwt_required()
def update_user(iid):

    params = request.args
    feature = params['f']

    
    email = validate(request)['sub']
    info = request.form
    if email:
        user = User.objects(email=email).first()
        if feature == 'info':
            try:
                
                username = info['username']
                existing_username = User.objects(username=username)
                if existing_username:

                    # Save rest of data
                    for key, value in info.items():
                        if key != 'username':
                            setattr(user, key, value)
                    user.save()
                    if user.username == username:
                        return{"msg": 'Done', "user": user.to_json()}, 200
                    else:                
                        return {"message" : f"Another user is using that username"}, 400
                else:
                    for key, value in info.items():
                        setattr(user, key, value)
                    if user.is_joining:
                        user.is_joining = False
                    user.save()
                    return jsonify({'msg' : 'Info updtate', "user": user.to_json()})

            except Exception as e:
                print(e)
                return {'message' : 'Something went wrong'}, 500
        if feature == 'email':
            user.email = info['email']
            user.save()
            return 'Email changed successfully', 200
        if feature == 'avatar':
            img = request.files['file']
            if img:
                #upload_result = cloudinary.uploader.upload(img)
                #user.avatar = upload_result['url']
                ext = img.filename.split('.')[-1]
                image = Media()
                image.name = 'TunedBass_' + uuid.uuid4().hex + '.' + ext
                image._type = "image"
                image.ext = ext
                image._file.put(img, content_type=img.mimetype)
                image.save()

                print('Checking old image...')
                old_image = None
                try:
                    old_image = Media.objects(name=str(user.avatar.split('/')[-1])).first()
                except Exception as e:
                    pass
                    if old_image:
                        old_image.delete()
                        print('Old image deleted')
                user.avatar = os.getenv('DB_URL') + '/media/images/' + str(image.name)
                user.save()
                return jsonify({'url' : user.avatar})
    else:
        print('Invalid Token')
        return {'message' : 'Invalid token'}, 401
