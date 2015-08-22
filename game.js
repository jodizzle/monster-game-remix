console.log('loaded')

var canvas = document.getElementById('test');
var context = canvas.getContext('2d');
var raf;

var leftPressed = false
var rightPressed = false

var gravity = 0.2 //acceleration 
var onGround = false

var square = {
	x: 50,
	y: 50,
	width: 50,
	height: 50,
	vx: 0,
	vy: 0,
	color: 'red',
	draw: function() {
		context.fillStyle = this.color;
		context.fillRect(this.x,this.y,this.width,this.height);
	}
};

function draw() {
	//console.log('drawing')
	context.clearRect(0,0,canvas.width,canvas.height);
	square.draw();
	if((square.x+square.width) + square.vx > canvas.width || (square.x-square.width) + square.vx < 0) {
		square.vx = 0;
	}
	square.x += square.vx;
	
	if(!onGround) {
		square.vy += gravity;
	}
	if((square.y+square.height) + square.vy > canvas.height || (square.y-square.height) + square.vy + gravity < 0) {
		square.vy = 0;
		onGround = true;
	}
	// else {
	// 	onGround = false;
	// }
	square.y += square.vy;
	raf = window.requestAnimationFrame(draw);
}

window.addEventListener('keydown',function(e) {
	switch (e.which) {
		case 37:
			square.vx = -5;
			leftPressed = true;
			console.log('left');
			break;
		case 38:
			if(onGround) {
				square.vy = -10;
				onGround = false;
			}
			console.log('up');
			break;
		case 39:
			square.vx = 5;
			rightPressed = true;
			console.log('right');
			break;
		// case 40:
		// 	square.vy = 5;
		// 	console.log('down');
		// 	break;
	}
});

window.addEventListener('keyup',function(e){
	switch (e.which) {
		case 37:
			if(rightPressed) {
				square.vx = 5;
			}
			else {
				square.vx = 0;
			}
			//horizOff = true;
			leftPressed = false;
			console.log('left');
			break;
		// case 38:
		// 	square.vy = 0;
		// 	//vertOff = true;
		// 	console.log('up');
		// 	break;
		case 39:
			if(leftPressed) {
				square.vx = -5;
			}
			else {
				square.vx = 0;
			}
			rightPressed = false;
			//horizOff = true;
			console.log('right');
			break;
		// case 40:
		// 	square.vy = 0;
		// 	//vertOff = true;
		// 	console.log('down');
		// 	break;
	}
});

function init() {
	draw();
}

init();