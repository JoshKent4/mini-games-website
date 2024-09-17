function saveSegmentData() {
    const segmentItems = Array.from(segmentList.children).map(item => item.textContent.slice(0, -1));
    localStorage.setItem('segmentList', JSON.stringify(segmentItems));
    //alert('Wheel data has been saved to your browser\'s local storage.');
}

function saveWinningData() {
    const winningItems = Array.from(winningList.children).map(item => item.textContent);
    localStorage.setItem('winningList', JSON.stringify(winningItems));
}

function loadWheelData() {
    const savedSegmentList = JSON.parse(localStorage.getItem('segmentList'));
    const savedWinningList = JSON.parse(localStorage.getItem('winningList'));
    repopulateSegmentList(savedSegmentList);
    repopulateWinningList(savedWinningList);
}

function repopulateSegmentList(savedSegmentList) {
    savedSegmentList.forEach(savedSegment => {
        addSavedSegment(savedSegment);
    });
}

function addSavedSegment(savedSegment) {
    if (savedSegment) {
        segments.push(savedSegment);
        updateSegmentList();
        drawWheel();
    }
}

function repopulateWinningList(savedWinningList) {
    if (savedWinningList) {
        winningList.innerHTML = '';
        savedWinningList.forEach(savedName => {
            addWinningName(savedName);

            if (savedName === 'No-one!') {
                addWinningListPlaceholder();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', loadWheelData);
