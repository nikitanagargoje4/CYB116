<?php
// Test SMTP Email Configuration
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/lib/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/lib/PHPMailer/SMTP.php';
require_once __DIR__ . '/lib/PHPMailer/Exception.php';
require_once __DIR__ . '/config/database.php';

echo "Testing SMTP Email Configuration...\n";
echo "==================================\n\n";

$database = new Database();
$database->getConnection(); // This loads .env file

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->SMTPDebug = 2; // Enable verbose debug output
    $mail->isSMTP();
    $mail->Host = getenv('SMTP_HOST') ?: 'mail.cybaemtech.com';
    $mail->SMTPAuth = true;
    $mail->Username = getenv('SMTP_USER') ?: '';
    $mail->Password = getenv('SMTP_PASSWORD') ?: '';
    $smtpPort = getenv('SMTP_PORT') ?: 465;
    $mail->SMTPSecure = ($smtpPort == 465) ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $smtpPort;

    echo "SMTP Settings:\n";
    echo "  Host: " . $mail->Host . "\n";
    echo "  Port: " . $mail->Port . "\n";
    echo "  User: " . $mail->Username . "\n";
    echo "  Password: " . (empty(getenv('SMTP_PASSWORD')) ? 'NOT SET' : '***SET***') . "\n\n";

    // Recipients
    $mail->setFrom(getenv('SMTP_FROM_EMAIL') ?: 'hr@cybaemtech.com', 'CybaemTech Test');
    $mail->addAddress('Nikita.Nagargoje@cybaemtech.com', 'Nikita Nagargoje');

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Test Email - SMTP Configuration';
    $mail->Body = '<h1>Test Email</h1><p>If you receive this email, your SMTP configuration is working correctly!</p>';
    $mail->AltBody = 'If you receive this email, your SMTP configuration is working correctly!';

    $mail->send();
    echo "\n✅ Test email sent successfully!\n";
    echo "Check Nikita.Nagargoje@cybaemtech.com inbox.\n";
    
} catch (Exception $e) {
    echo "\n❌ Email could not be sent.\n";
    echo "Error: {$mail->ErrorInfo}\n";
}
?>
