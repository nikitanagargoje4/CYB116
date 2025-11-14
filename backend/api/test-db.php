<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        // Test the connection by running a simple query
        $query = "SELECT VERSION() as version, DATABASE() as current_db";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Database connection successful!',
            'database' => $result['current_db'],
            'mysql_version' => $result['version'],
            'connection_info' => [
                'host' => getenv('DB_HOST'),
                'database' => getenv('DB_NAME'),
                'username' => getenv('DB_USER')
            ]
        ]);
    } else {
        throw new Exception('Failed to establish database connection');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
