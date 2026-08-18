const SUPABASE_URL = "https://xlmbncuqsisrbkfbwuze.supabase.co";
const SUPABASE_KEY = "sb_publishable_cyDlCA1TTk9QPpzhBqxBgQ_SN1-5Amx";
const bcrypt = dcodeIO.bcrypt;

let authenticated = false;
let myId = "???";
let myName = "Guest";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function updatePassword(userId, hashedPassword) {
    const {
        data: updatedData,
        error: dbError
    } = await supabaseClient
        .from("users")
        .update({
            pass: hashedPassword
        })
        .eq("id", userId);

    if (dbError) {
        console.error("Error updating password:", dbError.message);
    }
}

async function receiveData() {
    const {
        data: userList,
        error: dbError
    } = await supabaseClient
        .from("users")
        .select("*");

    if (dbError) {
        console.error("Error receiving data:", dbError.message);
        return {};
    }

    const passwordLookupTable = {};
    if (userList) {
        userList.forEach((user) => {
            if (user.id) {
                passwordLookupTable[user.id.toUpperCase()] = user.pass;
            }
        });
    }
    return passwordLookupTable;
}

const nameToId = {};
for (let charCode = 176; charCode <= 255; charCode++) {
    const hexString = charCode.toString(16).toUpperCase();
    nameToId[hexString] = hexString;
    nameToId[hexString.toLowerCase()] = hexString;
}

async function runAuth() {
    let passwords;
    passwords = await receiveData();

    document.addEventListener('keydown', (event) => {
        if (event.key === 'escape') {
            event.preventDefault();

            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch((err) => {
                    console.error(`Fullscreen failed: ${err.message}`);
                });
            }
        }
    }, true);

    const userInputId = prompt("Enter ID or type 'guest':");
    if (!userInputId) {
        window.location.reload();
        return;
    }

    const sanitizedId = userInputId.trim().toUpperCase();

    if ("GUEST" === sanitizedId) {
        const generatedGuestId = "G" + Math.random().toString(36).substring(2, 8).toUpperCase();
        myId = generatedGuestId;
        myName = `Guest-${generatedGuestId}`;
        authenticated = true;
        alert(`Guest Access Granted: ${myName}`);
    } else {
        if ("" === passwords[sanitizedId]) {
            const newPasswordInput = prompt("Account not taken! Please enter your new password:");
            if (!newPasswordInput) {
                window.location.reload();
                return;
            }
            const salt = bcrypt.genSaltSync(10);
            const cleanNewPassword = newPasswordInput.trim();
            const encryptedPassword = bcrypt.hashSync(cleanNewPassword, salt);

            await updatePassword(sanitizedId, encryptedPassword);
            passwords[sanitizedId] = encryptedPassword;
        }

        const parsedHexId = parseInt(sanitizedId, 16);
        const isHexIdInRange = parsedHexId >= 176 && parsedHexId <= 255;

        if (!isHexIdInRange && "ADMIN" !== sanitizedId || "undefined" == typeof pass) {
            const passwordPrompt = prompt("Enter/confirm Password:");
            if (!passwordPrompt) {
                window.location.reload();
                return;
            }
            const enteredPassword = passwordPrompt.trim();

            if ("ADMIN" === sanitizedId && bcrypt.compareSync(enteredPassword, passwords[sanitizedId])) {
                myId = "ADMIN";
                myName = "ADMIN";
                authenticated = true;
            } else {
                if (!isHexIdInRange || !bcrypt.compareSync(enteredPassword, passwords[sanitizedId])) {
                    alert("Invalid ID or Password.");
                    window.location.reload();
                    return;
                }
                myId = sanitizedId;
                myName = sanitizedId;
                authenticated = true;
            }
        } else {
            myId = sanitizedId;
            myName = sanitizedId;
            authenticated = true;
            console.log(myId);
        }
    }
    setupApp();
}

const proxyUrl = "/api/adafruit";
const messageQueue = [];

function setupApp() {
    const idInputEl = document.getElementById("myIdInput");
    if (idInputEl) {
        idInputEl.value = myId;
        idInputEl.readOnly = true;
    }
    setInterval(mainLoop, 3000);

    if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission();
    }
}

