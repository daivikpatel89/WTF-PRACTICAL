// ==========================================================================
// Practical 6: Asynchronous JavaScript, Fetch API & Browser Storage
// Student ID: 26DIT029 | Class: IT-B
// WanderGo Travels Pvt. Ltd. - Dynamic Travel Portal
// ==========================================================================

// 1. Promotional Banner Timer (setInterval & setTimeout)
let offerSeconds = 15;
const banner = document.getElementById("promoBanner") || document.createElement("div");

function startPromoTimer() {
    setInterval(() => {
        const offers = [
            "🔥 Exclusive 15% OFF on Himalayan Packages! Use Code: WANDER15",
            "🌴 Weekend Special: Free breakfast on all Goa bookings!",
            "✈️ Early Bird Offer: Flat ₹2,000 cashback on domestic flights!"
        ];
        const randomOffer = offers[Math.floor(Math.random() * offers.length)];
        console.log(`[Timer Notification] ${randomOffer}`);
    }, 5000);
}

// 2. Asynchronous Data Fetching using Fetch API
async function loadTravelPackages() {
    const container = document.getElementById("packageList");
    if (!container) return;

    container.innerHTML = "<p>⏳ Loading best travel packages...</p>";

    try {
        // Fetch local JSON mock data
        const response = await fetch("packages.json");
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const packages = await response.json();
        
        container.innerHTML = "";
        packages.forEach(pkg => {
            const card = document.createElement("div");
            card.className = "package-card";
            card.style.cssText = "border:1px solid #ddd; padding:15px; margin:10px 0; border-radius:8px; background:#fff;";
            card.innerHTML = `
                <h3>${pkg.title}</h3>
                <p><strong>Duration:</strong> ${pkg.duration} | <strong>Category:</strong> ${pkg.category}</p>
                <p><strong>Price:</strong> <span style="color:#2b6cb0; font-weight:bold;">${pkg.price}</span></p>
                <button onclick="bookPackage('${pkg.title}')" style="background:#319795; color:white; border:none; padding:8px 14px; border-radius:4px; cursor:pointer;">Book Now</button>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = `<p style="color:red;">❌ Failed to load packages: ${error.message}. Please check connection.</p>`;
    }
}

function bookPackage(packageName) {
    sessionStorage.setItem("lastSelectedPackage", packageName);
    alert(`Package "${packageName}" selected! Ready for checkout in your active session.`);
}

// 3. Browser Storage: LocalStorage (User Preferences)
function savePreferences() {
    const destination = document.getElementById("destination").value;
    const theme = document.getElementById("theme").value;
    const msg = document.getElementById("preferenceMessage");

    if (!destination) {
        msg.textContent = "⚠️ Please select a destination.";
        msg.style.color = "red";
        return;
    }

    localStorage.setItem("preferredDestination", destination);
    localStorage.setItem("preferredTheme", theme);

    applyTheme(theme);
    msg.textContent = `✅ Preferences saved: Destination = ${destination}, Theme = ${theme}. (Persists across browser restarts)`;
    msg.style.color = "green";
}

function applyTheme(theme) {
    if (theme === "dark") {
        document.body.style.backgroundColor = "#1a202c";
        document.body.style.color = "#edf2f7";
    } else {
        document.body.style.backgroundColor = "#f7fafc";
        document.body.style.color = "#2d3748";
    }
}

// 4. Browser Storage: SessionStorage (Temporary Session State)
function startSession() {
    const sessionId = "WG-" + Math.floor(100000 + Math.random() * 900000);
    const loginTime = new Date().toLocaleTimeString();
    
    sessionStorage.setItem("userSessionId", sessionId);
    sessionStorage.setItem("sessionStartTime", loginTime);

    const sessionInfo = document.getElementById("sessionInfo");
    sessionInfo.innerHTML = `
        <strong>Active Session ID:</strong> ${sessionId}<br>
        <strong>Started At:</strong> ${loginTime}<br>
        <small>(Stored in SessionStorage &mdash; Cleared when tab closes)</small>
    `;
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
    // Restore LocalStorage preferences
    const savedDest = localStorage.getItem("preferredDestination");
    const savedTheme = localStorage.getItem("preferredTheme");
    if (savedDest && document.getElementById("destination")) {
        document.getElementById("destination").value = savedDest;
    }
    if (savedTheme) {
        if (document.getElementById("theme")) document.getElementById("theme").value = savedTheme;
        applyTheme(savedTheme);
    }

    // Restore SessionStorage if exists
    const existingSession = sessionStorage.getItem("userSessionId");
    const sessionTime = sessionStorage.getItem("sessionStartTime");
    if (existingSession && document.getElementById("sessionInfo")) {
        document.getElementById("sessionInfo").innerHTML = `
            <strong>Active Session ID:</strong> ${existingSession}<br>
            <strong>Started At:</strong> ${sessionTime}
        `;
    }

    startPromoTimer();
    loadTravelPackages();
});
