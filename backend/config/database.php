<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;
    public $conn;

    public function __construct() {
        // Load .env file if it exists (for cPanel deployment)
        $this->loadEnvFile();
        
        $this->host = trim(getenv('DB_HOST') ?: 'localhost');
        $this->db_name = trim(getenv('DB_NAME') ?: '');
        $this->username = trim(getenv('DB_USER') ?: '');
        $this->password = trim(getenv('DB_PASSWORD') ?: '');
        $this->port = trim(getenv('DB_PORT') ?: '3306');
    }
    
    private function loadEnvFile() {
        $envFile = __DIR__ . '/../.env';
        
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                // Skip comments
                if (strpos(trim($line), '#') === 0) {
                    continue;
                }
                
                // Parse KEY=VALUE
                if (strpos($line, '=') !== false) {
                    list($key, $value) = explode('=', $line, 2);
                    $key = trim($key);
                    $value = trim($value);
                    
                    // Set environment variable if not already set
                    if (!getenv($key)) {
                        putenv("$key=$value");
                    }
                }
            }
        }
    }

    public function getConnection() {
        $this->conn = null;

        try {
            // Check if MySQL environment variables are explicitly set (cPanel/custom)
            if ($this->host && $this->db_name && $this->username) {
                // Use MySQL
                $dsn = "mysql:host=" . $this->host . 
                       ";port=" . $this->port . 
                       ";dbname=" . $this->db_name;
                
                $this->conn = new PDO($dsn, $this->username, $this->password);
                $this->conn->exec("set names utf8");
            } elseif (getenv('PGHOST')) {
                // Use PostgreSQL (Replit default)
                $dsn = "pgsql:host=" . getenv('PGHOST') . 
                       ";port=" . getenv('PGPORT') . 
                       ";dbname=" . getenv('PGDATABASE');
                
                $this->conn = new PDO($dsn, getenv('PGUSER'), getenv('PGPASSWORD'));
            } else {
                throw new PDOException("No database configuration found");
            }
            
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
            throw $exception;
        }

        return $this->conn;
    }
}
?>
