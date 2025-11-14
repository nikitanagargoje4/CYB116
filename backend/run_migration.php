<?php
// Run database migration to add slug column
require_once __DIR__ . '/config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Add slug column if it doesn't exist
    $db->exec("ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS slug VARCHAR(255) NULL UNIQUE AFTER title");
    echo "✓ Added slug column to blog_posts table\n";
    
    // Create index on slug for faster lookups
    $db->exec("CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug)");
    echo "✓ Created index on slug column\n";
    
    echo "\nMigration completed successfully!\n";
} catch (PDOException $e) {
    echo "Error running migration: " . $e->getMessage() . "\n";
}
?>
