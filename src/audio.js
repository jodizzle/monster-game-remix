myAudioList = ['assets/bu-an-ogres-knight-fixed.ogg',
			   'assets/bu-pear-of-the-report-fixed.ogg',
			   'assets/bu-a-garden-and-a-knight-fixed.ogg',
			   'assets/bu-crazed-and-poor-fixed.ogg',
			   'assets/bu-a-bananas-reports-fixed.ogg'];
//Choose a random song
audioIndex = Math.floor(Math.random()*myAudioList.length);
myAudio = new Audio(myAudioList[audioIndex]);
myAudio.volume = 0.3;

function changeSong() {
	audioIndex += 1;
	if(audioIndex >= myAudioList.length) {
		audioIndex = 0;
	}
	myAudio.pause();
	myAudio.src = myAudioList[audioIndex];
	myAudio.play();
}

myAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

//Keyboard listeners//
window.addEventListener('keydown', function(e) {
	switch (e.which) {
		case 80: //'p'
			if(!myAudio.paused) {
				myAudio.pause();
			}
			else {
				myAudio.play();
			}
			break;
		case 67: //'c'
			changeSong();
			break;
	}
});

myAudio.play();