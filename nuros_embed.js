/**
 * Nuros Floating Widget Embed Script
 * 
 * Instructions: Add this script tag to any clinician or hospital website
 * <script src="https://api.nuros.ai/v1/nuros_embed.js" data-nuros-api-key="YOUR_KEY_HERE"></script>
 */

(function () {
    console.log("Nuros Vocal Biomarker AI initialized.");

    // Config
    const WIDGET_URL = "http://localhost:8501"; // URL to the hosted Streamlit app
    const SCRIPT_TAG = document.currentScript;
    const API_KEY = SCRIPT_TAG ? SCRIPT_TAG.getAttribute('data-nuros-api-key') : 'demo_mode';


    // Create Floating Button
    const btn = document.createElement("div");
    btn.innerHTML = `
        <div style="
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #0A192F, #112A4F);
            color: #32CD32;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            box-shadow: 0 4px 15px rgba(50, 205, 50, 0.4);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 999999;
            border: 2px solid #32CD32;
            transition: transform 0.3s ease;
        ">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
        </div>
    `;

    // Create IFrame Container
    const iframeContainer = document.createElement("div");
    iframeContainer.style.cssText = `
        position: fixed;
        bottom: 120px;
        right: 30px;
        width: 450px;
        height: 700px;
        max-width: 90vw;
        max-height: 80vh;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        display: none;
        z-index: 999998;
        overflow: hidden;
        border: 1px solid rgba(50, 205, 50, 0.2);
        background: #0A192F;
        transition: opacity 0.3s ease;
        opacity: 0;
    `;

    iframeContainer.innerHTML = `
        <div style="background: rgba(16, 30, 56, 1); padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #32CD32;">
            <span style="color: white; font-family: sans-serif; font-weight: bold; margin:0;">NUROS Telehealth</span>
            <span id="nuros-close" style="color: #94A3B8; cursor: pointer; font-size: 20px; line-height: 1;">&times;</span>
        </div>
        <iframe src="${WIDGET_URL}/?embed=true" style="width: 100%; height: calc(100% - 40px); border: none;"></iframe>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(iframeContainer);

    // Toggle Logic
    let isOpen = false;

    btn.addEventListener('mouseenter', () => btn.children[0].style.transform = "scale(1.1)");
    btn.addEventListener('mouseleave', () => btn.children[0].style.transform = "scale(1)");

    function toggleWidget() {
        isOpen = !isOpen;
        if (isOpen) {
            iframeContainer.style.display = "block";
            setTimeout(() => iframeContainer.style.opacity = "1", 10);
            btn.children[0].innerHTML = `<span style="font-size: 24px;">&times;</span>`;
        } else {
            iframeContainer.style.opacity = "0";
            setTimeout(() => iframeContainer.style.display = "none", 300);
            btn.children[0].innerHTML = `
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
            `;
        }
    }

    btn.addEventListener("click", toggleWidget);
    document.getElementById("nuros-close").addEventListener("click", toggleWidget);

})();
