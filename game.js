console.log('loaded')

var canvas = document.getElementById('test');
var context = canvas.getContext('2d');
var raf;

var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var inAir = false;

var gravity = 0.2
var onGround = false
var jumping = false

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

var platform = {
	x: 250,
	y: 400,
	width: 80,
	height: 10,
	color: 'green',
	draw: function() {
		context.fillStyle = this.color;
		context.fillRect(this.x,this.y,this.width,this.height);
	}
};

function draw() {
	context.clearRect(0,0,canvas.width,canvas.height);
	square.draw();
	platform.draw();
}

function update() {
	if(leftPressed) {
		square.vx = -5;
		console.log('left has been pressed')
	}

	else if(rightPressed) {
		square.vx = 5;
	}
	else {
		square.vx = 0;
	}
	square.x += square.vx;

	if(square.y < platform.y+platform.height && square.y+square.height > platform.y && square.x+square.width > platform.x && square.x < platform.x+platform.width) {
		if(square.vx > 0) {
			square.x = platform.x-square.width;
		 	square.vx = 0;
		}
		else if (square.vx < 0) {
			square.x = platform.x+platform.width;
	 	 	square.vx = 0;
		}
	}

	if(upPressed && onGround && !jumping) {
		square.vy = -10;
		onGround = false;
		jumping = true;
	}
	else {
		square.vy += gravity;
	}

	square.y += square.vy;

	if(square.y < platform.y+platform.height && square.y+square.height > platform.y && square.x+square.width > platform.x && square.x < platform.x+platform.width) {
		if(square.vy > 0) {
			square.y = platform.y-square.height;
		 	square.vy = 0;
		 	onGround = true;
		 	jumping = false;
		}
		else if (square.vy < 0) {
			square.y = platform.y+platform.height;
	 	 	square.vy = 0;
		}
	}

	if(square.x+square.width > canvas.width) {
		square.x = canvas.width-square.width;
		square.vx = 0;
	}
	else if(square.x < 0) {
		square.x = 0;
		square.vx = 0;
	}

	if(square.y+square.height > canvas.height) {
		square.y = canvas.height-square.height;
		square.vy = 0;
		onGround = true;
		jumping = false;
	}
	else if(square.y < 0) {
		square.y = 0;
		square.vy = 0;
	}
}

window.addEventListener('keydown',function(e) {
	switch (e.which) {
		case 37:
			leftPressed = true;
			console.log('left');
			break;
		case 38:
			upPressed = true;
			jumping = true;
			console.log('up');
			break;
		case 39:
			//square.vx = 5;
			rightPressed = true;
			console.log('right');
			break;
		// case 40:
		// 	console.log('down');
		// 	break;
	}
});

window.addEventListener('keyup',function(e){
	switch (e.which) {
		case 37:
			leftPressed = false;
			console.log('left');
			break;
		case 38:
			upPressed = false;
			console.log('up');
			break;
		case 39:
			rightPressed = false;
			console.log('right');
			break;
		// case 40:
		// 	console.log('down');
		// 	break;
	}
});

function mainLoop() {
	update();
	draw();
	raf = window.requestAnimationFrame(mainLoop);
}

function init() {
	mainLoop()
}

init();