import json

def test_health_endpoint(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/api/health' page is requested (GET)
    THEN check that the response is valid
    """
    response = test_client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'status' in data
    assert data['status'] == 'ok'

def test_register_endpoint(test_client):
    """
    GIVEN a Flask application
    WHEN the '/api/register' page is posted to
    THEN check that a new user is registered
    """
    response = test_client.post('/api/register',
                                json={
                                    "username": "newuser",
                                    "email": "newuser@example.com",
                                    "password": "password123"
                                })
    assert response.status_code == 201
    assert b"User created successfully" in response.data

def test_login_endpoint(test_client, init_database):
    """
    GIVEN a Flask application and an existing user
    WHEN the '/api/login' page is posted to with valid credentials
    THEN check that a token is returned
    """
    # Note: init_database creates a user with email test@example.com and a fake hash.
    # To test login properly, we need the real werkzeug hash, so let's register one first.
    test_client.post('/api/register',
                     json={
                         "username": "loginuser",
                         "email": "login@example.com",
                         "password": "password123"
                     })
    
    response = test_client.post('/api/login',
                                json={
                                    "email": "login@example.com",
                                    "password": "password123"
                                })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'token' in data
    assert 'user' in data
    assert data['user']['email'] == "login@example.com"

def test_detect_endpoint(test_client):
    """
    GIVEN a Flask application
    WHEN the '/api/detect' page is posted to with a dummy image
    THEN check that a valid response with probabilities is returned
    """
    # Create a dummy image (1x1 pixel) in memory
    from io import BytesIO
    from PIL import Image
    
    file_obj = BytesIO()
    image = Image.new('RGB', size=(1, 1), color=(256, 0, 0))
    image.save(file_obj, 'jpeg')
    file_obj.seek(0)
    
    response = test_client.post('/api/detect', data={
        'file': (file_obj, 'test.jpg')
    })
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'deepfake_probability' in data
    assert 'real_probability' in data
    assert 'verdict' in data
    assert data['demo_mode'] is True or data['demo_mode'] is False
