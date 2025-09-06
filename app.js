// TODO: replace with your own config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBZgxBfQ2uTmx2Y-c1sbd08k2eK-0JOW3Y",
  authDomain: "shared-clipboard-c5dad.firebaseapp.com",
  databaseURL: "https://shared-clipboard-c5dad-default-rtdb.firebaseio.com",
  projectId: "shared-clipboard-c5dad",
  storageBucket: "shared-clipboard-c5dad.firebasestorage.app",
  messagingSenderId: "112955922102",
  appId: "1:112955922102:web:f0ca068f4260aa7db1f817"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();


firebase.auth().signInAnonymously()
  .then(() => {
    console.log("Signed in anonymously");
  })
  .catch((error) => {
    console.error("Anonymous sign-in failed:", error);
  });
// Elements
const sendModeBtn = document.getElementById("sendModeBtn");
const recvModeBtn = document.getElementById("recvModeBtn");
const sendPanel = document.getElementById("sendPanel");
const recvPanel = document.getElementById("recvPanel");
const sendText = document.getElementById("sendText");
const sendId = document.getElementById("sendId");
const sendBtn = document.getElementById("sendBtn");
const recvId = document.getElementById("recvId");
const recvBtn = document.getElementById("recvBtn");
const recvResult = document.getElementById("recvResult");
const copyBtn = document.getElementById("copyBtn");
const deleteBtn = document.getElementById("deleteBtn");

// Switch mode
sendModeBtn.onclick = () => {
  sendPanel.classList.remove("hidden");
  recvPanel.classList.add("hidden");
};
recvModeBtn.onclick = () => {
  recvPanel.classList.remove("hidden");
  sendPanel.classList.add("hidden");
};

// Send data
sendBtn.onclick = () => {
  const id = sendId.value.trim();
  const txt = sendText.value;
  if (!id) return alert("Please enter a Data ID!");
  const ref = db.ref("datas/" + id);
  ref.get()
    .then((snap) => {
      if (snap.exists()) {
        alert("Data with this ID already exists!");
      } else {
        ref.set({
          content: txt,
          updatedAt: Date.now(),
        })
        .then(() => alert("Data sent with ID: " + id))
        .catch((err) => {
          console.error(err);
          alert("Error sending data: " + err.message);
        });
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Error checking ID: " + err.message);
    });
};

// Receive data
recvBtn.onclick = () => {
  const id = recvId.value.trim();
  if (!id) return alert("Please enter a Data ID!");
  db.ref("datas/" + id)
    .get()
    .then((snap) => {
      if (snap.exists()) {
        const v = snap.val();
        recvResult.textContent = v.content || "(empty)";
        copyBtn.classList.remove("hidden");
        deleteBtn.classList.remove("hidden");
      } else {
        recvResult.textContent = "(No data found with this ID)";
        copyBtn.classList.add("hidden");
        deleteBtn.classList.add("hidden");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Error receiving data: " + err.message);
    });
};

// Copy to clipboard
copyBtn.onclick = async () => {
  try {
    await navigator.clipboard.writeText(recvResult.textContent);
    alert("Copied to clipboard!");
  } catch (e) {
    console.error(e);
    alert("Automatic copy failed. Please use Ctrl+C.");
  }
};

// Delete data
deleteBtn.onclick = () => {
  const id = recvId.value.trim(); 
  if (!id) return alert("Please enter a Data ID!");
  if (!confirm("Are you sure you want to delete data with ID: " + id + "?")) return;
  db.ref("datas/" + id)
    .remove()
    .then(() => {
      alert("Data deleted with ID: " + id);
      recvResult.textContent = "(data deleted)";
      copyBtn.classList.add("hidden");
      deleteBtn.classList.add("hidden");
    }
    )
    .catch((err) => {
      console.error(err);
      alert("Error deleting data: " + err.message);
    });
};

