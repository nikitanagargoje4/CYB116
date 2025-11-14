<?php
/**
 * Migration Script: Add LinkedIn and missing fields to blog_posts table
 * Run this file once to add the missing columns to your MySQL database
 */

require_once __DIR__ . '/config/database.php';

echo "Starting migration: Adding LinkedIn and missing fields to blog_posts table...\n\n";

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Check if we're connected
    if (!$conn) {
        throw new Exception("Failed to connect to database");
    }
    
    echo "Connected to database: " . getenv('DB_NAME') . "\n\n";
    
    // Add slug column if it doesn't exist
    try {
        $conn->exec("ALTER TABLE blog_posts ADD COLUMN slug VARCHAR(255) AFTER title");
        echo "✓ Added 'slug' column\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            echo "- Column 'slug' already exists\n";
        } else {
            throw $e;
        }
    }
    
    // Add tags column if it doesn't exist
    try {
        $conn->exec("ALTER TABLE blog_posts ADD COLUMN tags TEXT AFTER slug");
        echo "✓ Added 'tags' column\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            echo "- Column 'tags' already exists\n";
        } else {
            throw $e;
        }
    }
    
    // Add author_linkedin column if it doesn't exist
    try {
        $conn->exec("ALTER TABLE blog_posts ADD COLUMN author_linkedin VARCHAR(500) AFTER author");
        echo "✓ Added 'author_linkedin' column\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            echo "- Column 'author_linkedin' already exists\n";
        } else {
            throw $e;
        }
    }
    
    // Add index for slug
    try {
        $conn->exec("CREATE INDEX idx_blog_slug ON blog_posts(slug)");
        echo "✓ Added index for 'slug' column\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate key name') !== false) {
            echo "- Index 'idx_blog_slug' already exists\n";
        } else {
            throw $e;
        }
    }
    
    echo "\n✅ Migration completed successfully!\n";
    echo "The blog_posts table now has slug, tags, and author_linkedin columns.\n";
    
} catch (Exception $e) {
    echo "\n❌ Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
