myAudio = new Audio('assets/bu-an-ogres-knight.ogg');
myAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
myAudio.play();