#Import Packages
from flask import Flask, request, jsonify, redirect
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
import sys, json

#Import Custom Packages
from Assets.db_connector import GetToken, LoginUser, AddUser, AddNewApp, AddNewAppEndpoint
from Assets.functions import generate_random_string


#Define the app
app = Flask(__name__)
api = Api(app)
CORS(app, resources={r"/*": {"origins": "*"}})

# API parameters
app.config['MAX_CONTENT_LENGTH'] = 200 * 1024 * 1024

# TODO:

# Add endpoint error handling
# Add a endpoint for adding apps

# FINISHED TODO:

# Add the login feature
# add the signUp feature


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

# Add App
AddApp_args = reqparse.RequestParser()
AddApp_args.add_argument("userId", type=int, required=True) 
AddApp_args.add_argument("appName", type=str, required=True)
AddApp_args.add_argument("endpoints", type=list, required=True)
AddApp_args.add_argument("endpointNames", type=list, required=True)

# ----------------------------------------------------------------
#                        Request Handeling
# ----------------------------------------------------------------

#                         --- Classes ---

class UserSignUp_Endpoint(Resource):
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

class UserLogIn_Endpoint(Resource):
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

class AddApp_Endpoint(Resource):
    def post(self):
        AddApp_args.parse_args()
        payload = request.get_json()
        userId = int(payload["userId"])
        appName = payload["appName"]
        endpoints = payload["endpoints"]
        endpointsNames = payload["endpointNames"]
        
        endpointsWithDuplicateUrls = False
        try:
            addAppResponse = AddNewApp(userId, appName)
            if addAppResponse["status"] == 106:
                return jsonify({"status" : 106, "data" : "An app with this name already exists!"})
            elif addAppResponse["status"] == 200:
                print(type(endpoints))
                print(endpoints)
                print(endpointsNames)
                for index, endpoint in enumerate(endpoints):
                    newEndpointResponse = AddNewAppEndpoint(addAppResponse["appId"], endpoint, endpointsNames[index])
                    if newEndpointResponse["status"] == 108:
                        endpointsWithDuplicateUrls = True
                if endpointsWithDuplicateUrls:
                    return jsonify({"status" : 200, "data" : "Some endpoints have duplicate url's. They have been removed!"})
                return jsonify({"status" : 200, "data" : ""})
            else:
                return jsonify({"status" : 502, "data" : "An error occurred while add a new app!"})
        except Exception as err:
            error = {"status" : 552, "data" : "An error occurred while add a new app!"}
            print(error, err)
            return jsonify(error)

# API Rounts

#Admin

@app.route("/")
def root():
    return redirect("https://amnezia.go.ro/")

# Endpoints

api.add_resource(UserSignUp_Endpoint, "/api/signup")

api.add_resource(UserLogIn_Endpoint, "/api/login")

api.add_resource(AddApp_Endpoint, "/api/add_app")


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