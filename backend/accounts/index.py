'''
Business: API для получения игровых аккаунтов из базы данных
Args: event - dict с httpMethod, queryStringParameters
      context - объект с request_id, function_name
Returns: HTTP response со списком аккаунтов
'''

import json
import os
import psycopg2
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
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
    
    cur.execute('''
        SELECT 
            ga.id,
            ga.game_title,
            ga.account_level,
            ga.price,
            ga.description,
            ga.is_featured,
            u.username as seller
        FROM game_accounts ga
        JOIN users u ON ga.seller_id = u.id
        WHERE ga.is_sold = FALSE
        ORDER BY ga.is_featured DESC, ga.created_at DESC
        LIMIT 20
    ''')
    
    accounts: List[Dict[str, Any]] = []
    for row in cur.fetchall():
        accounts.append({
            'id': row[0],
            'title': row[1],
            'level': row[2],
            'price': float(row[3]),
            'description': row[4],
            'isFeatured': row[5],
            'seller': row[6]
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'accounts': accounts}),
        'isBase64Encoded': False
    }
