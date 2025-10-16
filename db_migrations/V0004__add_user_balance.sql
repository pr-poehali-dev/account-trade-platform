ALTER TABLE users ADD COLUMN IF NOT EXISTS balance DECIMAL(15, 2) DEFAULT 0.00;

UPDATE users SET balance = 99999999.99 WHERE username = 'SYSTEM';
UPDATE users SET balance = 100.00 WHERE username != 'SYSTEM' AND balance = 0.00;
