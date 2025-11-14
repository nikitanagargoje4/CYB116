<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit();
}

// Include PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once dirname(__DIR__) . '/lib/PHPMailer/PHPMailer.php';
require_once dirname(__DIR__) . '/lib/PHPMailer/SMTP.php';
require_once dirname(__DIR__) . '/lib/PHPMailer/Exception.php';

// Database connection
require_once dirname(__DIR__) . '/config/database.php';

$database = new Database();
$conn = $database->getConnection();

// Validate and sanitize input
$jobId = isset($_POST['job_id']) ? intval($_POST['job_id']) : 0;
$jobTitle = isset($_POST['job_title']) ? trim($_POST['job_title']) : '';
$applicantName = isset($_POST['applicant_name']) ? trim($_POST['applicant_name']) : '';
$applicantEmail = isset($_POST['applicant_email']) ? trim($_POST['applicant_email']) : '';
$applicantPhone = isset($_POST['applicant_phone']) ? trim($_POST['applicant_phone']) : null;
$sourceUrl = isset($_POST['source_url']) ? trim($_POST['source_url']) : '';

// Additional job details for email
$jobDepartment = isset($_POST['job_department']) ? trim($_POST['job_department']) : '';
$jobLocation = isset($_POST['job_location']) ? trim($_POST['job_location']) : '';
$jobType = isset($_POST['job_type']) ? trim($_POST['job_type']) : '';
$jobExperience = isset($_POST['job_experience']) ? trim($_POST['job_experience']) : '';

// Validate required fields
if (empty($jobId) || empty($jobTitle) || empty($applicantName) || empty($applicantEmail)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing required fields: job_id, job_title, applicant_name, applicant_email"]);
    exit();
}

// Validate email format
if (!filter_var($applicantEmail, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid email format"]);
    exit();
}

// Handle file upload
if (!isset($_FILES['resume']) || $_FILES['resume']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    $errorMsg = isset($_FILES['resume']) ? "Upload error code: " . $_FILES['resume']['error'] : "No resume file uploaded";
    echo json_encode(["success" => false, "error" => $errorMsg]);
    exit();
}

$resumeFile = $_FILES['resume'];
$maxFileSize = 10 * 1024 * 1024; // 10 MB

// Validate file size
if ($resumeFile['size'] > $maxFileSize) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Resume file exceeds 10MB limit"]);
    exit();
}

// Validate file type using finfo
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$detectedMime = finfo_file($finfo, $resumeFile['tmp_name']);
finfo_close($finfo);

$allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

if (!in_array($detectedMime, $allowedMimes)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid file type. Only PDF, DOC, and DOCX files are allowed. Detected: $detectedMime"]);
    exit();
}

// Generate unique filename
$uploadDir = dirname(__DIR__) . '/uploads/resumes/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$extension = pathinfo($resumeFile['name'], PATHINFO_EXTENSION);
$uniqueFilename = uniqid('resume_', true) . '_' . time() . '.' . $extension;
$uploadPath = $uploadDir . $uniqueFilename;

// Move uploaded file
if (!move_uploaded_file($resumeFile['tmp_name'], $uploadPath)) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to save resume file"]);
    exit();
}

// Set file permissions
chmod($uploadPath, 0640);

