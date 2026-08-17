import "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.0/dist/umd/supabase.js?v=1"
import "https://cdnjs.cloudflare.com/ajax/libs/bcryptjs/2.4.3/bcrypt.min.js"
import {startHackSequence} from "./hack.js"
function handleUserInteraction() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
      .catch((err) => {
        console.error(`Fullscreen failed: ${err.message}`);
      });
  }
}
const bcrypt = dcodeIO.bcrypt;
const SUPABASE_URL = "https://xlmbncuqsisrbkfbwuze.supabase.co";
const SUPABASE_KEY = "sb_publishable_cyDlCA1TTk9QPpzhBqxBgQ_SN1-5Amx";
let authenticated = false;
let myId = "???";
let myName = "Guest";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
async function updatePassword(e, t) {
	const {
        	data: n,
        	error: o
        } = await supabaseClient.from("users").update({
          pass: t
        }).eq("id", e);
        o && console.error("Error updating password:", o.message)
      }
      async function receiveData() {
        const {
          data: e,
          error: t
        } = await supabaseClient.from("users").select("*");
        if (t) return console.error("Error receiving data:", t.message), {};
        {
          const t = {};
          return e && e.forEach((e => {
            e.id && (t[e.id.toUpperCase()] = e.pass)
          })), t
        }
      }
      let passwords;
      const nameToId = {};
      for (let e = 176; e <= 255; e++) {
        const t = e.toString(16).toUpperCase();
        nameToId[t] = t, nameToId[t.toLowerCase()] = t
      }
      async function runAuth() {
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
        const e = prompt("Enter ID or type 'guest':");
        if (!e) {
          startHackSequence();
          return
        }
        const t = e.trim().toUpperCase();
        if ("GUEST" === t) {
          const e = "G" + Math.random().toString(36).substring(2, 8).toUpperCase();
          myId = e, myName = `Guest-${e}`, authenticated = true, alert(`Guest Access Granted: ${myName}`)
        } else {
          if ("" === passwords[t]) {
            const e = prompt("Account not taken! Please enter your new password:");
            if (!e) {
              startHackSequence();
              return
            }
            const n = bcrypt.genSaltSync(10),
              o = e.trim();
            await updatePassword(t, bcrypt.hashSync(o, n)), passwords[t] = bcrypt.hashSync(o, n)
          }
          const e = parseInt(t, 16),
            n = e >= 176 && e <= 255;
          if (!n && "ADMIN" !== t || "undefined" == typeof pass) {
            const e = prompt("Enter/confirm Password:");
            if (!e) {
              startHackSequence();
              return
            }
            const o = e.trim();
            if ("ADMIN" === t && bcrypt.compareSync(o, passwords[t])) myId = "ADMIN", myName = "ADMIN", authenticated = true;
            else {
              if (!n || !bcrypt.compareSync(o, passwords[t])) {
                alert("Invalid ID or Password."), startHackSequence();
                return
              }
              myId = t, myName = t, authenticated = true
            }
          } else myId = t, myName = t, authenticated = true, console.log(myId)
        }
        setupApp()
      }
      const username = "Robert22G",
        key = "aio_MJDg24Yk3ALPc8ZMxM5SPvhg6W8D",
        feedName = "messages",
        baseUrl = `https://io.adafruit.com/api/v2/${username}/feeds/${feedName}/data`,
        messageQueue = [];

      function setupApp() {
        const e = document.getElementById("myIdInput");
        e && (e.value = myId, e.readOnly = true), setInterval(mainLoop, 3e3);
        
        if (window.Notification && Notification.permission !== "denied") {
          Notification.requestPermission();
        }
      }

      function triggerPopUp(e, t) {
        const n = document.getElementById("notifSender"),
          o = document.getElementById("notifBody"),
          a = document.getElementById("customNotif");
        n && (n.innerText = e), o && (o.innerText = t), a && (a.style.display = "block"), setTimeout((() => {
          a && (a.style.display = "none")
        }), 6e3), document.title = `Home - Classroom`, window.onfocus = () => {
          document.title = "Home - Classroom"
        };

        if (window.Notification && Notification.permission === "granted") {
          try {
            new Notification(`New message from ${e}`, {
              body: t,
              icon: "favicon.ico"
            });
          } catch (err) {
            console.error("Browser notification error:", err);
          }
        }
      }


      function signOut() {
        window.location.reload()
      }

      function renderBubble(e, t, n) {
        const o = document.getElementById("messagesLog");
        if (!o) return;
        const a = document.createElement("div");
        a.className = `msg ${t}`;
        const s = new Date,
          r = `${s.toLocaleDateString([],{month:"short",day:"numeric"})}, ${s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`;
        a.innerHTML = `\n        <div class="sender-tag">${n}</div>\n        <div class="msg-content-wrapper">\n            <div>${e}</div>\n            <div class="msg-time-tag">${r}</div>\n        </div>\n    `, o.appendChild(a), o.scrollTop = o.scrollHeight
      }

      function sendFromUI() {
        if (!authenticated) return;
        const e = document.getElementById("msgInput"),
          t = document.getElementById("receiverInput");
        if (!e || !t) return;
        const n = e.value.trim();
        if (!n) return;
        if ("/root" === n) return document.body.classList.toggle("root-mode"), renderBubble("ROOT MODE TOGGLED", "received", "SYSTEM"), void(e.value = "");
        t.value.split(";").forEach((e => {
          let t = e.trim().toLowerCase();
          if (!t) return;
          const o = nameToId[t] ? nameToId[t] : t.toUpperCase();
          messageQueue.push(`${myId}|1|${o}|${n}`)
        })), renderBubble(n, "sent", `ME → ${t.value}`), e.value = ""
      }
      async function mainLoop() {
        if (authenticated) {
          if (messageQueue.length > 0) {
            const e = messageQueue.shift();
            try {
              await fetch(baseUrl, {
                method: "POST",
                headers: {
                  "X-AIO-Key": key,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  value: e
                })
              })
            } catch (t) {
              messageQueue.unshift(e)
            }
          }
          try {
            const e = await fetch(`${baseUrl}?limit=5`, {
              headers: {
                "X-AIO-Key": key
              }
            });
            if (e.ok) {
              const t = await e.json();
              for (let e of t) {
                const t = e.value.split("|");
                t.length >= 4 && t[2] === myId && (renderBubble(t[3], "received", t[0]), triggerPopUp(t[0], t[3]), await fetch(`${baseUrl}/${e.id}`, {
                  method: "DELETE",
                  headers: {
                    "X-AIO-Key": key
                  }
                }))
              }
            }
          } catch (e) {
            console.log("Poll Error")
          }
        }
      }

      function clearChat() {
        const e = document.getElementById("messagesLog");
        e && (e.innerHTML = "")
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
      msgInputEl && msgInputEl.addEventListener("keypress", (e => {
        "Enter" === e.key && sendFromUI()
      })), runAuth()

