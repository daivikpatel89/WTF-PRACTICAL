// FoodExpress Interactive Logic
let cart = [];

function addToCart(itemName, price) {
    cart.push({ name: itemName, price: price });
    document.getElementById("cartCount").textContent = cart.length;
    alert(`🛒 Added "${itemName}" (₹${price}) to your cart!`);
}

function viewCart() {
    if (cart.length === 0) {
        alert("Your cart is currently empty. Explore our signature dishes and add your favorites!");
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const summary = cart.map(i => `• ${i.name} - ₹${i.price}`).join("\n");
    alert(`🛍️ Your Current Order:\n\n${summary}\n\nTotal Payable: ₹${total}\n\nProceed to checkout?`);
}

function handleContact(e) {
    e.preventDefault();
    alert("Thank you for reaching out! The FoodExpress team has received your message.");
    e.target.reset();
}
