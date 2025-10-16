CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_banned BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_accounts (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER REFERENCES users(id),
    game_title VARCHAR(200) NOT NULL,
    account_level VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_sold BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, is_admin) 
VALUES ('SYSTEM', 'system@gamemarket.com', TRUE)
ON CONFLICT (username) DO NOTHING;

INSERT INTO game_accounts (seller_id, game_title, account_level, price, description, is_featured)
SELECT u.id, 'CS:GO', 'Global Elite', 800.00, 'Premium account with rare skins', TRUE
FROM users u WHERE u.username = 'SYSTEM';
