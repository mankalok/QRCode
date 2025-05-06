"use strict";

// --- DOM Elements ---
const textInput = document.getElementById('textInput');
const generateBtn = document.getElementById('generateBtn');
const qrcodeContainer = document.getElementById('qrcodeContainer');

let qrcode = null; // 用來儲存 QRCode 物件實例

// --- Function to Generate QR Code ---
function generateQRCode() {
    const textToEncode = textInput.value.trim(); // 獲取輸入內容並去除前後空格

    // 檢查是否有輸入
    if (!textToEncode) {
        alert("請輸入文字或網址！");
        textInput.focus(); // 將焦點移回輸入框
        return;
    }

    console.log(`Generating QR Code for: "${textToEncode}"`);

    // 清除之前產生的 QR Code
    qrcodeContainer.innerHTML = ""; // 清空容器內容

    // 創建新的 QRCode 實例
    try {
        qrcode = new QRCode(qrcodeContainer, {
            text: textToEncode,
            width: 256, // QR Code 寬度 (像素)
            height: 256, // QR Code 高度 (像素)
            colorDark: "#000000", // 深色 (通常是黑色)
            colorLight: "#ffffff", // 淺色 (通常是白色)
            // 錯誤修正等級：L (Low, 7%), M (Medium, 15%), Q (Quartile, 25%), H (High, 30%)
            // 等級越高，QR Code 越複雜，但能容忍更多損壞
            correctLevel: QRCode.CorrectLevel.H
        });
        console.log("QR Code generated successfully.");

         // 可選：添加下載連結 (需要更複雜的處理)
         // addDownloadLink();

    } catch (error) {
        console.error("Error generating QR Code:", error);
        qrcodeContainer.innerHTML = `<p style="color:red;">產生 QR Code 時發生錯誤。</p>`;
    }
}

/*
// 可選：添加下載連結的函數範例
function addDownloadLink() {
    // qrcode.js 產生的可能是 canvas 或 img，需要檢查
    const qrElement = qrcodeContainer.querySelector('canvas') || qrcodeContainer.querySelector('img');
    if (qrElement) {
        const link = document.createElement('a');
        link.download = 'qrcode.png'; // 下載的文件名
        link.style.marginTop = '15px';
        link.style.display = 'inline-block';
        link.textContent = '下載 QR Code';

        if (qrElement.tagName === 'CANVAS') {
            link.href = qrElement.toDataURL('image/png'); // 將 Canvas 轉為圖片數據
        } else if (qrElement.tagName === 'IMG') {
            link.href = qrElement.src; // 直接使用圖片來源 (如果 qrcode.js 產生 img)
        }
        qrcodeContainer.appendChild(link);
    }
}
*/


// --- Event Listeners ---
if (generateBtn) {
    generateBtn.addEventListener('click', generateQRCode);
} else {
    console.error("Generate button not found!");
}

// 可選：在輸入框按 Enter 鍵也觸發產生
if (textInput) {
    textInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            generateQRCode();
        }
    });
}

// --- Initial state ---
// 清除可能存在的舊 QR Code (如果頁面重載)
if (qrcodeContainer) {
    qrcodeContainer.innerHTML = '<p style="color:#888; font-size: 0.9em;">請輸入內容並點擊產生</p>';
}
console.log("QR Code Generator Initialized.");