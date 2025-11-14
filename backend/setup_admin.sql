-- Run this SQL in cPanel phpMyAdmin to create admin user
-- Database: cybaemtech_CYB_db

-- Create admin user with credentials:
-- Username: admin
-- Password: admin123

INSERT INTO admin_users (username, password, email) 
VALUES (
    'admin', 
    '$2y$12$.jKbAGdJ7xcv79xIFOE.DeDhc4ea.Tmogb6XepaJx6nhfqLoBTDfu', 
    'admin@cybaemtech.com'
)
ON DUPLICATE KEY UPDATE 
    password = '$2y$12$.jKbAGdJ7xcv79xIFOE.DeDhc4ea.Tmogb6XepaJx6nhfqLoBTDfu';

-- Verify the admin user was created
SELECT id, username, email, created_at FROM admin_users WHERE username = 'admin';
