bunny spammer html
<div class="app">
  <header>
    <h1>🐰 BUNNY HUB</h1>
    <p>RGB CUSTOMIZER • LIFE TOGETHER</p>
    <span class="version">VERSION 10.0</span>
  </header>

  <section class="panel">
    <h2>🌈 RGB SETTINGS</h2>
    <button id="rgbToggle">RGB ON</button>
    <div class="color-preview" id="colorPreview"></div>
  </section>

  <section class="panel">
    <h2>🚗 RGB VEHICLE</h2>
    <input id="vehicleName" placeholder="Vehicle name">
    <button onclick="preview('vehicle')">Preview Vehicle</button>
    <p id="vehicleResult">No vehicle selected</p>
  </section>

  <section class="panel">
    <h2>📱 PHONE CUSTOMIZER</h2>
    <input id="phoneText" placeholder="Enter phone text">
    <button onclick="preview('phone')">Preview Phone</button>
    <p id="phoneResult">Phone preview</p>
  </section>

  <section class="panel">
    <h2>✨ RGB BIO</h2>
    <textarea id="bioText" placeholder="Write your bio..."></textarea>
    <button onclick="preview('bio')">Preview Bio</button>
    <p id="bioResult">Your bio preview</p>
  </section>

  <section class="panel">
    <h2>🎨 RGB NAME</h2>
    <input id="nameText" placeholder="Enter your name">
    <button onclick="preview('name')">Preview Name</button>
    <p id="nameResult">Your name</p>
  </section>

  <section class="panel">
    <h2>💬 MESSAGE DEMO</h2>
    <textarea id="spamText" placeholder="Write your custom message..."></textarea>

    <label>Preview speed</label>
    <input type="range" id="speed" min="1" max="5" value="2">
    <p id="speedValue">Speed: 2</p>

    <div class="buttons">
      <button id="startBtn">START</button>
      <button id="stopBtn">STOP</button>
    </div>

    <p id="status">Status: Stopped</p>
    <div id="messageList" class="message-list"></div>
  </section>

  <section class="panel">
    <h2>📋 MY LIST</h2>
    <input id="listInput" placeholder="Add something to your list">
    <button id="addBtn">ADD TO LIST</button>
    <ul id="myList"></ul>
  </section>

  <footer>
    <p>🐰 BUNNY HUB © 2026</p>
    <p>Made for customization previews</p>
  </footer>
</div>

css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 20px 12px;
  background: #090711;
  color: white;
  font-family: Arial, sans-serif;
}

.app {
  max-width: 480px;
  margin: auto;
}

header {
  text-align: center;
  padding: 25px 10px;
  border: 1px solid #a855f7;
  border-radius: 18px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #190d2b, #090711);
}

header h1 {
  font-size: 32px;
  color: #d8a5ff;
  text-shadow: 0 0 15px #a855f7;
}

header p {
  color: #c4a5fd;
  font-size: 12px;
  letter-spacing: 2px;
}

.version {
  display: inline-block;
  padding: 7px 15px;
  border-radius: 20px;
  background: #6d28d9;
  margin-top: 10px;
}

.panel {
  background: #151020;
  border: 1px solid #663399;
  border-radius: 15px;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 0 0 12px #6b21a855;
}

.panel h2 {
  color: #d8b4fe;
  font-size: 17px;
  margin-top: 0;
}

input, textarea {
  width: 100%;
  padding: 13px;
  margin: 8px 0;
  border: 1px solid #8b5cf6;
  border-radius: 9px;
  background: #090711;
  color: white;
  outline: none;
  font-size: 14px;
}

textarea {
  min-height: 75px;
  resize: vertical;
}

input:focus, textarea:focus {
  border-color: #e879f9;
  box-shadow: 0 0 8px #a855f7;
}

