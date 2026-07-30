<?php
/**
 * 🍏 Apple of Fortune (تفاحة الحظ) - Complete PHP Application (الإصدار الكامل بلغة PHP)
 * 
 * Standalone Single-File PHP Application for Web Hosting (cPanel / Hostinger / Apache)
 * Target Firebase RTDB: https://mrwan-dd795-default-rtdb.firebaseio.com/m11.json
 * Promocode / Password: JMK2
 * Default Trial ID: 5666009187
 * Deposit Requirement: 150 EGP / $3
 */

$firebaseUrl = "https://mrwan-dd795-default-rtdb.firebaseio.com/m11.json";
$trialAccountId = "5666009187";
$promocodePassword = "JMK2";

// Handle PHP API endpoint requests directly
if (isset($_GET['api']) && $_GET['api'] === 'generate') {
    header('Content-Type: application/json; charset=utf-8');
    
    // 1. Generate 10 Rows x 5 Columns Predictions Matrix (m1 to m50)
    $finalObject = array();
    for ($r = 0; $r < 10; $r++) {
        $safeCount = 4;
        if ($r >= 4 && $r < 7) {
            $safeCount = 3;
        } elseif ($r >= 7 && $r < 9) {
            $safeCount = 2;
        } elseif ($r >= 9) {
            $safeCount = 1;
        }
        
        $safeCols = array();
        while (count($safeCols) < $safeCount) {
            $randomCol = rand(0, 4);
            if (!in_array($randomCol, $safeCols)) {
                $safeCols[] = $randomCol;
            }
        }
        
        for ($c = 0; $c < 5; $c++) {
            $mIndex = ($r * 5) + $c + 1;
            $mKey   = "m" . $mIndex;
            $value  = in_array($c, $safeCols) ? "1" : "0";
            $finalObject[$mKey] = array($mKey => $value);
        }
    }

    // 2. Upload to Firebase RTDB via cURL
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
    
    if ($httpCode === 200) {
        echo json_encode(array(
            "status"     => "success",
            "engine"     => "PHP 8.2 Engine",
            "account_id" => $trialAccountId,
            "promocode"  => $promocodePassword,
            "predictions"=> $finalObject,
            "message"    => "تم إنشاء ورفع 50 خلية إلى الفايربيز بنجاح عبر محرك PHP!"
        ), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(array(
            "status"  => "error",
            "message" => "فشل الاتصال بالفايربيز HTTP Code: " . $httpCode
        ), JSON_UNESCAPED_UNICODE);
    }
    exit;
}

// Fetch initial data from Firebase
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $firebaseUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$remoteJson = curl_exec($ch);
curl_close($ch);
$remoteData = json_decode($remoteJson, true);
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تفاحة الحظ Apple of Fortune - PHP Engine</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Cairo', sans-serif;
            background: radial-gradient(at center top, rgba(138, 43, 226, 0.35) 0%, rgba(3, 8, 12, 0) 55%), rgb(10, 3, 24);
            color: #ffffff;
            min-height: 100vh;
        }
        .apple-glow {
            box-shadow: 0 0 15px rgba(34, 255, 102, 0.4), inset 0 0 10px rgba(34, 255, 102, 0.3);
        }
    </style>
