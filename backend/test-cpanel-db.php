<?php
header('Content-Type: application/json');

echo "Testing cPanel Database Connection...\n\n";

echo "Environment Variables:\n";
echo "DB_HOST: " . (getenv('DB_HOST') ? 'Set' : 'Not Set') . "\n";
echo "DB_NAME: " . (getenv('DB_NAME') ? 'Set' : 'Not Set') . "\n";
echo "DB_USER: " . (getenv('DB_USER') ? 'Set' : 'Not Set') . "\n";
echo "DB_PASSWORD: " . (getenv('DB_PASSWORD') ? 'Set' : 'Not Set') . "\n";
echo "DB_PORT: " . (getenv('DB_PORT') ? 'Set' : 'Not Set') . "\n\n";

require_once __DIR__ . '/config/database.php';

try {
    echo "Attempting to connect to database...\n";
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        echo "✅ SUCCESS! Connected to cPanel MySQL database!\n\n";
        
        // Get database version
        $stmt = $conn->query("SELECT VERSION() as version");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "MySQL Version: " . $result['version'] . "\n\n";
        
        // List tables
        echo "Tables in database:\n";
        $stmt = $conn->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        if (count($tables) > 0) {
            foreach ($tables as $table) {
                echo "  - " . $table . "\n";
            }
        } else {
            echo "  (No tables found)\n";
        }
        
    } else {
        echo "❌ FAILED: Connection object is null\n";
    }
} catch (PDOException $e) {
    echo "❌ FAILED: Database connection error\n";
    echo "Error Message: " . $e->getMessage() . "\n";
    echo "\nPlease check:\n";
    echo "1. Database credentials are correct\n";
    echo "2. Database server IP (82.25.105.94) is accessible from Replit\n";
    echo "3. cPanel Remote MySQL is configured to allow connections from Replit's IP\n";
}
?>
