#Import Packages
from flask import Flask, request, jsonify, redirect
from flask_restful import Api, Resource, reqparse
from werkzeug.datastructures import FileStorage
from flask_cors import CORS
import os, sys, json

#Import Custom Packages
from Assets.db_connector import GetToken, LoginUser, AddUser
from Assets.functions import generate_random_string


#Define the app
app = Flask(__name__)
api = Api(app)
CORS(app, resources={r"/*": {"origins": "*"}})

# API parameters
app.config['MAX_CONTENT_LENGTH'] = 200 * 1024 * 1024

# TODO:

# add the signUp feature
# Add the login feature


# FINISHED TODO:



# ----------------------------------------------------------------
#                            Arguments
# ----------------------------------------------------------------

#                          --- Admin ---


# User SignUp
UserSignUp_args = reqparse.RequestParser()
UserSignUp_args.add_argument("username", type=str, required=True)
UserSignUp_args.add_argument("password", type=str, required=True)
UserSignUp_args.add_argument("email", type=str, required=True)

# User login
UserSignUp_args = reqparse.RequestParser()
UserSignUp_args.add_argument("username", type=str) 
UserSignUp_args.add_argument("password", type=str, required=True)
UserSignUp_args.add_argument("email", type=str)


# ----------------------------------------------------------------
#                        Request Handeling
# ----------------------------------------------------------------

#                         --- Classes ---

class UserSignUp(Resource):
    def post(self):
        args = UserSignUp_args.parse_args()
        Username = args["username"]
        Password = args["password"]
        Email = args["email"]
        try:
            signUpResponse = AddUser(Username, Password, Email)
            print(signUpResponse)
            if signUpResponse["status"] == 100:
                return jsonify({"status" : 100, "data" : "The username is already in use!"})
            elif signUpResponse["status"] == 101:
                return jsonify({"status" : 101, "data" : "A user with this email addres already exists!"})
            elif signUpResponse["status"] == 200:
                UserToken = GetToken(signUpResponse["username"], signUpResponse["userId"], signUpResponse["userEmail"], 0)
                if (UserToken != False):
                    return jsonify({"status" : 200, "data" : {"Token" : UserToken}})
                error = {"status" : 500, "data" : "An error occurred while trying to signUp!"}
                print(error)
                return jsonify(error)
            else:
                error = {"status" : 500, "data" : "An error occurred while trying to signUp!"}
                print(error)
                return jsonify(error)
        except Exception as err:
            error = {"status" : 550, "data" : "An error occurred while trying to signUp!"}
            print(error, err)
            return jsonify(error)

class UserLogIn(Resource):
    def post(self):
        args = UserSignUp_args.parse_args()
        Username = args["username"]
        Password = args["password"]
        Email = args["email"]
        try:
            logInResponse = LoginUser(Username, Password, Email)
            if logInResponse["status"] == 103:
                return jsonify({"status" : 103, "data" : "Invalid username!"})
            elif logInResponse["status"] == 104:
                return jsonify({"status" : 104, "data" : "Invalid email!"})
            elif logInResponse["status"] == 105:
                return jsonify({"status" : 105, "data" : "Invalid Password!"})
            elif logInResponse["status"] == 200:
                UserToken = GetToken(logInResponse["username"], logInResponse["userId"], logInResponse["userEmail"], logInResponse["userStatus"])
                if (UserToken != False):
                    return jsonify({"status" : 200, "data" : {"Token" : UserToken}})
                error = {"status" : 501, "data" : "An error occurred while trying to login!"}
                print(error)
                return jsonify(error)
            else:
                error = {"status" : 501, "data" : "An error occurred while trying to login!"}
                print(error)
                return jsonify(error)
        except Exception as err:
            error = {"status" : 551, "data" : "An error occurred while trying to login!"}
            print(error, err)
            return jsonify(error)

# API Rounts

#Admin

@app.route("/")
def root():
    return redirect("https://amnezia.go.ro/")

# Endpoints

api.add_resource(UserSignUp, "/api/signup")

api.add_resource(UserLogIn, "/api/login")


# Run the API
while True:
    try:
        if sys.platform.startswith('linux'):
            if __name__ == "__main__":
                app.run(host="0.0.0.0", port=302)
                break
        else:
            if __name__ == "__main__":
                app.run(host="0.0.0.0", port=301, debug=True)
                break
    except KeyboardInterrupt:
        print("Keyboard interrupt! Stoping the Api...")
        break