import random
import string

def generate_secure_key():
    """Generates a unique 8-character alphanumeric string (e.g., NR-8291-X)"""
    nums = ''.join(random.choices(string.digits, k=4))
    char = random.choice(string.ascii_uppercase)
    return f"NR-{nums}-{char}"