button {
  border: none;
  border-radius: 9px;
  padding: 12px 17px;
  margin-top: 8px;
  background: linear-gradient(90deg, #7e22ce, #c026d3);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

button:active {
  transform: scale(0.96);
}

button:hover {
  box-shadow: 0 0 14px #c026d3;
}

.color-preview {
  height: 13px;
  border-radius: 20px;
  margin-top: 16px;
  background: linear-gradient(
    90deg,
    red, orange, yellow, lime,
    cyan, blue, violet, red
  );
  animation: rainbow 4s linear infinite;
  background-size: 300%;
}

@keyframes rainbow {
  0% { background-position: 0%; }
  100% { background-position: 300%; }
}

.rgb-off .color-preview {
  animation: none;
  background: #555;
}

.buttons {
  display: flex;
  gap: 10px;
}

.buttons button {
  flex: 1;
}

#stopBtn {
  background: #991b1b;
}

.message-list {
  max-height: 180px;
  overflow-y: auto;
  margin-top: 12px;
}

.message-item {
  padding: 10px;
  margin: 7px 0;
  border-radius: 8px;
  background: #26163b;
  border-left: 3px solid #c084fc;
  overflow-wrap: anywhere;
}

#status {
  color: #c084fc;
  font-size: 13px;
}

#myList {
  padding-left: 20px;
}

#myList li {
  padding: 8px;
  background: #26163b;
  border-radius: 7px;
  margin: 6px 0;
  overflow-wrap: anywhere;
}

.deleteBtn {
  background: #991b1b;
  padding: 5px 10px;
  margin-left: 8px;
}

footer {
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
  padding: 20px;
}

js code
let rgbEnabled = true;
let running = false;
let demoInterval = null;
let messageCount = 0;

const rgbToggle = document.getElementById("rgbToggle");
const app = document.querySelector(".app");
const speed = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const messageList = document.getElementById("messageList");
const statusText = document.getElementById("status");

// RGB ON / OFF
rgbToggle.addEventListener("click", () => {
  rgbEnabled = !rgbEnabled;

  rgbToggle.textContent = rgbEnabled ? "RGB ON" : "RGB OFF";
  app.classList.toggle("rgb-off", !rgbEnabled);
});

// Customizer previews
function preview(type) {
  const fields = {
    vehicle: ["vehicleName", "vehicleResult"],
    phone: ["phoneText", "phoneResult"],
    bio: ["bioText", "bioResult"],
    name: ["nameText", "nameResult"]
  };

  const [inputId, resultId] = fields[type];
  const value = document.getElementById(inputId).value.trim();

  if (!value) {
    alert("Please enter something first!");
    return;
  }

  const result = document.getElementById(resultId);
  result.textContent = value;
  result.style.color = rgbEnabled ? "#e879f9" : "white";
}

// Preview speed
speed.addEventListener("input", () => {
  speedValue.textContent = "Speed: " + speed.value;
});

// Local message preview only
function addMessage() {
  const text = document.getElementById("spamText").value.trim();

  if (!text) {
    statusText.textContent = "Status: Enter a message first";
    stopDemo();
    return;
  }

  messageCount++;

  const item = document.createElement("div");
  item.className = "message-item";
  item.textContent = messageCount + ". " + text;

  messageList.prepend(item);

  if (messageList.children.length > 30) {
    messageList.lastElementChild.remove();
  }
}

// Start demo
document.getElementById("startBtn").addEventListener("click", () => {
  if (running) return;

  const text = document.getElementById("spamText").value.trim();

  if (!text) {
    alert("Write your message first!");
    return;
  }

  running = true;
  statusText.textContent = "Status: Running preview";

  const delay = 1200 / Number(speed.value);

  addMessage();

  demoInterval = setInterval(() => {
    if (!running) return;
    addMessage();
  }, delay);
});

// Stop demo
function stopDemo() {
  running = false;
  clearInterval(demoInterval);
  demoInterval = null;
  statusText.textContent = "Status: Stopped";
}

document.getElementById("stopBtn").addEventListener("click", stopDemo);

// Add to list
document.getElementById("addBtn").addEventListener("click", () => {
  const input = document.getElementById("listInput");
  const value = input.value.trim();

  if (!value) {
    alert("Enter something to add!");
    return;
  }

  const li = document.createElement("li");
  const text = document.createElement("span");
  text.textContent = value;

  const del = document.createElement("button");
  del.textContent = "DELETE";
  del.className = "deleteBtn";

  del.addEventListener("click", () => {
    li.remove();
  });

  li.append(text, del);
  document.getElementById("myList").appendChild(li);

  input.value = "";
});

// Enter key to add list item
document.getElementById("listInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("addBtn").click();
  }
});

// Initial setup
app.classList.remove("rgb-off");
statusText.textContent = "Status: Stopped";



