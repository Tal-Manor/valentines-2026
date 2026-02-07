// ===== DOM Elements =====
const questionCard = document.getElementById('questionCard');
const confirmCard = document.getElementById('confirmCard');
const successCard = document.getElementById('successCard');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const backBtn = document.getElementById('backBtn');
const submitBtn = document.getElementById('submitBtn');
const confirmInput = document.getElementById('confirmInput');
const heartsContainer = document.getElementById('heartsContainer');

// ===== Create Floating Hearts Background =====
function createFloatingHearts() {
    const hearts = ['💕', '💖', '💗', '💓', '💞', '❤️', '💘', '💝'];

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart-bg';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (5 + Math.random() * 5) + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
        heartsContainer.appendChild(heart);
    }
}

// ===== Create Confetti Effect =====
function createConfetti() {
    const colors = ['#ff6b8a', '#ff85a2', '#ffd6e0', '#c9b1ff', '#f5576c', '#ff9a9e'];
    const shapes = ['heart', 'circle', 'square'];

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';

            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];

            if (shape === 'heart') {
                confetti.textContent = '❤️';
                confetti.style.fontSize = (0.8 + Math.random() * 1) + 'rem';
                confetti.style.background = 'transparent';
            } else {
                confetti.style.background = color;
                confetti.style.borderRadius = shape === 'circle' ? '50%' : '3px';
            }

            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';

            document.body.appendChild(confetti);

            // Remove confetti after animation
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// ===== Card Transition Functions =====
function showCard(cardToShow) {
    // Hide all cards first
    questionCard.classList.add('hidden');
    confirmCard.classList.add('hidden');
    successCard.classList.add('hidden');

    // Show the target card
    cardToShow.classList.remove('hidden');

    // Re-trigger animation
    cardToShow.style.animation = 'none';
    cardToShow.offsetHeight; // Trigger reflow
    cardToShow.style.animation = 'cardAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
}

// ===== Send Notification to Backend =====
async function sendNotification() {
    try {
        const response = await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        console.log('💕 Notification result:', data);
    } catch (error) {
        console.log('Notification error (server may not be running):', error.message);
    }
}

// ===== Event Handlers =====

// YES Button - Go directly to success!
yesBtn.addEventListener('click', () => {
    showCard(successCard);
    createConfetti();
    sendNotification();
});

// NO Button - Show confirmation screen (can't really say no!)
noBtn.addEventListener('click', () => {
    showCard(confirmCard);
    confirmInput.value = '';
    confirmInput.focus();
});

// Back Button - Go back to main question
backBtn.addEventListener('click', () => {
    showCard(questionCard);
});

// Submit Button - Check if they typed "confirm"
submitBtn.addEventListener('click', handleConfirmation);

// Also handle Enter key in input
confirmInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleConfirmation();
    }
});

// Check for "confirm" as user types - trigger automatically!
let isAnimating = false;
const loveTextDiv = document.getElementById('loveText');

confirmInput.addEventListener('input', () => {
    const input = confirmInput.value.trim().toLowerCase();
    if (input === 'confirm' && !isAnimating) {
        isAnimating = true;
        triggerLoveMessage();
    }
});

let typeInterval = null;

function triggerLoveMessage() {
    // Stop any existing animation
    if (typeInterval) {
        clearInterval(typeInterval);
    }

    // Prepare UI: Hide input and button, show text div
    confirmInput.classList.add('hidden');
    submitBtn.classList.add('hidden');
    loveTextDiv.classList.remove('hidden');
    loveTextDiv.textContent = '';

    // Animate the text transformation
    const loveMessage = "I love you, of course I will be your valentine! 💕";

    let charIndex = 0;
    typeInterval = setInterval(() => {
        if (charIndex < loveMessage.length) {
            loveTextDiv.textContent += loveMessage[charIndex];
            charIndex++;
        } else {
            clearInterval(typeInterval);
            typeInterval = null;
            // Celebrate with confetti when the message is complete!
            createConfetti();
            // Reset logic (though mostly done here as input is hidden)
            isAnimating = false;
        }
    }, 50);
}

