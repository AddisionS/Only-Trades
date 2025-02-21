document.addEventListener("DOMContentLoaded", function() {
    // Check if user is logged in
    const user = localStorage.getItem("user");

    if (user) {
        // User is logged in
        document.getElementById("loginLink").style.display = "none";
        document.getElementById("signupLink").style.display = "none";
        document.getElementById("logoutLink").style.display = "block";
    } else {
        // User is not logged in
        document.getElementById("loginLink").style.display = "block";
        document.getElementById("signupLink").style.display = "block";
        document.getElementById("logoutLink").style.display = "none";
    }
});

// Logout function
function logout() {
    localStorage.removeItem("user"); // Remove user from local storage
    window.location.href = "index.html"; // Redirect to homepage
}

// Scroll functionality
const sections = document.querySelectorAll("section");
let currentSection = 0;
let isScrolling = false;

function scrollToSection(index) {
    isScrolling = true;
    window.scrollTo({
        top: sections[index].offsetTop,
        behavior: "smooth",
    });

    setTimeout(() => { isScrolling = false; }, 700); // Ensure scroll finishes
}

window.addEventListener("wheel", function(event) {
    if (isScrolling) return;

    if (event.deltaY > 0) {
        currentSection = Math.min(currentSection + 1, sections.length - 1);
    } else {
        currentSection = Math.max(currentSection - 1, 0);
    }

    scrollToSection(currentSection);
    event.preventDefault();
}, { passive: false });
