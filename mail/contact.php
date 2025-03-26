<?php
if(empty($_POST['name']) || empty($_POST['subject']) || empty($_POST['message']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) || empty($_POST['g-recaptcha-response'])) {
  http_response_code(500);
  exit();
}

$name = strip_tags(htmlspecialchars($_POST['name']));
$email = strip_tags(htmlspecialchars($_POST['email']));
$m_subject = strip_tags(htmlspecialchars($_POST['subject']));
$message = strip_tags(htmlspecialchars($_POST['message']));

$recaptchaToken = $_POST['g-recaptcha-response'];
$secretKey = 'YOUR_SECRET_KEY'; // Replace with your actual secret key

// Verify reCAPTCHA
$recaptchaResponse = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$recaptchaToken}");
$responseKeys = json_decode($recaptchaResponse, true);

if(!$responseKeys["success"]) {
    http_response_code(400);
    exit('reCAPTCHA verification failed.');
}
$to = "info@example.com"; // Change this email to your actual email address
error_log("Email sent to: " . $to); // Log the email address for debugging
$subject = "$m_subject:  $name";
$body = "You have received a new message from your website contact form.\n\n"."Here are the details:\n\nName: $name\n\n\nEmail: $email\n\nSubject: $m_subject\n\nMessage: $message";
$header = "From: $email";
$header .= "Reply-To: $email";	

if(!mail($to, $subject, $body, $header)) {
  error_log("Mail failed to send."); // Log the failure for debugging
  http_response_code(500);
}
?>
