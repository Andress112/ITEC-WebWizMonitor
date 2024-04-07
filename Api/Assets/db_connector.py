#Import Packages

import mariadb, json, requests
from datetime import datetime, timedelta
from .Encrypt import hash_password, verify_password
from .functions import generate_random_string
import jwt

# TODO:


try:
    db_pool = mariadb.ConnectionPool(
        pool_name="WebWizMonitor",
        pool_size=64,
        # host="amnezia.go.ro",
        host="127.0.0.1",
        port=3309,
        user="WebWiz_admin",
        password="4sFRvTTwjW6EdUKqiyXc",
        database="WebWizMonitor"
    )
except mariadb.Error as e:
    print(f"Error connecting to MariaDB: {e}")
    exit(2)

def get_db_connection():
    return db_pool.get_connection()

maxTryes = 10 # The number of failed attempts before exiting

# ----------------------------------------------------------------
#                        API Functions
# ----------------------------------------------------------------

# Functions

def GetSKey():
    with open("./Assets/Secret_Key.txt", "r") as fKey:
        SECRET_KEY = fKey.read()
        return SECRET_KEY

def GetToken(User, userId, Email, status):
    global maxTryes
    tryes = 0
    while tryes < maxTryes:
        try:
            User = User.lower()
            if User[0].isalpha():
                User = User[0].upper() + User[1:]
            Token = jwt.encode({"User": User, "exp": datetime.now() + timedelta(days=1), "Id" : userId, "email" : Email, "status": status}, GetSKey())
            return Token
        except Exception as e:
            print(e)
            tryes += 1
            continue
    if (tryes == 10):
        return False    
    
def AddUser(Username, Password, Email):
    global maxTryes
    tryes = 0
    while tryes < maxTryes:
        try:
            db = get_db_connection()
            dbcursor = db.cursor()
            try:
                Username = Username.lower()
                Email = Email.lower()
                dbcursor.execute("SELECT name FROM users WHERE name = ? OR email = ?;", (Username, Email))
                User_exists = dbcursor.fetchone()
                if User_exists != None:
                    if User_exists[0] == Username:
                        return {"status": 100}
                    else:
                        return {"status": 101}
                else:
                    Password = hash_password(Password)
                    try:
                        dbcursor.execute("INSERT INTO users (name, password, email, status) VALUES (?, ?, ?, ?)", (Username, Password, Email, 0))
                        db.commit()
                        NewUserId = dbcursor.lastrowid
                        return {"status": 200, "username": Username, "userId": NewUserId, "userEmail": Email}
                    except:
                        return {"status": 0}
            except Exception as e:
                print(e)
                tryes += 1
        except mariadb.Error as e:
            tryes += 1
            print(f"Database error: {e}")
        finally:
            if dbcursor:
                dbcursor.close()
            if db:
                db.close()
    if (tryes == 10):
        return {"status": 0}

def LoginUser(Username, Password, Email):
    global maxTryes
    tryes = 0
    while tryes < maxTryes:
        try:
            db = get_db_connection()
            dbcursor = db.cursor()
            try:
                Email = Email.lower()
                Username = Username.lower()
                if Username == "":
                    authTipe = 1
                else:
                    authTipe = 2
                dbcursor.execute("SELECT * FROM users WHERE name = ? OR email = ?;", (Username, Email))
                User = dbcursor.fetchone()
                if User != None:
                    if verify_password(Password, User[3]):
                        return {"status": 200, "username": Username, "userId": User[0], "userEmail": Email, "userStatus": User[5]}
                    else:
                        return {"status": 105}
                else:
                    if authTipe == 1:
                        return {"status": 104}
                    elif authTipe == 2:
                        return {"status": 103}
            except Exception as e:
                print(e)
                tryes += 1
        except mariadb.Error as e:
            tryes += 1
            print(f"Database error: {e}")
        finally:
            if dbcursor:
                dbcursor.close()
            if db:
                db.close()
    if (tryes == 10):
        return {"status": 0}