// Array of playful hint messages
const hintMessages = [
    'You just need to write "confirm" 💕',
    'It\'s spelled C-O-N-F-I-R-M 😘',
    'Come on, just type "confirm"! 💖',
    'Hint: starts with C, ends with M 😉',
    'I believe in you! Type "confirm" 💗',
    'Almost there! The word is "confirm" 💞',
    'Nice try! But the magic word is "confirm" ✨',
    'You know what to type... "confirm" 💕'
];
let hintIndex = 0;

function handleConfirmation() {
    // If animation is running, stop it and show hint with shake
    if (typeInterval) {
        clearInterval(typeInterval);
        typeInterval = null;
        isAnimating = false;
        confirmInput.classList.add('shake');
        confirmInput.value = '';
        confirmInput.placeholder = hintMessages[hintIndex];
        hintIndex = (hintIndex + 1) % hintMessages.length;
        setTimeout(() => {
            confirmInput.classList.remove('shake');
        }, 500);
        return;
    }

    const input = confirmInput.value.trim().toLowerCase();

    if (input === 'confirm') {
        triggerLoveMessage();
    } else {
        // Wrong input - shake the input and show rotating hints
        confirmInput.classList.add('shake');
        confirmInput.value = '';
        confirmInput.placeholder = hintMessages[hintIndex];

        // Cycle through hints
        hintIndex = (hintIndex + 1) % hintMessages.length;

        setTimeout(() => {
            confirmInput.classList.remove('shake');
        }, 500);
    }
}

// ===== Make No Button Run Away Smoothly Like a Magnet =====
let currentX = 0;
let currentY = 0;
let velocityX = 0;
let velocityY = 0;
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Add touch support for mobile
const updateTouchPosition = (e) => {
    if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }
};

document.addEventListener('touchmove', updateTouchPosition, { passive: true });
document.addEventListener('touchstart', updateTouchPosition, { passive: true });

function animateButton() {
    const rect = noBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const distX = mouseX - btnCenterX;
    const distY = mouseY - btnCenterY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // If mouse is within 150px of the button, apply repulsion force
    if (distance < 150 && distance > 0) {
        const force = (150 - distance) / 150; // Stronger when closer
        const angle = Math.atan2(distY, distX);

        // Apply repulsion force (like a magnet pushing away)
        velocityX -= Math.cos(angle) * force * 8;
        velocityY -= Math.sin(angle) * force * 8;
    }

    // Apply friction
    velocityX *= 0.92;
    velocityY *= 0.92;

    // Cap the speed
    const maxSpeed = 30;
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    if (speed > maxSpeed) {
        velocityX = (velocityX / speed) * maxSpeed;
        velocityY = (velocityY / speed) * maxSpeed;
    }

    // Update position
    currentX += velocityX;
    currentY += velocityY;

    // Get button's original position and viewport bounds
    const btnWidth = rect.width;
    const btnHeight = rect.height;
    const originalLeft = rect.left - currentX;
    const originalTop = rect.top - currentY;

    // Calculate boundaries (20px padding from edges)
    const padding = 20;
    const minX = padding - originalLeft;
    const maxX = window.innerWidth - originalLeft - btnWidth - padding;
    const minY = padding - originalTop;
    const maxY = window.innerHeight - originalTop - btnHeight - padding;

    // Bounce off boundaries
    if (currentX < minX) { currentX = minX; velocityX *= -0.5; }
    if (currentX > maxX) { currentX = maxX; velocityX *= -0.5; }
    if (currentY < minY) { currentY = minY; velocityY *= -0.5; }
    if (currentY > maxY) { currentY = maxY; velocityY *= -0.5; }

    noBtn.style.transform = `translate(${currentX}px, ${currentY}px)`;

    requestAnimationFrame(animateButton);
}

// Start the animation loop
animateButton();

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
});
