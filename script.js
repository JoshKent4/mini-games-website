const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const segmentInput = document.getElementById('segment-input');
const segmentList = document.getElementById('segment-list');
const winningList = document.getElementById('winning-list');
let segments = [];
const colours = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5'];
let segmentAngle = 0;
let currentAngle = 0;
let spinTimeout = null;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (segments.length === 0) return;
    segmentAngle = 2 * Math.PI / segments.length;
    for (let i = 0; i < segments.length; i++) {
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, currentAngle, currentAngle + segmentAngle);
        ctx.fillStyle = colours[i % colours.length];
        ctx.fill();
        ctx.stroke();
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(currentAngle + segmentAngle / 2);
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let fontSize = 24;
        ctx.font = `bold ${fontSize}px Arial`;
        let textWidth = ctx.measureText(segments[i]).width;
        while (textWidth > 150) {
            fontSize--;
            ctx.font = `bold ${fontSize}px Arial`;
            textWidth = ctx.measureText(segments[i]).width;
        }
        ctx.fillText(segments[i], 100, 0);
        ctx.restore();
        currentAngle += segmentAngle;
    }
    ctx.beginPath();
    ctx.moveTo(250, 0);
    ctx.lineTo(240, 20);
    ctx.lineTo(260, 20);
    ctx.closePath();
    ctx.fillStyle = '#000';
    ctx.fill();
}

function displaySelectedSegment(segment) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Semi-transparent
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(segment, canvas.width / 2, canvas.height / 2);
    ctx.restore();
}

function clearDisplay() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWheel();
}

function spinWheel() {
    if (segments.length === 0) return;
    let spinAngle = Math.random() * 10 + 10;
    // Random time between 4000ms (4s) and 7000ms (7s)
    let spinTime = Math.random() * 3000 + 4000;
    let currentTime = 0;
    let deceleration = 0.995; // Gradual decrease in speed
    function animateSpin() {
        currentTime += 16; // Approximate time per frame (16ms for 60fps)
        let progress = currentTime / spinTime;
        let easing = Math.pow(1 - progress, 3); // Cubic easing out

        currentAngle += spinAngle * easing;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            calculateWinningSegment();
        }
    }
    animateSpin();
}

function calculateWinningSegment() {
    const trianglePoint = { x: 250, y: 0 }; // Top center of the circle
    let minDistance = Infinity;
    let winningSegment = 0;
    for (let i = 0; i < segments.length; i++) {
        let segmentCenterAngle = currentAngle + (i + 0.5) * segmentAngle;
        let segmentCenter = {
            x: 250 + 250 * Math.cos(segmentCenterAngle),
            y: 250 + 250 * Math.sin(segmentCenterAngle)
        };
        let distance = Math.sqrt(
            Math.pow(segmentCenter.x - trianglePoint.x, 2) +
            Math.pow(segmentCenter.y - trianglePoint.y, 2)
        );
        if (distance < minDistance) {
            minDistance = distance;
            winningSegment = i;
        }
    }
    const winningName = segments[winningSegment];
    addWinningName(winningName);
    removeSegment(winningSegment);
    displaySelectedSegment(winningName);
}

function addWinningName(name) {
    const li = document.createElement('li');
    li.textContent = name;
    winningList.appendChild(li);
}

function addSegment() {
    const newSegment = segmentInput.value.trim();
    if (newSegment) {
        segments.push(newSegment);
        updateSegmentList();
        drawWheel();
        segmentInput.value = '';
    }
}

function removeSegment(index) {
    segments.splice(index, 1);
    updateSegmentList();
    drawWheel();
}

function updateSegmentList() {
    segmentList.innerHTML = '';
    segments.forEach((segment, index) => {
        const li = document.createElement('li');
        li.textContent = segment;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'X';
        removeBtn.onclick = () => removeSegment(index);
        li.appendChild(removeBtn);
        segmentList.appendChild(li);
    });
}

function resetWheel() {
    segments = [];
    updateSegmentList();
    winningList.innerHTML = '';
    drawWheel();
}

spinBtn.addEventListener('click', spinWheel);
resetBtn.addEventListener('click', resetWheel);

segmentInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addSegment();
    }
});

drawWheel();
