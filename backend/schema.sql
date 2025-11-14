-- Cybaem Tech Database Schema
-- MySQL Database Structure

-- Drop tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS blog_comments;
DROP TABLE IF EXISTS media_library;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS admin_users;

-- Create admin_users table
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create blog_posts table
CREATE TABLE blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    tags TEXT,
    excerpt TEXT,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    type VARCHAR(50) DEFAULT 'Blog Post',
    author VARCHAR(100),
    author_linkedin VARCHAR(500),
    author_title VARCHAR(255),
    featured_image VARCHAR(500),
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create media_library table
CREATE TABLE media_library (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create blog_comments table
CREATE TABLE blog_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    blog_post_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    comment TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user
-- Username: admin
-- Password: admin123
INSERT INTO admin_users (username, password, email) 
VALUES (
    'admin', 
    '$2y$12$.jKbAGdJ7xcv79xIFOE.DeDhc4ea.Tmogb6XepaJx6nhfqLoBTDfu', 
    'admin@cybaemtech.com'
);

-- Add indexes for better performance
CREATE INDEX idx_blog_status ON blog_posts(status);
CREATE INDEX idx_blog_created ON blog_posts(created_at);
CREATE INDEX idx_blog_slug ON blog_posts(slug);
CREATE INDEX idx_media_type ON media_library(file_type);
CREATE INDEX idx_comment_status ON blog_comments(status);
CREATE INDEX idx_comment_blog_id ON blog_comments(blog_post_id);