</head>
<body class="p-4 flex flex-col items-center justify-center min-h-screen">
    
    <div class="w-full max-w-md bg-black/70 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(138,43,226,0.3)]">
        
        <!-- Header -->
        <div class="text-center space-y-2 mb-6">
            <div class="inline-block p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 mb-1">
                <span class="text-4xl">🍏</span>
            </div>
            <h1 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-indigo-200">
                محرك تفاحة الحظ (PHP Edition)
            </h1>
            <p class="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 py-1.5 px-3 rounded-full inline-block">
                ✓ دخول مجاني تلقائي بدون إدخال يدوي (معرف: <?php echo $trialAccountId; ?>)
            </p>
        </div>

        <!-- System Credentials Badge -->
        <div class="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-4 mb-6 space-y-2 text-xs text-purple-200">
            <div class="flex justify-between items-center">
                <span>رقم الحساب التجريبي:</span>
                <span class="font-mono font-bold text-white bg-purple-900/60 px-2 py-0.5 rounded border border-purple-400/30"><?php echo $trialAccountId; ?></span>
            </div>
            <div class="flex justify-between items-center">
                <span>البروموكود (كلمة السر):</span>
                <span class="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40"><?php echo $promocodePassword; ?></span>
            </div>
            <div class="flex justify-between items-center">
                <span>الحد الأدنى للإيداع:</span>
                <span class="font-bold text-yellow-300">150 ج.م أو $3</span>
            </div>
            <div class="flex justify-between items-center pt-1 border-t border-purple-500/20">
                <span>لغة السكربت:</span>
                <span class="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded font-mono font-bold">PHP 8.2 Engine</span>
            </div>
        </div>

        <!-- Action Button -->
        <button id="runPhpBtn" onclick="executePhpScript()" class="w-full py-4 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 border border-purple-400/50 shadow-[0_0_25px_rgba(199,125,255,0.4)] active:scale-95 transition-all mb-6 flex items-center justify-center gap-2">
            <span>⚡ تشغيل سكربت PHP وتوليد توقعات جديدة</span>
        </button>

        <!-- Dynamic Predictions Grid (Rows 10 down to 1) -->
        <div class="space-y-2 bg-black/40 p-4 rounded-2xl border border-purple-500/20">
            <div class="flex justify-between items-center text-xs text-purple-300 font-bold px-1 mb-2">
                <span>شبكة توقعات المسار (m1 إلى m50)</span>
                <span id="statusBadge" class="text-emerald-400">متصل بالفايربيز</span>
            </div>
            
            <div id="gridContainer" class="space-y-1.5">
                <!-- Rendered dynamically via JavaScript from PHP backend -->
                <p class="text-center text-xs text-purple-300/60 py-4">جاري تحميل الشبكة...</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="mt-6 text-center text-[11px] text-purple-300/50 space-y-1">
            <p>سكربت PHP جاهز للرفع على أي استضافة (cPanel / Hostinger)</p>
            <p class="font-mono text-[10px]">https://mrwan-dd795-default-rtdb.firebaseio.com/m11.json</p>
        </div>

    </div>

    <script>
        let currentPreds = <?php echo json_encode($remoteData ?: []); ?>;

        function renderGrid(preds) {
            const container = document.getElementById('gridContainer');
            if (!preds || Object.keys(preds).length === 0) {
                container.innerHTML = '<p class="text-center text-xs text-red-400 py-4">لا توجد توقعات حالية. اضغط على زر تشغيل PHP السكربت.</p>';
                return;
            }
            
            let html = '';
            // Render 10 rows from top (row 10 = indices 46..50) down to row 1 (indices 1..5)
            for (let r = 9; r >= 0; r--) {
                html += `<div class="flex gap-1.5 justify-between items-center bg-purple-950/30 p-1.5 rounded-xl border border-purple-500/10">`;
                html += `<span class="text-[10px] font-bold text-purple-400 w-6 text-center">R${r+1}</span>`;
                html += `<div class="flex-1 flex gap-1 justify-between">`;
                
                for (let c = 0; c < 5; c++) {
                    const mIndex = (r * 5) + c + 1;
                    const mKey = 'm' + mIndex;
                    const cellObj = preds[mKey];
                    const val = cellObj ? cellObj[mKey] : '0';
                    const isSafe = (val === '1');
                    
                    if (isSafe) {
                        html += `<div class="flex-1 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center apple-glow text-base transition-all scale-105">🍏</div>`;
                    } else {
                        html += `<div class="flex-1 h-8 rounded-lg bg-purple-900/10 border border-purple-500/10 flex items-center justify-center text-xs text-purple-500/40">🔒</div>`;
                    }
                }
                
                html += `</div></div>`;
            }
            container.innerHTML = html;
        }

        async function executePhpScript() {
            const btn = document.getElementById('runPhpBtn');
            const badge = document.getElementById('statusBadge');
            btn.disabled = true;
            btn.innerText = '⏳ جاري التنفيذ والرفع إلى الفايربيز...';
            badge.innerText = 'جاري التحديث...';
            badge.className = 'text-yellow-400';

            try {
                const res = await fetch('index.php?api=generate');
                const data = await res.json();
                
                if (data.status === 'success') {
                    currentPreds = data.predictions;
                    renderGrid(currentPreds);
                    badge.innerText = 'تم التحديث بنجاح ✓';
                    badge.className = 'text-emerald-400 font-bold';
                } else {
                    alert('خطأ: ' + data.message);
                    badge.innerText = 'خطأ بالفايربيز';
                    badge.className = 'text-red-400';
                }
            } catch (err) {
                alert('فشل الاتصال بسكربت PHP');
            } finally {
                btn.disabled = false;
                btn.innerText = '⚡ تشغيل سكربت PHP وتوليد توقعات جديدة';
            }
        }

        // Render initial state on load
        renderGrid(currentPreds);
    </script>
</body>
</html>
