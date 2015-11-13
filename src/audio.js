myAudio = new Audio('assets/bu-an-ogres-knight.ogg');
myAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

//Keyboard listener for 'p' key//
window.addEventListener('keydown',function(e) {
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