const saveBtn = document.getElementById('save-btn');

function saveWheelData() {
    const segmentItems = Array.from(segmentList.children).map(item => item.textContent);
    const winningItems = Array.from(winningList.children).map(item => item.textContent);

    localStorage.setItem('segmentList', JSON.stringify(segmentItems));
    localStorage.setItem('winningList', JSON.stringify(winningItems));

    alert('Wheel data has been saved to your browser\'s local storage.');
}

function loadWheelData() {
    const savedSegmentList = JSON.parse(localStorage.getItem('segmentList'));
    const savedWinningList = JSON.parse(localStorage.getItem('winningList'));

    if (savedSegmentList) {
        segmentList.innerHTML = '';
        savedSegmentList.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            segmentList.appendChild(li);
        });
    }

    if (savedWinningList) {
        winningList.innerHTML = '';
        savedWinningList.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            winningList.appendChild(li);
        });
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', loadWheelData);
saveBtn.addEventListener('click', saveWheelData);