// Insert into database
try {
    $stmt = $conn->prepare("
        INSERT INTO job_applications 
        (job_id, job_title, applicant_name, applicant_email, applicant_phone, 
         resume_path, resume_original_name, resume_mime_type, resume_size_bytes, source_url, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
    ");
    
    $stmt->execute([
        $jobId,
        $jobTitle,
        $applicantName,
        $applicantEmail,
        $applicantPhone,
        $uploadPath,
        $resumeFile['name'],
        $detectedMime,
        $resumeFile['size'],
        $sourceUrl
    ]);
    
    $applicationId = $conn->lastInsertId();
    
} catch (PDOException $e) {
    // Clean up uploaded file on database error
    if (file_exists($uploadPath)) {
        unlink($uploadPath);
    }
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
    exit();
}

// Send emails
$headers  = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: CybaemTech Careers <no-reply@cybaemtech.com>\r\n";
$headers .= "Reply-To: hr@cybaemtech.com\r\n";

// Email to HR
$hrEmail = "hr@cybaemtech.com";
$hrSubject = "🎯 New Job Application - " . htmlspecialchars($jobTitle);
$hrMessage = '
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background:#f4f6f9; margin:0; padding:20px; }
    .container { max-width:600px; margin:auto; background:#ffffff; border-radius:12px; 
                 box-shadow:0 4px 12px rgba(0,0,0,0.08); overflow:hidden; }
    .header { background:#0f172a; padding:20px; text-align:center; }
    .header img { max-width:160px; }
    .content { padding:30px; color:#333333; }
    .content h2 { margin-top:0; color:#0f172a; font-size:22px; }
    .job-title { background:#f0f9ff; padding:15px; border-left:4px solid #0f172a; margin:20px 0; }
    .job-title h3 { margin:0; color:#0f172a; }
    table { width:100%; border-collapse:collapse; margin-top:20px; }
    td { padding:12px 15px; border-bottom:1px solid #eaeaea; font-size:15px; }
    td.label { font-weight:600; color:#0f172a; background:#f9fafb; width:35%; }
    td.value { color:#333; }
    .footer { background:#f9fafb; padding:15px; text-align:center; font-size:13px; color:#666; }
    .footer a { color:#0f172a; text-decoration:none; font-weight:600; }
    .note { background:#fff3cd; border-left:4px solid #ffc107; padding:12px; margin-top:15px; font-size:14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://www.cybaemtech.com/lovable-uploads/footerlogo.png" alt="Cybaem Tech Logo" width="160" style="max-width:160px;">
    </div>
    <div class="content">
      <h2>New Job Application Received</h2>
      
      <div class="job-title">
        <h3>' . htmlspecialchars($jobTitle) . '</h3>
        <p style="margin:5px 0 0 0; color:#666; font-size:14px;">
          ' . htmlspecialchars($jobDepartment) . ' • ' . htmlspecialchars($jobLocation) . '
        </p>
      </div>
      
      <h4 style="color:#0f172a; margin-top:20px;">Applicant Information</h4>
      <table>
        <tr><td class="label">Name</td><td class="value">' . htmlspecialchars($applicantName) . '</td></tr>
        <tr><td class="label">Email</td><td class="value"><a href="mailto:' . htmlspecialchars($applicantEmail) . '">' . htmlspecialchars($applicantEmail) . '</a></td></tr>
        <tr><td class="label">Phone</td><td class="value">' . htmlspecialchars($applicantPhone ?: 'Not provided') . '</td></tr>
      </table>
      
      <h4 style="color:#0f172a; margin-top:25px;">Job Details</h4>
      <table>
        <tr><td class="label">Position</td><td class="value">' . htmlspecialchars($jobTitle) . '</td></tr>
        <tr><td class="label">Department</td><td class="value">' . htmlspecialchars($jobDepartment) . '</td></tr>
        <tr><td class="label">Location</td><td class="value">' . htmlspecialchars($jobLocation) . '</td></tr>
        <tr><td class="label">Type</td><td class="value">' . htmlspecialchars($jobType) . '</td></tr>
        <tr><td class="label">Experience Required</td><td class="value">' . htmlspecialchars($jobExperience) . '</td></tr>
      </table>
      
      <h4 style="color:#0f172a; margin-top:25px;">Resume Details</h4>
      <table>
        <tr><td class="label">Filename</td><td class="value">' . htmlspecialchars($resumeFile['name']) . '</td></tr>
        <tr><td class="label">File Type</td><td class="value">' . htmlspecialchars($detectedMime) . '</td></tr>
        <tr><td class="label">File Size</td><td class="value">' . round($resumeFile['size'] / 1024, 2) . ' KB</td></tr>
        <tr><td class="label">Application ID</td><td class="value">#' . $applicationId . '</td></tr>
      </table>
      
      <div class="note">
        <strong>📎 Note:</strong> The resume file has been securely stored on the server. 
        Please access the admin dashboard to download and review the application.
      </div>
    </div>
    <div class="footer">
      © ' . date("Y") . ' <a href="https://www.cybaemtech.com">Cybaem Tech</a> — All Rights Reserved
    </div>
  </div>
</body>
</html>';

// Email to applicant (confirmation)
$applicantSubject = "Application Received - " . htmlspecialchars($jobTitle) . " at Cybaem Tech";
$applicantMessage = '
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background:#f4f6f9; margin:0; padding:20px; }
    .container { max-width:600px; margin:auto; background:#ffffff; border-radius:12px; 
                 box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden; }
    .header { background:#0f172a; padding:20px; text-align:center; }
    .header img { max-width:160px; }
    .content { padding:30px; color:#333333; }
    .content h2 { margin-top:0; color:#0f172a; }
    .highlight { background:#f0f9ff; padding:15px; border-radius:8px; margin:20px 0; }
    .btn { display:inline-block; margin-top:20px; padding:12px 24px; background:#0f172a; 
           color:#fff; text-decoration:none; border-radius:8px; font-weight:bold; }
    .footer { background:#f1f5f9; padding:15px; text-align:center; font-size:13px; color:#666; }
    .footer a { color:#0f172a; text-decoration:none; font-weight:600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://www.cybaemtech.com/lovable-uploads/footerlogo.png" alt="Cybaem Tech Logo" width="160" style="max-width:160px;">
    </div>
    <div class="content">
      <h2>Thank You for Applying, ' . htmlspecialchars($applicantName) . '!</h2>
      <p>We have successfully received your application for the following position:</p>
      
      <div class="highlight">
        <h3 style="margin:0; color:#0f172a;">' . htmlspecialchars($jobTitle) . '</h3>
        <p style="margin:5px 0 0 0; color:#666;">
          ' . htmlspecialchars($jobDepartment) . ' • ' . htmlspecialchars($jobLocation) . ' • ' . htmlspecialchars($jobType) . '
        </p>
      </div>
      
      <p>Our HR team will carefully review your application and resume. If your qualifications match our requirements, we will contact you within 5-7 business days to discuss the next steps.</p>
      
      <p><strong>Application Reference:</strong> #' . $applicationId . '</p>
      
      <p style="margin-top:25px;">Meanwhile, feel free to explore our website and learn more about what we do at Cybaem Tech.</p>
      
      <div style="text-align:center;">
        <a href="https://www.cybaemtech.com" class="btn">Visit Our Website</a>
      </div>
    </div>
    <div class="footer">
      You are receiving this email because you applied for a position at <a href="https://www.cybaemtech.com">Cybaem Tech</a>.<br>
      © ' . date("Y") . ' Cybaem Tech. All Rights Reserved.
    </div>
  </div>
</body>
</html>';

// Send emails using PHPMailer
$mail = new PHPMailer(true);
$hrMailResult = false;
$applicantMailResult = false;
$emailErrors = [];

try {
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = getenv('SMTP_HOST') ?: 'mail.cybaemtech.com';
    $mail->SMTPAuth = true;
    $mail->Username = getenv('SMTP_USER') ?: '';
    $mail->Password = getenv('SMTP_PASSWORD') ?: '';
    $smtpPort = getenv('SMTP_PORT') ?: 465;
    // Use SSL for port 465, STARTTLS for port 587
    $mail->SMTPSecure = ($smtpPort == 465) ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $smtpPort;
    $mail->CharSet = 'UTF-8';
    
    // Sender info
    $fromEmail = getenv('SMTP_FROM_EMAIL') ?: 'no-reply@cybaemtech.com';
    $fromName = getenv('SMTP_FROM_NAME') ?: 'CybaemTech Careers';
    
    // Send email to HR
    try {
        $mail->clearAddresses();
        $mail->clearAttachments();
        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($hrEmail);
        $mail->addReplyTo('hr@cybaemtech.com', 'HR Department');
        $mail->isHTML(true);
        $mail->Subject = $hrSubject;
        $mail->Body = $hrMessage;
        
        // Attach the resume file to the HR email
        if (file_exists($uploadPath)) {
            $mail->addAttachment($uploadPath, $resumeFile['name']);
        }
        
        $hrMailResult = $mail->send();
    } catch (Exception $e) {
        $emailErrors[] = "HR email error: " . $mail->ErrorInfo;
    }
    
    // Send confirmation email to applicant
    try {
        $mail->clearAddresses();
        $mail->clearAttachments(); // Don't send resume to applicant
        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($applicantEmail);
        $mail->addReplyTo('hr@cybaemtech.com', 'HR Department');
        $mail->isHTML(true);
        $mail->Subject = $applicantSubject;
        $mail->Body = $applicantMessage;
        $applicantMailResult = $mail->send();
    } catch (Exception $e) {
        $emailErrors[] = "Applicant email error: " . $mail->ErrorInfo;
    }
    
} catch (Exception $e) {
    $emailErrors[] = "SMTP Configuration error: " . $e->getMessage();
}

// Return success response
echo json_encode([
    "success" => true,
    "message" => "Application submitted successfully",
    "application_id" => $applicationId,
    "email_sent" => [
        "hr" => $hrMailResult,
        "applicant" => $applicantMailResult
    ],
    "email_errors" => $emailErrors
]);
?>
