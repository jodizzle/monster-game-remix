myAudioList = ['assets/bu-an-ogres-knight-fixed.ogg',
			   'assets/bu-pear-of-the-report-fixed.ogg',
			   'assets/bu-a-garden-and-a-knight-fixed.ogg',
			   'assets/bu-crazed-and-poor-fixed.ogg',
			   'assets/bu-a-bananas-reports-fixed.ogg'];
//Choose a random song
myAudio = new Audio(myAudioList[Math.floor(Math.random()*myAudioList.length)]);
myAudio.volume = 0.3;
myAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

//Keyboard listener for 'p' key//
window.addEventListener('keydown', function(e) {
	switch (e.which) {
		case 80:
			if(!myAudio.paused) {
				myAudio.pause();
			}
			else {
				myAudio.play();
			}
			break;
	}
});

myAudio.play();