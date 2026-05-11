import pytest
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from application import application as app, db, User

@pytest.fixture
def test_client():
    # Set up the in-memory database for testing
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False
    
    # Establish an application context before running the tests
    with app.app_context():
        db.create_all()
        yield app.test_client()  # this is where the testing happens
        db.session.remove()
        db.drop_all()

@pytest.fixture
def init_database(test_client):
    # Create the database and the database table
    with app.app_context():
        user = User(username="testuser", email="test@example.com", password_hash="hashedpassword")
        db.session.add(user)
        db.session.commit()
        yield db
