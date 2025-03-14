// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Animationen
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.hero-content, .hero-image');

    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });

// Schreibanimation für "Designer/Coder"
const textElement = document.querySelector(".hero-title");
const textArray = ["Designer", "Coder"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentText = textArray[textIndex];
    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    textElement.innerHTML = currentText.substring(0, charIndex) + '<span class="cursor">|</span>';

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1000); // Pause bevor es gelöscht wird
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        setTimeout(typeEffect, 500); // Pause bevor es neu getippt wird
    } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
}

// Startet die Animation nach dem Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(typeEffect, 500);
});

});