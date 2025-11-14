<?php
// Load environment and database connection
require_once __DIR__ . '/config/database.php';

$database = new Database();
$db = $database->getConnection();

// Read and execute migration
$sql = file_get_contents(__DIR__ . '/migrations/create_job_applications_table.sql');

try {
    $db->exec($sql);
    echo "✅ Migration successful: job_applications table created\n";
} catch (PDOException $e) {
    echo "❌ Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
