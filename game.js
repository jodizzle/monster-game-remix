//Canvas setup//
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var raf;

//Canvas dimensions//
canvas.width = 500;
canvas.height = 500;

//Movement booleans//
var leftPressed = false;
var rightPressed = false;
var upPressed = false;

//Jumping booleans//
var onGround = false
var jumping = false

//Vertical acceleration//
var gravity = 0.2

//Player movement values//
var upSpeed = -7
var leftSpeed = -5
var rightSpeed = 5

//Player character definition//
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

//Generalized platform definition -- OOP-esque//
function Platform(x,y,width,height,color) {
	this.x = x; this.y = y; this.width = width; this.height = height; this.color = color;
}
Platform.prototype.draw = function(){
	context.fillStyle = this.color;
 	context.fillRect(this.x,this.y,this.width,this.height);
};
//Platforms array//
var platforms = [new Platform(250,400,80,10,'green'),new Platform(200,200,80,10,'blue'),new Platform(150,300,80,10,'orange')]

//Main loop functions//
function draw() {
	context.clearRect(0,0,canvas.width,canvas.height); //Clears the screen every frame

	//Draws objects//
	square.draw();
	for(var platform of platforms) {
		platform.draw();
	}
}
function update() {
	//Horizontal movement//
	if(leftPressed) {
		square.vx = leftSpeed;
	}
	else if(rightPressed) {
		square.vx = rightSpeed;
	}
	else {
		square.vx = 0;
	}
	square.x += square.vx;

	//Horizontal platform collision detection//
	for(var platform of platforms) {
		if(square.y < platform.y+platform.height && square.y+square.height > platform.y && square.x+square.width > platform.x && square.x < platform.x+platform.width) {
			if(square.vx > 0) { //Leftside case
				square.x = platform.x-square.width;
			 	square.vx = 0;
			}
			else if (square.vx < 0) { //Rightside case
				square.x = platform.x+platform.width;
		 	 	square.vx = 0;
			}
		}
	}

	//Vertical movement//
	if(upPressed && onGround && !jumping) {
		square.vy = upSpeed;
		onGround = false;
		jumping = true;
	}
	else {
		square.vy += gravity; //Gravity is always applied except on the frame of jumping
	}
	square.y += square.vy;

	//Vertical platform collision detection//
	for(var platform of platforms) {
		if(square.y < platform.y+platform.height && square.y+square.height > platform.y && square.x+square.width > platform.x && square.x < platform.x+platform.width) {
			if(square.vy > 0) { //Topside case
				square.y = platform.y-square.height;
			 	square.vy = 0;
			 	onGround = true;
			 	jumping = false;
			}
			else if (square.vy < 0) { //Bottomside case
				square.y = platform.y+platform.height;
		 	 	square.vy = 0;
			}
		}
	}

	//Rightside canvas collision detection//
	if(square.x+square.width > canvas.width) {
		square.x = canvas.width-square.width;
		square.vx = 0;
	}
	//Leftside canvas collision detection//
	else if(square.x < 0) {
		square.x = 0;
		square.vx = 0;
	}

	//Bottomside canvas collision detection//
	if(square.y+square.height > canvas.height) {
		square.y = canvas.height-square.height;
		square.vy = 0;
		onGround = true;
		jumping = false;
	}
	//Topside canvas collision detection//
	else if(square.y < 0) {
		square.y = 0;
		square.vy = 0;
	}
}
function mainLoop() {
	update();
	draw();
	raf = window.requestAnimationFrame(mainLoop);
}

//Keyboard listeners//
window.addEventListener('keydown',function(e) {
	switch (e.which) {
		case 37:
			leftPressed = true;
			break;
		case 38:
			upPressed = true;
			jumping = true;
			break;
		case 39:
			rightPressed = true;
			break;
	}
});
window.addEventListener('keyup',function(e){
	switch (e.which) {
		case 37:
			leftPressed = false;
			break;
		case 38:
			upPressed = false;
			break;
		case 39:
			rightPressed = false;
			break;
	}
});


function init() {
	mainLoop()
}
init();