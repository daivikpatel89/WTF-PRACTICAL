// ==========================================================================
// Practical 4: DOM Manipulation & Event Handling
// Student ID: 26DIT029 | Class: IT-B
// ShopEase Online Store - Interactive Product Management
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Element Selection using various DOM methods
    const title = document.getElementById("title");
    const themeBtn = document.getElementById("themeBtn");
    const addBtn = document.getElementById("addBtn");
    const removeBtn = document.getElementById("removeBtn");
    const productInput = document.getElementById("productName");
    const message = document.getElementById("message");
    const productList = document.getElementById("productList");

    // Query selector example
    const bannerImg = document.querySelector("#productImage");

    let isDarkTheme = false;

    // 2. Theme Switching (Dynamic Style & Class Manipulation)
    themeBtn.addEventListener("click", () => {
        isDarkTheme = !isDarkTheme;
        if (isDarkTheme) {
            document.body.style.backgroundColor = "#1e1e2f";
            document.body.style.color = "#ffffff";
            title.style.color = "#4da3ff";
            themeBtn.textContent = "Switch to Light Theme";
            message.textContent = "Dark theme applied successfully.";
            message.style.color = "#4da3ff";
        } else {
            document.body.style.backgroundColor = "#f4f6f9";
            document.body.style.color = "#333333";
            title.style.color = "#1e293b";
            themeBtn.textContent = "Switch to Dark Theme";
            message.textContent = "Light theme applied successfully.";
            message.style.color = "#10b981";
        }
    });

    // 3. Adding an Element Dynamically (createElement, appendChild)
    addBtn.addEventListener("click", () => {
        const itemText = productInput.value.trim();
        if (itemText === "") {
            message.textContent = "⚠️ Please enter a product name first!";
            message.style.color = "#ef4444";
            productInput.focus();
            return;
        }

        // Create new li element
        const newLi = document.createElement("li");
        newLi.textContent = itemText;
        newLi.style.cursor = "pointer";
        newLi.title = "Click to highlight or remove";

        // Add mouse interaction events
        newLi.addEventListener("mouseover", () => {
            newLi.style.backgroundColor = isDarkTheme ? "#334155" : "#e2e8f0";
            newLi.style.paddingLeft = "8px";
            newLi.style.transition = "0.2s";
        });
        newLi.addEventListener("mouseout", () => {
            newLi.style.backgroundColor = "transparent";
            newLi.style.paddingLeft = "0px";
        });

        // Append to list
        productList.appendChild(newLi);

        message.textContent = `✅ "${itemText}" added to catalog.`;
        message.style.color = "#10b981";
        productInput.value = "";
        productInput.focus();
    });

    // 4. Removing an Element Dynamically (removeChild)
    removeBtn.addEventListener("click", () => {
        const items = productList.getElementsByTagName("li");
        if (items.length > 0) {
            const removedItem = items[items.length - 1].textContent;
            productList.removeChild(items[items.length - 1]);
            message.textContent = `🗑️ Removed "${removedItem}" from catalog.`;
            message.style.color = "#f59e0b";
        } else {
            message.textContent = "⚠️ No products remaining to remove.";
            message.style.color = "#ef4444";
        }
    });

    // 5. Keyboard Event (Enter key to submit)
    productInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addBtn.click();
        }
    });

    // Initial log of all items using querySelectorAll
    const initialItems = document.querySelectorAll("#productList li");
    console.log(`Initial items loaded: ${initialItems.length}`);
});
