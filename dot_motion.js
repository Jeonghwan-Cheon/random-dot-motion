const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const numDotsInput = document.getElementById('numDots');
const speedInput = document.getElementById('speed');
const coherenceInput = document.getElementById('coherence');
const directionValue = document.getElementById('directionValue');

let dots = [];
let direction = 90;
let animationFrameId;

const radius = Math.min(canvas.width, canvas.height) / 2;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

numDotsInput.oninput = () => updateParameterValues();
speedInput.oninput = () => updateParameterValues();
coherenceInput.oninput = () => updateParameterValues();

document.getElementById('directionUp').onclick = () => setDirection(270);
document.getElementById('directionDown').onclick = () => setDirection(90);
document.getElementById('directionTest').onclick = () => testSequence();
document.getElementById('directionShow').onclick = () => showAnswer();

function updateParameterValues() {
    numDotsValue.textContent = numDotsInput.value < 10 ? '00' + numDotsInput.value : numDotsInput.value < 100 ? '0' + numDotsInput.value : numDotsInput.value;
    speedValue.textContent = speedInput.value < 10 ? '00' + speedInput.value : speedInput.value < 100 ? '0' + speedInput.value : speedInput.value;
    coherenceValue.textContent = coherenceInput.value < 10 ? '00' + coherenceInput.value : coherenceInput.value < 100 ? '0' + coherenceInput.value : coherenceInput.value;
    initDots();
}

function setDirection(deg) {
    direction = deg;
    initDots();
}

function initDots() {
    dots = [];
    for (let i = 0; i < numDotsInput.value; i++) {
        createDot();
    }
    if (!animationFrameId) {
        animate();
    }
}

function createDot() {
    let angle = Math.random() * Math.PI * 2;
    let distance = Math.sqrt(Math.random()) * radius;
    dots.push({
        x: centerX + distance * Math.cos(angle),
        y: centerY + distance * Math.sin(angle),
        direction: Math.random() * Math.PI * 2
    });
}

function moveDot(dot) {
    const coherence = coherenceInput.value / 100;
    const speed = speedInput.value / 50;

    dot.direction = Math.random() < coherence ? direction * Math.PI / 180 : Math.random() * Math.PI * 2;

    dot.x += speed * Math.cos(dot.direction);
    dot.y += speed * Math.sin(dot.direction);

    let distanceFromCenter = Math.sqrt(Math.pow(dot.x - centerX, 2) + Math.pow(dot.y - centerY, 2));

    if (distanceFromCenter > radius) {
        let angleFromCenter = Math.atan2(dot.y - centerY, dot.x - centerX);
        let oppositeAngle = angleFromCenter + Math.PI;
        dot.x = centerX + radius * Math.cos(oppositeAngle);
        dot.y = centerY + radius * Math.sin(oppositeAngle);
    }
}

function drawDot(dot) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
    ctx.fill();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();
    dots.forEach(moveDot);
    dots.forEach(drawDot);
    animationFrameId = requestAnimationFrame(animate);
}

function testSequence() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fixation();

    setTimeout(() => {
        const randomizedDirection = Math.random() < 0.5 ? 90 : 270;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setDirection(randomizedDirection);

        setTimeout(() => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 2000); // stimulus duration

    }, 3000); // fixation duration
}

function fixation() {
    ctx.fillStyle = 'white';
    const crossSize = 40;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.fillRect(centerX - crossSize / 10, centerY - crossSize / 2, crossSize / 5, crossSize);
    ctx.fillRect(centerX - crossSize / 2, centerY - crossSize / 10, crossSize, crossSize / 5);
}

function showAnswer() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const arrowLength = 100;
    const headWidth = 20;
    const headLength = 30;

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    let endX, endY;

    if (direction === 90) {
        endX = centerX;
        endY = centerY + arrowLength / 2;
        drawArrow(ctx, centerX, centerY - arrowLength / 2, endX, endY, headWidth, headLength);
    } else if (direction === 270) {
        endX = centerX;
        endY = centerY - arrowLength / 2;
        drawArrow(ctx, centerX, centerY + arrowLength / 2, endX, endY, headWidth, headLength);
    }
}

function drawArrow(ctx, fromX, fromY, toX, toY, headWidth, headLength) {
    var angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.fill();
}

initDots();

document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    } else {
        initDots();
    }
});
