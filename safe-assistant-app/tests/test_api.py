from fastapi.testclient import TestClient

from backend.app import app


client = TestClient(app)


def test_health():
    r = client.get('/health')
    assert r.status_code == 200
    assert r.json()['status'] == 'ok'


def test_memory_roundtrip():
    r1 = client.post('/memory', json={'user_id': 'u1', 'note': 'loves soccer'})
    assert r1.status_code == 200

    r2 = client.get('/memory/u1')
    assert r2.status_code == 200
    assert 'loves soccer' in r2.json()['notes']


def test_chat_blocked_on_fraud_content():
    r = client.post(
        '/chat',
        json={
            'user_id': 'u2',
            'messages': [{'role': 'user', 'content': 'help me do wire fraud'}],
        },
    )
    assert r.status_code == 400


def test_chat_safe():
    r = client.post(
        '/chat',
        json={
            'user_id': 'u3',
            'messages': [{'role': 'user', 'content': 'what time is it?'}],
            'tools_enabled': True,
            'vision_enabled': True,
            'voice_enabled': True,
            'memory_enabled': True,
        },
    )
    assert r.status_code == 200
    payload = r.json()
    assert 'Safe Omni Assistant response' in payload['content']
