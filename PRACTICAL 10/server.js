// ==========================================================================
// Practical 10: Web Security Vulnerabilities & Defensive Coding
// Student ID: 26DIT029 | Class: IT-B
// FinSecure Solutions Pvt. Ltd. - Employee Management Portal Security
// ==========================================================================

const express = require("express");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware for parsing JSON and form payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Simulated Secure User Database with Hashed Passwords
// Security Best Practice: Passwords stored as salted SHA-256 / PBKDF2 hashes
const usersDB = [
    {
        id: 1,
        username: "admin_daivik",
        // Password: "Password@123" with salt
        salt: "f1a2b3c4d5e6f7a8",
        passwordHash: crypto.pbkdf2Sync("Password@123", "f1a2b3c4d5e6f7a8", 1000, 64, "sha512").toString("hex"),
        role: "Administrator",
        email: "admin@finsecure.com"
    }
];

// Employee Audit Records (Simulated Data Table)
let employeeNotes = [
    { id: 1, author: "26DIT029", note: "Q3 financial security review completed without findings." }
];

// 1. Secure Password Hashing Utility
function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

// 2. Input Validation Helper (Password Policy)
function validatePasswordPolicy(password) {
    // Regex: At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

// 3. XSS Output Encoding Function (Sanitization)
function escapeHTML(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Route: User Registration with Strict Security
app.post("/api/register", (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ success: false, message: "All fields are mandatory." });
        }

        // Validate password strength
        if (!validatePasswordPolicy(password)) {
            return res.status(400).json({
                success: false,
                message: "Password does not meet complexity requirements (Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)."
            });
        }

        // Check if user already exists
        const exists = usersDB.some(u => u.username === username);
        if (exists) {
            return res.status(409).json({ success: false, message: "Username already registered." });
        }

        // Generate salt and hash password
        const salt = crypto.randomBytes(16).toString("hex");
        const passwordHash = hashPassword(password, salt);

        usersDB.push({
            id: usersDB.length + 1,
            username: escapeHTML(username),
            salt,
            passwordHash,
            role: "Employee",
            email: escapeHTML(email)
        });

        res.status(201).json({
            success: true,
            message: "User registered securely! Password stored as cryptographic hash."
        });
    } catch (err) {
        // Safe Error Handling: Do not leak internal system traces
        res.status(500).json({ success: false, message: "A server error occurred. Please try again later." });
    }
});

// Route: Secure Login (Defense against SQL Injection)
app.post("/api/login", (req, res) => {
    try {
        const { username, password } = req.body;

        // Defensive Parameterized Search (avoids dynamic query concatenation like ' OR 1=1 --)
        const user = usersDB.find(u => u.username === username);
        if (!user) {
            // Generic message prevents username harvesting
            return res.status(401).json({ success: false, message: "Invalid credentials provided." });
        }

        const attemptedHash = hashPassword(password, user.salt);
        if (attemptedHash !== user.passwordHash) {
            return res.status(401).json({ success: false, message: "Invalid credentials provided." });
        }

        res.json({
            success: true,
            message: `Authentication successful! Welcome, ${user.username}.`,
            user: { username: user.username, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal authentication error." });
    }
});

// Route: Data Submission with XSS Sanitization & Demonstration
app.post("/api/notes", (req, res) => {
    const { note, sanitize } = req.body;
    if (!note) {
        return res.status(400).json({ success: false, message: "Note content cannot be empty." });
    }

    let processedNote = note;
    if (sanitize === true || sanitize === "true") {
        processedNote = escapeHTML(note); // Output Encoding & Sanitization
    }

    const newRecord = {
        id: employeeNotes.length + 1,
        author: "26DIT029",
        note: processedNote,
        isSanitized: sanitize === true || sanitize === "true"
    };
    employeeNotes.push(newRecord);

    res.json({
        success: true,
        record: newRecord,
        notes: employeeNotes
    });
});

app.get("/api/notes", (req, res) => {
    res.json(employeeNotes);
});

app.listen(PORT, () => {
    console.log(`FinSecure portal running on http://127.0.0.1:${PORT}`);
});
