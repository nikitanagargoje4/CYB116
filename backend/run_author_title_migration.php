<?php
/**
 * Migration Script: Add author_title field to blog_posts table
 * Run this file once to add the author title/position column
 */

require_once __DIR__ . '/config/database.php';

echo "Starting migration: Adding author_title field to blog_posts table...\n\n";

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        throw new Exception("Failed to connect to database");
    }
    
    echo "Connected to database: " . getenv('DB_NAME') . "\n\n";
    
    // Add author_title column if it doesn't exist
    try {
        $conn->exec("ALTER TABLE blog_posts ADD COLUMN author_title VARCHAR(255) AFTER author_linkedin");
        echo "✓ Added 'author_title' column\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
            echo "- Column 'author_title' already exists\n";
        } else {
            throw $e;
        }
    }
    
    echo "\n✅ Migration completed successfully!\n";
    echo "The blog_posts table now has the author_title column.\n";
    
} catch (Exception $e) {
    echo "\n❌ Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
