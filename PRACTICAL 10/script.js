// Client-side interactions & defensive verification
document.addEventListener("DOMContentLoaded", () => {
    // Password Strength Evaluator
    const regPass = document.getElementById("regPass");
    const meter = document.getElementById("strengthMeter");

    regPass.addEventListener("input", () => {
        const val = regPass.value;
        const hasUpper = /[A-Z]/.test(val);
        const hasLower = /[a-z]/.test(val);
        const hasDigit = /\d/.test(val);
        const hasSpecial = /[@$!%*?&]/.test(val);
        const isLong = val.length >= 8;

        const score = [hasUpper, hasLower, hasDigit, hasSpecial, isLong].filter(Boolean).length;

        if (val.length === 0) {
            meter.textContent = "Password Strength: Neutral";
            meter.style.color = "#94a3b8";
        } else if (score <= 2) {
            meter.textContent = "Password Strength: Weak ⚠️ (Needs upper, lower, digit & special char)";
            meter.style.color = "#ef4444";
        } else if (score <= 4) {
            meter.textContent = "Password Strength: Moderate ⚡ (Add special characters or length)";
            meter.style.color = "#f59e0b";
        } else {
            meter.textContent = "Password Strength: Strong 🛡️ (Complies with ISO 27001 policy)";
            meter.style.color = "#10b981";
        }
    });

    // Registration Handler
    document.getElementById("registerForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("regUser").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPass").value;
        const msg = document.getElementById("registerMsg");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            msg.className = "msg-box " + (data.success ? "msg-success" : "msg-error");
            msg.textContent = data.message;
        } catch (err) {
            msg.className = "msg-box msg-error";
            msg.textContent = "Error communicating with secure endpoint.";
        }
    });

    // Login Handler
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("loginUser").value;
        const password = document.getElementById("loginPass").value;
        const msg = document.getElementById("loginMsg");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            msg.className = "msg-box " + (data.success ? "msg-success" : "msg-error");
            msg.textContent = data.message;
        } catch (err) {
            msg.className = "msg-box msg-error";
            msg.textContent = "Authentication communication failed.";
        }
    });

    // Audit Note / XSS Handler
    const noteContainer = document.getElementById("notesContainer");
    async function loadNotes() {
        try {
            const res = await fetch("/api/notes");
            const list = await res.json();
            noteContainer.innerHTML = "";
            list.forEach(item => {
                const div = document.createElement("div");
                div.className = "note-item";
                div.innerHTML = `<strong>#${item.id} [Author: ${item.author}]:</strong> ${item.note} <small style="color:${item.isSanitized ? '#10b981' : '#f59e0b'}">(${item.isSanitized ? 'Encoded' : 'Unsanitized'})</small>`;
                noteContainer.appendChild(div);
            });
        } catch (err) {}
    }

    document.getElementById("noteForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const note = document.getElementById("noteInput").value;
        const sanitize = document.getElementById("sanitizeToggle").checked;
        const msg = document.getElementById("noteMsg");

        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note, sanitize })
            });
            const data = await res.json();
            if (data.success) {
                msg.className = "msg-box msg-success";
                msg.textContent = `Entry recorded! Sanitization: ${sanitize ? 'Active' : 'Disabled'}.`;
                document.getElementById("noteInput").value = "";
                loadNotes();
            }
        } catch (err) {
            msg.className = "msg-box msg-error";
            msg.textContent = "Failed to record audit note.";
        }
    });

    loadNotes();
});
