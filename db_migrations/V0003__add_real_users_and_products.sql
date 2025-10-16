INSERT INTO users (username, email, password_hash, is_admin, is_banned) 
VALUES 
  ('GamerPro', 'gamerpro@mail.com', '$2b$10$YGvK5Z7z3Y9xH8qVJ4Q3Ku7vK5Z7z3Y9xH8qVJ4Q3Ku7vK5Z7z3Y9x', FALSE, FALSE),
  ('TopSeller', 'topseller@mail.com', '$2b$10$YGvK5Z7z3Y9xH8qVJ4Q3Ku7vK5Z7z3Y9xH8qVJ4Q3Ku7vK5Z7z3Y9x', FALSE, FALSE),
  ('EliteTrader', 'elitetrader@mail.com', '$2b$10$YGvK5Z7z3Y9xH8qVJ4Q3Ku7vK5Z7z3Y9xH8qVJ4Q3Ku7vK5Z7z3Y9x', FALSE, FALSE)
ON CONFLICT (username) DO NOTHING;

ALTER TABLE game_accounts ADD COLUMN IF NOT EXISTS image_url TEXT;

INSERT INTO game_accounts (seller_id, game_title, account_level, price, description, is_featured, image_url)
SELECT u.id, 'Valorant', 'Diamond III', 450.00, 'High rank account with premium skins and full agent roster', TRUE, 'https://cdn.poehali.dev/projects/6eff0498-56be-4162-a179-5e3f87acde2a/files/89cbaf60-7031-40e3-9f22-29f514579dce.jpg'
FROM users u WHERE u.username = 'GamerPro';

INSERT INTO game_accounts (seller_id, game_title, account_level, price, description, is_featured, image_url)
SELECT u.id, 'League of Legends', 'Platinum I', 320.00, 'Great account with many champions and skins', FALSE, 'https://cdn.poehali.dev/projects/6eff0498-56be-4162-a179-5e3f87acde2a/files/89cbaf60-7031-40e3-9f22-29f514579dce.jpg'
FROM users u WHERE u.username = 'TopSeller';

INSERT INTO game_accounts (seller_id, game_title, account_level, price, description, is_featured, image_url)
SELECT u.id, 'Dota 2', 'Ancient V', 280.00, 'Well-maintained account with high behavior score', FALSE, 'https://cdn.poehali.dev/projects/6eff0498-56be-4162-a179-5e3f87acde2a/files/89cbaf60-7031-40e3-9f22-29f514579dce.jpg'
FROM users u WHERE u.username = 'EliteTrader';

INSERT INTO game_accounts (seller_id, game_title, account_level, price, description, is_featured, image_url)
SELECT u.id, 'Apex Legends', 'Master', 550.00, 'Top tier account with heirloom and battle pass skins', TRUE, 'https://cdn.poehali.dev/projects/6eff0498-56be-4162-a179-5e3f87acde2a/files/89cbaf60-7031-40e3-9f22-29f514579dce.jpg'
FROM users u WHERE u.username = 'GamerPro';

INSERT INTO game_accounts (seller_id, game_title, account_level, price, description, is_featured, image_url)
SELECT u.id, 'Overwatch 2', 'Diamond II', 380.00, 'Competitive ready account with golden weapons', FALSE, 'https://cdn.poehali.dev/projects/6eff0498-56be-4162-a179-5e3f87acde2a/files/89cbaf60-7031-40e3-9f22-29f514579dce.jpg'
FROM users u WHERE u.username = 'TopSeller';

INSERT INTO game_accounts (seller_id, game_title, account_level, price, description, is_featured, image_url)
SELECT u.id, 'Fortnite', 'Champion League', 420.00, 'Account with rare skins and high level', TRUE, 'https://cdn.poehali.dev/projects/6eff0498-56be-4162-a179-5e3f87acde2a/files/89cbaf60-7031-40e3-9f22-29f514579dce.jpg'
FROM users u WHERE u.username = 'EliteTrader';

UPDATE game_accounts SET image_url = 'https://cdn.poehali.dev/projects/6eff0498-56be-4162-a179-5e3f87acde2a/files/89cbaf60-7031-40e3-9f22-29f514579dce.jpg' WHERE image_url IS NULL;
