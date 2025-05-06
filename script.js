"use strict";

// --- DOM Elements ---
const textInput = document.getElementById('textInput');
const generateBtn = document.getElementById('generateBtn');
const qrcodeContainer = document.getElementById('qrcodeContainer');
// New Controls
const sizeInput = document.getElementById('sizeInput');
const colorDarkInput = document.getElementById('colorDarkInput');
const colorLightInput = document.getElementById('colorLightInput');
const downloadLink = document.getElementById('downloadLink');

let qrcode = null; // QRCode instance

// --- Function to Generate QR Code ---
function generateQRCode() {
    const textToEncode = textInput.value.trim();
    const size = parseInt(sizeInput.value);
    const colorDark = colorDarkInput.value;
    const colorLight = colorLightInput.value;

    // --- Validation ---
    if (!textToEncode) {
        alert("請輸入文字或網址！");
        textInput.focus();
        return;
    }
    if (isNaN(size) || size < 50 || size > 1000) {
        alert("請輸入有效的大小 (50 - 1000 像素)！");
        sizeInput.focus();
        return;
    }

    console.log(`Generating QR Code: Size=${size}, Dark=${colorDark}, Light=${colorLight}, Text="${textToEncode}"`);

    // --- Clear previous QR Code & Download Link ---
    qrcodeContainer.innerHTML = ""; // Clear display area
    downloadLink.style.display = 'none'; // Hide download link

    // --- Create New QR Code ---
    try {
        qrcode = new QRCode(qrcodeContainer, {
            text: textToEncode,
            width: size, // Use selected size
            height: size, // Use selected size
            colorDark: colorDark, // Use selected dark color
            colorLight: colorLight, // Use selected light color
            correctLevel: QRCode.CorrectLevel.H // High error correction
        });
        console.log("QR Code generated successfully.");

        // --- Update Download Link (Delay slightly to ensure rendering) ---
        // qrcode.js might take a moment to render the canvas/img
        setTimeout(updateDownloadLink, 100); // Wait 100ms

    } catch (error) {
        console.error("Error generating QR Code:", error);
        qrcodeContainer.innerHTML = `<p style="color:red;">產生 QR Code 時發生錯誤。</p>`;
    }
}

// --- Function to Update Download Link ---
function updateDownloadLink() {
    if (!qrcodeContainer || !downloadLink) return; // Ensure elements exist

    // qrcode.js usually generates a canvas, but might fallback to img
    const qrCanvas = qrcodeContainer.querySelector('canvas');
    const qrImage = qrcodeContainer.querySelector('img');
    let dataUrl = null;

    if (qrCanvas) {
        console.log("Found canvas, generating data URL...");
        try {
            dataUrl = qrCanvas.toDataURL('image/png');
        } catch (e) {
            console.error("Error getting data URL from canvas:", e);
            // Handle potential security errors (tainted canvas), though unlikely here
        }
    } else if (qrImage) {
        console.log("Found img, using src as data URL...");
        // If it's an img, its src is likely already a data URL or needs conversion
        // For simplicity, assume src is usable directly if it's data URL
        if (qrImage.src.startsWith('data:')) {
             dataUrl = qrImage.src;
        } else {
             // Need more complex logic to convert external img src to data URL (via canvas)
             console.warn("Image src is not a data URL, download might not work directly.");
             // We can try drawing the image to a temporary canvas to get data URL
             try {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = qrImage.naturalWidth || qrImage.width;
                tempCanvas.height = qrImage.naturalHeight || qrImage.height;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(qrImage, 0, 0);
                dataUrl = tempCanvas.toDataURL('image/png');
                console.log("Converted img to data URL via temp canvas.");
             } catch (imgError) {
                 console.error("Error converting img src to data URL:", imgError);
             }
        }
    } else {
        console.log("No canvas or img found in QR code container.");
        return; // No QR code element found
    }

    if (dataUrl) {
        downloadLink.href = dataUrl;
        downloadLink.download = `qrcode_${Date.now()}.png`; // Add timestamp for unique names
        downloadLink.style.display = 'inline-block'; // Show the link
        console.log("Download link updated.");
    } else {
        downloadLink.style.display = 'none'; // Hide if data URL failed
        console.log("Failed to get data URL, download link hidden.");
    }
}


// --- Event Listeners ---
if (generateBtn) {
    generateBtn.addEventListener('click', generateQRCode);
} else {
    console.error("Generate button not found!");
}

if (textInput) {
    textInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            generateQRCode(); // Trigger generation on Enter key
        }
    });
}

// --- Initial state ---
if (qrcodeContainer) {
    qrcodeContainer.innerHTML = '<p style="color:#888; font-size: 0.9em;">請輸入內容並點擊產生</p>';
}
if (downloadLink) {
    downloadLink.style.display = 'none'; // Ensure download link is hidden initially
}
console.log("QR Code Generator Initialized (Advanced).");
