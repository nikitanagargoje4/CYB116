<?php
// Migration script to update all existing blog post slugs to use dashes
require_once __DIR__ . '/config/database.php';

// Helper function to generate URL-friendly slugs
function generateSlug($input) {
    // Step 1: Convert camelCase to spaced words (insert space before uppercase letters)
    $slug = preg_replace('/([a-z])([A-Z])/', '$1 $2', $input);
    
    // Step 2: Convert to lowercase
    $slug = strtolower($slug);
    
    // Step 3: Replace spaces, underscores, and multiple whitespace with single hyphen
    $slug = preg_replace('/[\s_]+/', '-', $slug);
    
    // Step 4: Remove special characters (keep only alphanumeric and hyphens)
    $slug = preg_replace('/[^a-z0-9-]/', '', $slug);
    
    // Step 5: Collapse multiple hyphens into single hyphen
    $slug = preg_replace('/-+/', '-', $slug);
    
    // Step 6: Trim leading and trailing hyphens
    $slug = trim($slug, '-');
    
    // Step 7: If slug is empty, return a default value
    if (empty($slug)) {
        $slug = 'post-' . uniqid();
    }
    
    return $slug;
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get all blog posts
    $query = "SELECT id, title, slug FROM blog_posts";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Found " . count($posts) . " blog posts to migrate\n";
    echo str_repeat('=', 80) . "\n";
    
    $updated = 0;
    foreach ($posts as $post) {
        $oldSlug = $post['slug'];
        $newSlug = generateSlug($post['title']);
        
        if ($oldSlug !== $newSlug) {
            // Update the slug
            $updateQuery = "UPDATE blog_posts SET slug = :slug WHERE id = :id";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':slug', $newSlug);
            $updateStmt->bindParam(':id', $post['id']);
            
            if ($updateStmt->execute()) {
                echo "Updated Post ID {$post['id']}: {$post['title']}\n";
                echo "  Old slug: {$oldSlug}\n";
                echo "  New slug: {$newSlug}\n";
                echo str_repeat('-', 80) . "\n";
                $updated++;
            } else {
                echo "Failed to update post ID {$post['id']}\n";
            }
        } else {
            echo "Skipped Post ID {$post['id']}: Already using correct format\n";
            echo "  Slug: {$oldSlug}\n";
            echo str_repeat('-', 80) . "\n";
        }
    }
    
    echo "\n";
    echo "Migration complete!\n";
    echo "Updated: {$updated} posts\n";
    echo "Skipped: " . (count($posts) - $updated) . " posts\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
