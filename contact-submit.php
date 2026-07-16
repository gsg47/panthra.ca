<?php
/**
 * PANTHRA contact form handler
 * Sends form submissions to contact@panthra.ca
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$to = 'contact@panthra.ca';

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$company = trim((string) ($_POST['company'] ?? ''));
$services = $_POST['services'] ?? [];
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $email === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name and email are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

if (!is_array($services)) {
    $services = [$services];
}

$services = array_values(array_filter(array_map(static function ($item) {
    return trim(str_replace(["\r", "\n"], '', (string) $item));
}, $services), static function ($item) {
    return $item !== '';
}));

$serviceLabel = count($services) > 0 ? implode(', ', $services) : 'Not specified';

$safeName = str_replace(["\r", "\n"], '', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);
$safeCompany = $company !== '' ? $company : 'Not provided';
$safeMessage = $message !== '' ? $message : 'No message provided.';

$subject = 'New inquiry from ' . $safeName . ' — PANTHRA website';

$body = "New contact form submission from panthra.ca\n\n";
$body .= "Name: {$safeName}\n";
$body .= "Email: {$safeEmail}\n";
$body .= "Company: {$safeCompany}\n";
$body .= "Service Interest: {$serviceLabel}\n\n";
$body .= "Message:\n{$safeMessage}\n\n";
$body .= "---\n";
$body .= 'Submitted: ' . date('Y-m-d H:i:s T') . "\n";
$body .= 'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

$headers = [
    'From: PANTHRA Website <noreply@panthra.ca>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Thank you — your message has been sent.']);
    exit;
}

http_response_code(500);
echo json_encode([
    'success' => false,
    'message' => 'Unable to send your message right now. Please email contact@panthra.ca directly.',
]);
