export function startHackSequence() {
  window.addEventListener('click', handleUserInteraction);
  window.addEventListener('keydown', handleUserInteraction);

  window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = '';
  });

  document.body.style.backgroundColor = "#050505";
  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";
  
  const platform = navigator.platform;
  const screenRes = `${window.screen.width}x${window.screen.height}`;

  document.body.innerHTML = `
    <div style="padding: 30px; font-family: 'Courier New', Courier, monospace; color: #00ff00; height: 100vh; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; background: radial-gradient(circle, #0a150a 0%, #020502 100%);">
      <div>
        <div id="sys-info" style="margin-bottom: 20px; color: #ff3333; font-weight: bold; letter-spacing: 1px; font-size: 1.1rem;"></div>
        <div id="log-container" style="overflow: hidden; height: 60vh; font-size: 1rem; line-height: 1.5; opacity: 0.85;"></div>
      </div>
      <div id="status-text" style="font-size: 1.8rem; text-shadow: 0 0 12px #00ff00; white-space: pre; border-top: 1px solid #004400; padding-top: 20px; font-weight: bold;">Connecting... [                              ] 0%</div>
    </div>
  `;

  const sysInfo = document.getElementById("sys-info");
  const logContainer = document.getElementById("log-container");
  const statusText = document.getElementById("status-text");

  sysInfo.innerHTML = `[!] TARGET_DEVICE: ${platform}<br>[!] ENVIRONMENT: ${screenRes}<br>[!] INITIALIZING EXFILTRATION PROTOCOL...`;

  const fakePaths = [
    "Extracting local session tokens...",
    "Bypassing host firewall layers...",
    "Dumping local security certificates...",
    "C:/Users/Owner/Documents/financial_records.pdf -> Copied",
    "C:/Users/Owner/AppData/Local/Google/Chrome/User Data/Default/Cookies -> Intercepted",
    "Mirroring local network topology...",
    "Injecting background payload into registry keys...",
    "Accessing native hardware drivers... OK",
    "Compiling system configuration directory...",
    "C:/Users/Owner/Pictures/Camera Roll/ -> Indexing files"
  ];

  const totalTime = 22000;
  const totalBars = 30;
  const intervalSpeed = 80;
  const totalSteps = totalTime / intervalSpeed;
  let currentStep = 0;

  try {
    const speech = new SpeechSynthesisUtterance("Warning. System integrity compromised. Data exfiltration in progress.");
    speech.rate = 0.95;
    window.speechSynthesis.speak(speech);
  } catch(e) {
    console.warn("Audio block or context not allowed yet:", e);
  }

  const timer = setInterval(() => {
    currentStep++;
    const timeRatio = currentStep / totalSteps;
    const easeProgress = Math.pow(timeRatio - 1, 3) + 1;
    const progress = Math.min(Math.floor(easeProgress * 100), 100);
    
    const Y = Math.floor((progress / 100) * totalBars);
    const X = totalBars - Y;
    const bar = '[' + '█'.repeat(Y) + ' '.repeat(X) + ']';
    
    statusText.textContent = `DUMPING FILE DIRECTORIES... ${bar} ${progress}%`;

    if (Math.random() > 0.35 && progress < 100) {
      const randomLine = fakePaths[Math.floor(Math.random() * fakePaths.length)];
      const logLine = document.createElement("div");
      logLine.style.marginBottom = "4px";
      logLine.textContent = `[>>] ${randomLine} (${Math.floor(Math.random() * 1200 + 300)} KB/s)`;
      logContainer.appendChild(logLine);
      logContainer.scrollTop = logContainer.scrollHeight;
    }

    if (currentStep >= totalSteps) {
      clearInterval(timer);
      
      document.body.innerHTML = `
        <div style="background-color: #0d0202; color: #ff3333; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: 'Courier New', Courier, monospace; box-sizing: border-box; border: 15px solid #ff3333; animation: pulse 2s infinite;">
          <style>
            @keyframes pulse {
              0% { border-color: #ff3333; box-shadow: inset 0 0 50px rgba(255,0,0,0.5); }
              50% { border-color: #550000; box-shadow: inset 0 0 20px rgba(0,0,0,0.8); }
              100% { border-color: #ff3333; box-shadow: inset 0 0 50px rgba(255,0,0,0.5); }
            }
          </style>
          <div style="text-align: center; max-width: 800px; padding: 20px;">
            <div style="font-size: 5.5rem; font-weight: bold; letter-spacing: 3px; text-shadow: 0 0 15px #ff0000; margin-bottom: 10px;">SYSTEM COMPROMISED</div>
            <div style="font-size: 1.5rem; color: #ffffff; border: 2px dashed #ff3333; padding: 15px 30px; display: inline-block; letter-spacing: 1px; background: rgba(255,0,0,0.1);">
              ALL DATA EXFILTRATED SUCCESSFULLY
            </div>
            <div style="margin-top: 40px; font-size: 1.1rem; color: #888888; text-align: left; line-height: 1.6; background: #000; padding: 20px; border-radius: 5px;">
              > Connection Status: Encrypted Tunnel Active<br>
              > Remote Node: Hidden via Tor Proxy Chain<br>
              > Total Packages Sent: 4,192 (Compressed)<br>
              > System Access: Permanent Backdoor Established
            </div>
          </div>
        </div>
      `;
    }
  }, intervalSpeed);
}