def AddNewApp(userId, appName, appImage):
    global maxTryes
    tryes = 0
    while tryes < maxTryes:
        try:
            db = get_db_connection()
            dbcursor = db.cursor()
            try:
                if len(appName) < 1:
                    return {"status": 107}
                appName = appName.lower() 
                if appName[0].isalpha():
                    appName = appName[0].upper() + appName[1:]
                dbcursor.execute("SELECT Id FROM apps WHERE name = ?;", (appName,))
                appExists = dbcursor.fetchone()
                if appExists == None:
                    dbcursor.execute("INSERT INTO apps (name, app_picture, status, uptime, user_id) VALUES (?, ?, ?, ?, ?)", (appName, appImage, 2, 100.0, userId))
                    db.commit()
                    NewAppId = dbcursor.lastrowid
                    return {"status": 200, "appId": NewAppId}
                else:
                    return {"status": 106}
            except Exception as e:
                print(e)
                tryes += 1
        except mariadb.Error as e:
            tryes += 1
            print(f"Database error: {e}")
        finally:
            if dbcursor:
                dbcursor.close()
            if db:
                db.close()
    if (tryes == 10):
        return {"status": 0}

def IsEndpointOk(url):
    global maxTryes
    tryes = 0
    while tryes < maxTryes:
        try:
            response = requests.get(url)
            if response.status_code == 200 or response.status_code == 302: 
                return True
            else:
                return False
        except:
            tryes += 1
    if (tryes == 10):
        return False

def AddNewAppEndpoint(appId, url, title):
    global maxTryes
    tryes = 0
    while tryes < maxTryes:
        try:
            db = get_db_connection()
            dbcursor = db.cursor()
            try:
                if len(url) < 1:
                    return {"status": 109}
                dbcursor.execute("SELECT Id FROM endpoints WHERE url = ? AND app_id = ?;", (url, appId))
                appExists = dbcursor.fetchone()
                if appExists == None:
                    IsEndpointOnline = IsEndpointOk(url)
                    if IsEndpointOnline:
                        EndpointStatus = 2
                    else:
                        EndpointStatus = 0
                    dbcursor.execute("INSERT INTO endpoints (url, title, request_interval, status, uptime, app_id) VALUES (?, ?, ?, ?, ?, ?)", (url, title, 60, EndpointStatus, 100.0, appId))
                    db.commit()
                    return {"status": 200}
                else:
                    return {"status": 108}
            except Exception as e:
                print(e)
                tryes += 1
        except mariadb.Error as e:
            tryes += 1
            print(f"Database error: {e}")
        finally:
            if dbcursor:
                dbcursor.close()
            if db:
                db.close()
    if (tryes == 10):
        return {"status": 0}

def getDevApps(userId):
    global maxTryes
    tryes = 0
    while tryes < maxTryes:
        try:
            db = get_db_connection()
            dbcursor = db.cursor()
            try:
                dbcursor.execute("SELECT * FROM apps WHERE user_id = ?;", (userId,))
                appExists = dbcursor.fetchall()
                if not appExists:
                    return {"status": 110}
                return {"status": 200, "apps": appExists}
            except Exception as e:
                print(e)
                tryes += 1
        except mariadb.Error as e:
            tryes += 1
            print(f"Database error: {e}")
        finally:
            if dbcursor:
                dbcursor.close()
            if db:
                db.close()
    if (tryes == 10):
        return {"status": 0}

def checkAppEndPoints(AppId):
    global maxTryes
    tryes = 0
    while tryes < maxTryes:
        try:
            db = get_db_connection()
            dbcursor = db.cursor()
            try:
                dbcursor.execute("SELECT url, id FROM endpoints WHERE app_id = ?;", (AppId,))
                AppEndpoints = dbcursor.fetchall()
                for endpoint in AppEndpoints:
                    ErroredRequests = 0
                    for i in range(0, 10):
                        try:
                            status = IsEndpointOk(endpoint)
                            if not status:
                                ErroredRequests += 1
                        except requests.ConnectionError:
                            ErroredRequests += 1
                    if ErroredRequests == 10: 
                        endpointStatus = 0
                    elif ErroredRequests > 0:
                        endpointStatus = 1
                    if endpointStatus != 0:
                        dbcursor.execute("SELECT url, id FROM endpoints WHERE app_id = ?;", (AppId,))
            except Exception as e:
                print(e)
                tryes += 1
        except mariadb.Error as e:
            tryes += 1
            print(f"Database error: {e}")
        finally:
            if dbcursor:
                dbcursor.close()
            if db:
                db.close()
    if (tryes == 10):
        return {"status": 0}
