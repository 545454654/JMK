<?php
/**
 * 🍏 Apple of Fortune (تفاحة الحظ) - Firebase RTDB Engine in PHP
 * 
 * Language: PHP 8.2+
 * Target Endpoint: https://mrwan-dd795-default-rtdb.firebaseio.com/m11.json
 * Promocode / Password: JMK2
 * Deposit Requirement: 150 EGP (جنيه مصري) / 3 USD ($3)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

// Configuration & Authentication Settings
$requiredPromocode = "JMK2"; // Password is set to the Promocode (JMK2)
$firebaseUrl       = "https://mrwan-dd795-default-rtdb.firebaseio.com/m11.json";

// Read Request Input
$accountId = isset($_REQUEST['account_id']) ? trim($_REQUEST['account_id']) : '5666009187';
$password  = isset($_REQUEST['password'])   ? trim($_REQUEST['password'])   : 'JMK2'; // Password = Promocode

// 1. Validate Password (Promocode)
if ($password !== $requiredPromocode) {
    http_response_code(401);
    echo json_encode(array(
        "status"   => "error",
        "message"  => "كلمة المرور / البروموكود غير صحيحة! يرجى استخدام البروموكود JMK2",
        "required" => "JMK2"
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. Generate 10 Rows x 5 Columns Predictions Matrix (m1 to m50)
$finalObject = array();

for ($r = 0; $r < 10; $r++) {
    // Determine safe apple count based on row difficulty
    $safeCount = 4;
    if ($r >= 4 && $r < 7) {
        $safeCount = 3; // Rows 4, 5, 6
    } elseif ($r >= 7 && $r < 9) {
        $safeCount = 2; // Rows 7, 8
    } elseif ($r >= 9) {
        $safeCount = 1; // Row 9 (Top row)
    }

    // Pick random safe column positions
    $safeCols = array();
    while (count($safeCols) < $safeCount) {
        $randomCol = rand(0, 4);
        if (!in_array($randomCol, $safeCols)) {
            $safeCols[] = $randomCol;
        }
    }

    // Map to Firebase RTDB nested object structure (m1 to m50)
    for ($c = 0; $c < 5; $c++) {
        $mIndex = ($r * 5) + $c + 1;
        $mKey   = "m" . $mIndex;
        $value  = in_array($c, $safeCols) ? "1" : "0";
        $finalObject[$mKey] = array($mKey => $value);
    }
}

// 3. Upload Predictions to Firebase Realtime Database via cURL
$jsonData = json_encode($finalObject);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $firebaseUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 4. Return Output Status
if ($httpCode === 200) {
    echo json_encode(array(
        "status"     => "success",
        "engine"     => "PHP 8.2 Engine",
        "account_id" => $accountId,
        "promocode"  => $password,
        "path"       => "/m11",
        "message"    => "PHP Engine generated & uploaded 50 cells to Firebase RTDB successfully!",
        "timestamp"  => date("Y-m-d H:i:s")
    ), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(array(
        "status"  => "error",
        "code"    => $httpCode,
        "message" => "Firebase RTDB HTTP Error"
    ), JSON_UNESCAPED_UNICODE);
}
?>
