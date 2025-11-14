<?php
require_once __DIR__ . '/config/database.php';

echo "Testing cPanel MySQL Database Connection...\n";
echo "==========================================\n\n";

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        echo "✅ Successfully connected to the cPanel MySQL database!\n\n";
        
        // Test a simple query
        $query = "SELECT DATABASE() as current_db, VERSION() as version";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "Current Database: " . $result['current_db'] . "\n";
        echo "MySQL Version: " . $result['version'] . "\n";
        
        // List all tables
        $query = "SHOW TABLES";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        echo "\nTables in database:\n";
        if (count($tables) > 0) {
            foreach ($tables as $table) {
                echo "  - " . $table . "\n";
            }
        } else {
            echo "  No tables found (database is empty)\n";
        }
        
    } else {
        echo "❌ Failed to connect to database\n";
    }
} catch (Exception $e) {
    echo "❌ Database connection error:\n";
    echo $e->getMessage() . "\n";
}
?>
