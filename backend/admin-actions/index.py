'''
Business: API для административных действий (выдача денег, удаление объявлений, бан пользователей)
Args: event - dict с httpMethod, body, headers (JWT token)
      context - объект с request_id, function_name
Returns: HTTP response с результатом действия
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
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
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
        is_admin = decoded.get('is_admin', False)
        admin_id = decoded.get('user_id')
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid or expired token'}),
            'isBase64Encoded': False
        }
    
    if not is_admin:
        return {
            'statusCode': 403,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Admin access required'}),
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
    
    if method == 'GET':
        action = event.get('queryStringParameters', {}).get('action', '')
        
        if action == 'users':
            cur.execute('''
                SELECT id, username, email, balance, is_banned, is_admin 
                FROM users 
                ORDER BY id ASC
            ''')
            users = []
            for row in cur.fetchall():
                users.append({
                    'id': row[0],
                    'username': row[1],
                    'email': row[2],
                    'balance': float(row[3]),
                    'is_banned': row[4],
                    'is_admin': row[5]
                })
            cur.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'users': users}),
                'isBase64Encoded': False
            }
        
        elif action == 'listings':
            cur.execute('''
                SELECT ga.id, ga.game_title, ga.account_level, ga.price, 
                       u.username as seller, ga.created_at
                FROM game_accounts ga
                JOIN users u ON ga.seller_id = u.id
                WHERE ga.is_sold = FALSE
                ORDER BY ga.created_at DESC
            ''')
            listings = []
            for row in cur.fetchall():
                listings.append({
                    'id': row[0],
                    'game_title': row[1],
                    'account_level': row[2],
                    'price': float(row[3]),
                    'seller': row[4],
                    'created_at': str(row[5])
                })
            cur.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'listings': listings}),
                'isBase64Encoded': False
            }
    
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'give_money':
            user_id = body_data.get('user_id')
            amount = body_data.get('amount')
            
            if not user_id or not amount:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'user_id and amount are required'}),
                    'isBase64Encoded': False
                }
            
            try:
                amount_float = float(amount)
            except (ValueError, TypeError):
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Invalid amount'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                'UPDATE users SET balance = balance + %s WHERE id = %s RETURNING username, balance',
                (amount_float, user_id)
            )
            result = cur.fetchone()
            
            if not result:
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
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': f'Added ${amount_float} to {result[0]}',
                    'new_balance': float(result[1])
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'ban_user':
            user_id = body_data.get('user_id')
            
            if not user_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'user_id is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                'UPDATE users SET is_banned = TRUE WHERE id = %s RETURNING username',
                (user_id,)
            )
            result = cur.fetchone()
            
            if not result:
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
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': f'User {result[0]} has been banned'
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'unban_user':
            user_id = body_data.get('user_id')
            
            if not user_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'user_id is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                'UPDATE users SET is_banned = FALSE WHERE id = %s RETURNING username',
                (user_id,)
            )
            result = cur.fetchone()
            
            if not result:
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
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': f'User {result[0]} has been unbanned'
                }),
                'isBase64Encoded': False
            }
    
    elif method == 'DELETE':
        query_params = event.get('queryStringParameters', {})
        listing_id = query_params.get('listing_id')
        
        if not listing_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'listing_id is required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            'UPDATE game_accounts SET is_sold = TRUE WHERE id = %s RETURNING game_title',
            (listing_id,)
        )
        result = cur.fetchone()
        
        if not result:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Listing not found'}),
                'isBase64Encoded': False
            }
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': f'Listing {result[0]} has been removed'
            }),
            'isBase64Encoded': False
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 400,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Invalid request'}),
        'isBase64Encoded': False
    }
