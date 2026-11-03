<?php
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

if (!file_exists(__DIR__ . '/config.php')) {
    http_response_code(500);
    echo json_encode(['error' => 'File config.php belum dibuat.']);
    exit;
}

$config = require __DIR__ . '/config.php';

// Ambil input JSON dari client
$inputRaw = file_get_contents('php://input');
$body = json_decode($inputRaw, true);
$userInput = trim($body['input'] ?? '');
$instructions = trim($body['instructions'] ?? '');

if (empty($userInput)) {
    http_response_code(400);
    echo json_encode(['error' => 'Input pesan kosong']);
    exit;
}

// Payload ke AI Endpoint
$payload = [
    'model' => $config['model'],
    'input' => $userInput
];

if (!empty($instructions)) {
    $payload['instructions'] = $instructions;
}

// cURL request ke AI Provider
$ch = curl_init($config['ai_endpoint']);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $config['ai_api_key']
    ],
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_TIMEOUT        => 30
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($curlErr) {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal koneksi ke AI: ' . $curlErr]);
    exit;
}

http_response_code($httpCode);
echo $response;
