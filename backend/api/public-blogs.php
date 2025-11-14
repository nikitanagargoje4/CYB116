<?php
// Prevent any HTML errors from showing - always return JSON
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');

try {
    require_once __DIR__ . '/cors.php';
    require_once __DIR__ . '/../config/database.php';

    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        throw new Exception('Database connection failed');
    }

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        // Determine if we're fetching by slug or id
        if (isset($_GET['slug'])) {
            // Get single published blog post by slug
            $query = "SELECT id, title, slug, tags, excerpt, content, type, author, author_linkedin, author_title, author_photo, featured_image, views, created_at, updated_at 
                      FROM blog_posts 
                      WHERE slug = :slug AND status = 'published'";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':slug', $_GET['slug']);
            $stmt->execute();
            
            $post = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($post) {
                // Increment view count
                try {
                    $updateQuery = "UPDATE blog_posts SET views = views + 1 WHERE id = :id";
                    $updateStmt = $db->prepare($updateQuery);
                    $updateStmt->bindParam(':id', $post['id']);
                    $updateStmt->execute();
                } catch (Exception $e) {
                    // Log but don't fail if view count update fails
                    error_log("Failed to update view count: " . $e->getMessage());
                }
                
                echo json_encode(['success' => true, 'data' => $post]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Post not found', 'message' => 'Post not found']);
            }
        } elseif (isset($_GET['id'])) {
            // Get single published blog post by ID (kept for backward compatibility)
            $query = "SELECT id, title, slug, tags, excerpt, content, type, author, author_linkedin, author_title, author_photo, featured_image, views, created_at, updated_at 
                      FROM blog_posts 
                      WHERE id = :id AND status = 'published'";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $_GET['id']);
            $stmt->execute();
            
            $post = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($post) {
                // Increment view count
                try {
                    $updateQuery = "UPDATE blog_posts SET views = views + 1 WHERE id = :id";
                    $updateStmt = $db->prepare($updateQuery);
                    $updateStmt->bindParam(':id', $_GET['id']);
                    $updateStmt->execute();
                } catch (Exception $e) {
                    // Log but don't fail if view count update fails
                    error_log("Failed to update view count: " . $e->getMessage());
                }
                
                echo json_encode(['success' => true, 'data' => $post]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Post not found', 'message' => 'Post not found']);
            }
        } else {
            // Get all published blog posts
            $query = "SELECT id, title, slug, tags, excerpt, content, type, author, author_linkedin, author_title, author_photo, featured_image, views, created_at, updated_at 
                      FROM blog_posts 
                      WHERE status = 'published' 
                      ORDER BY created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'data' => $posts]);
        }
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed', 'message' => 'Method not allowed']);
    }
} catch (PDOException $e) {
    // Database error
    error_log("Database error in public-blogs.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Database error', 
        'message' => 'Unable to connect to database. Please check your database configuration.'
    ]);
} catch (Exception $e) {
    // General error
    error_log("Error in public-blogs.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Server error', 
        'message' => $e->getMessage()
    ]);
}
?>
