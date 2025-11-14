<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$host = getenv('DB_HOST');
$dbname = getenv('DB_NAME');
$username = getenv('DB_USER');
$password = getenv('DB_PASSWORD');

echo json_encode([
    'environment' => 'Replit',
    'host' => $host,
    'database' => $dbname,
    'user' => $username,
    'password_set' => !empty($password) ? 'Yes' : 'No'
]);

try {
    $conn = new mysqli($host, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    echo "\n\n✅ Database connection successful!\n";
    echo "Connected to: $dbname on $host\n";
    
    $conn->close();
} catch (Exception $e) {
    echo "\n\n❌ Database connection failed!\n";
    echo "Error: " . $e->getMessage() . "\n";
}
?>
