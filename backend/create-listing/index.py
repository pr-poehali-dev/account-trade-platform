'''
Business: API для создания объявлений о продаже игровых аккаунтов
Args: event - dict с httpMethod, body, headers (JWT token)
      context - объект с request_id, function_name
Returns: HTTP response с созданным объявлением
'''

import json
import os
import psycopg2
import jwt
from typing import Dict, Any

SECRET_KEY = 'gamemarket_secret_key_2024'

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    auth_token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not auth_token:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Authentication required'}),
            'isBase64Encoded': False
        }
    
    try:
        decoded = jwt.decode(auth_token, SECRET_KEY, algorithms=['HS256'])
        user_id = decoded.get('user_id')
    except jwt.ExpiredSignatureError:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Token expired'}),
            'isBase64Encoded': False
        }
    except jwt.InvalidTokenError:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid token'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    game_title = body_data.get('game_title')
    account_level = body_data.get('account_level')
    price = body_data.get('price')
    description = body_data.get('description', '')
    image_url = body_data.get('image_url', 'https://cdn.poehali.dev/projects/6eff0498-56be-4162-a179-5e3f87acde2a/files/89cbaf60-7031-40e3-9f22-29f514579dce.jpg')
    
    if not game_title or not account_level or not price:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'game_title, account_level, and price are required'}),
            'isBase64Encoded': False
        }
    
    try:
        price_float = float(price)
        if price_float <= 0:
            raise ValueError('Price must be positive')
    except (ValueError, TypeError):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid price value'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database connection not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    cur.execute('SELECT is_banned FROM users WHERE id = %s', (user_id,))
    user_data = cur.fetchone()
    
    if not user_data:
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'User not found'}),
            'isBase64Encoded': False
        }
    
    if user_data[0]:
        cur.close()
        conn.close()
        return {
            'statusCode': 403,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Banned users cannot create listings'}),
            'isBase64Encoded': False
        }
    
    cur.execute(
        '''INSERT INTO game_accounts 
           (seller_id, game_title, account_level, price, description, image_url, is_featured, is_sold) 
           VALUES (%s, %s, %s, %s, %s, %s, FALSE, FALSE) 
           RETURNING id, created_at''',
        (user_id, game_title, account_level, price_float, description, image_url)
    )
    
    listing_data = cur.fetchone()
    conn.commit()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'listing': {
                'id': listing_data[0],
                'game_title': game_title,
                'account_level': account_level,
                'price': price_float,
                'description': description,
                'image_url': image_url,
                'created_at': str(listing_data[1])
            }
        }),
        'isBase64Encoded': False
    }
