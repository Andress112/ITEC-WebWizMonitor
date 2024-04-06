# Import Package
from argon2 import PasswordHasher, exceptions

# Hash the password
def hash_password(password):
    ph = PasswordHasher()
    hashed_password = ph.hash(password)
    return hashed_password

# verify the password
def verify_password(input_password, hashed_password):
    ph = PasswordHasher()
    try:
        ph.verify(hashed_password, input_password.encode())
        return True
    except exceptions.VerifyMismatchError:
        return False