function triggerPopUp(senderName, messageBody) {
    const senderEl = document.getElementById("notifSender"),
        bodyEl = document.getElementById("notifBody"),
        popupContainer = document.getElementById("customNotif");

    if (senderEl) senderEl.innerText = senderName;
    if (bodyEl) bodyEl.innerText = messageBody;
    if (popupContainer) popupContainer.style.display = "block";

    setTimeout(() => {
        if (popupContainer) popupContainer.style.display = "none";
    }, 6000);

    document.title = `Home - Classroom`;
    window.onfocus = () => {
        document.title = "Home - Classroom";
    };

    if (window.Notification && Notification.permission === "granted") {
        try {
            new Notification(`New message from ${senderName}`, {
                body: messageBody,
                icon: "favicon.ico"
            });
        } catch (err) {
            console.error("Browser notification error:", err);
        }
    }
}

function signOut() {
    window.location.reload();
}

function changePassword() {
    let newPass = prompt("Please input your new password. If this was a mistake simple input nothing:");
    if (newPass !== "") {
        updatePassword(myId, newPass);
        alert("Your password has been changed!");
    }
    newPass = "";
}

function renderBubble(messageText, messageType, senderLabel) {
    const chatLogEl = document.getElementById("messagesLog");
    if (!chatLogEl) return;

    const bubbleEl = document.createElement("div");
    bubbleEl.className = `msg ${messageType}`;

    const now = new Date();
    const formattedTime = `${now.toLocaleDateString([], { month: "short", day: "numeric" })}, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    bubbleEl.innerHTML = `
        <div class="sender-tag">${senderLabel}</div>
        <div class="msg-content-wrapper">
            <div>${messageText}</div>
            <div class="msg-time-tag">${formattedTime}</div>
        </div>
    `;

    chatLogEl.appendChild(bubbleEl);
    chatLogEl.scrollTop = chatLogEl.scrollHeight;
}

function sendFromUI() {
    if (!authenticated) return;

    const messageInputEl = document.getElementById("msgInput"),
        receiverInputEl = document.getElementById("receiverInput");

    if (!messageInputEl || !receiverInputEl) return;

    const cleanMessage = messageInputEl.value.trim();
    if (!cleanMessage) return;

    if ("/root" === cleanMessage) {
        document.body.classList.toggle("root-mode");
        renderBubble("ROOT MODE TOGGLED", "received", "SYSTEM");
        messageInputEl.value = "";
        return;
    }

    receiverInputEl.value.split(";").forEach((receiver) => {
        let cleanReceiver = receiver.trim().toLowerCase();
        if (!cleanReceiver) return;

        const resolvedId = nameToId[cleanReceiver] ? nameToId[cleanReceiver] : cleanReceiver.toUpperCase();
        messageQueue.push(`${myId}|1|${resolvedId}|${cleanMessage}`);
    });

    renderBubble(cleanMessage, "sent", `ME → ${receiverInputEl.value}`);
    messageInputEl.value = "";
}
async function mainLoop() {
    if (authenticated) {
        if (messageQueue.length > 0) {
            const e = messageQueue.shift();
            try {
                await fetch(proxyUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        action: "send",
                        value: e
                    })
                });
            } catch (t) {
                messageQueue.unshift(e);
            }
        }

        try {
            const response = await fetch(`${proxyUrl}?action=get`);
            if (response.ok) {
                const t = await response.json();
                for (let e of t) {
                    const t = e.value.split("|");
                    if (t.length >= 4 && t[2] === myId) {
                        renderBubble(t[3], "received", t[0]);
                        triggerPopUp(t[0], t[3]);

                        await fetch(proxyUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                action: "delete",
                                id: e.id
                            })
                        });
                    }
                }
            }
        } catch (e) {
            console.log("Poll Error");
        }
    }
}


function clearChat() {
    const chatLogEl = document.getElementById("messagesLog");
    if (chatLogEl) {
        chatLogEl.innerHTML = "";
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'escape') {
        event.preventDefault();

        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Fullscreen failed: ${err.message}`);
            });
        }
    }
}, true);

const msgInputEl = document.getElementById("msgInput");
if (msgInputEl) {
    msgInputEl.addEventListener("keypress", (event) => {
        if ("Enter" === event.key) {
            sendFromUI();
        }
    });
}
runAuth();
