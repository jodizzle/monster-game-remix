audioList = ['assets/bu-an-ogres-knight-fixed.ogg',
			   'assets/bu-pear-of-the-report-fixed.ogg',
			   'assets/bu-a-garden-and-a-knight-fixed.ogg',
			   'assets/bu-crazed-and-poor-fixed.ogg',
			   'assets/bu-a-bananas-reports-fixed.ogg'];
//Choose a random song
audioIndex = Math.floor(Math.random()*audioList.length);
audio = new Audio(audioList[audioIndex]);
audio.volume = 0.3;

function toggleSong() {
	if(!audio.paused) {
		audio.pause();
		audioMessage = "play";
	}
	else {
		audio.play();
		audioMessage = "pause";
	}
}

function changeSong() {
	audioIndex += 1;
	if(audioIndex >= audioList.length) {
		audioIndex = 0;
	}
	audio.src = audioList[audioIndex];
	// Event listener below should takes care of playing when audio is ready
}

audio.addEventListener('canplaythrough', toggleSong, false);

audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

//Keyboard listeners//
window.addEventListener('keydown', function(e) {
	switch (e.which) {
		case 80: //'p'
			toggleSong();
			break;
		case 67: //'c'
			changeSong();
			break;
	}
});