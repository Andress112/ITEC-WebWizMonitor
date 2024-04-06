#Import Package

import random, string, re

# MAC_PATTERN = re.compile(r'^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$')
pin_pattern = re.compile(r'^\d{4}$')
id_pattern = re.compile(r'^[0-9a-fA-F]{16}$')


# Generate a random
def generate_random_string(length):
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string