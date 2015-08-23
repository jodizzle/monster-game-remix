

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

//Global values//
var gravity = 0.2
var spawnGravity = 2
var scrollSpeed = 0
var spawnCounter = 0
var spawnCounterTarget = 120

//Player movement values//
var upSpeed = -7
var leftSpeed = -5
var rightSpeed = 5

//Generalized character definition//
function Character(x,y,vx,vy,width,height,color) {
	this.x = x; this.y = y; this.vx = 0; this.vy = 0; this.width = width; this.height = height; this.color = color;
}
Character.prototype.draw = function(){
	context.fillStyle = this.color;
	context.fillRect(this.x,this.y,this.width,this.height);
}
var square = new Character(50,50,0,0,50,50,'red');

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
var spawns = []

//Main loop functions//
function spawn() {
	if(spawnCounter == spawnCounterTarget) {
		randX = getRandomNumber(0,canvas.width);
		randY = getRandomNumber(0,canvas.height/4); //Only spawn on top fourth of canvas screen
		spawns.push(new Character(randX,randY,0,0,20,20,'yellow'));
		spawnCounter = 0;
	}
	else {
		spawnCounter += 1;
	}
}
function draw() {
	context.clearRect(0,0,canvas.width,canvas.height); //Clears the screen every frame

	//Draws objects//
	square.draw();
	for(var spawn of spawns) {
		spawn.draw();
	}
	for(var platform of platforms) {
		platform.draw();
	}
}
function update() {
	//Default horizontal scrolling//
	square.x += scrollSpeed;
	// for(var spawn of spawns) {
	// 	spawn.x += scrollSpeed;
	// }
	for(var platform of platforms) {
		platform.x += scrollSpeed;
	}

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
	//Player
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
	//Spawns
	for(var platform of platforms) {
		for(var spawn of spawns) {
			if(spawn.y < platform.y+platform.height && spawn.y+spawn.height > platform.y && spawn.x+spawn.width > platform.x && spawn.x < platform.x+platform.width) {
				if(spawn.vx > 0) { //Leftside case
					spawn.x = platform.x-spawn.width;
				 	spawn.vx = 0;
				}
				else if (spawn.vx < 0) { //Rightside case
					spawn.x = platform.x+platform.width;
			 	 	spawn.vx = 0;
				}
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
	for(var spawn of spawns) {
		spawn.y += spawnGravity;
	}
	square.y += square.vy;

	//Vertical platform collision detection//
	//Player
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
	//Spawns
	for(var platform of platforms) {
		for(var spawn of spawns) {
			//Since spawns only fall from the top, should only have to worry about one vertical case.
			if(spawn.y < platform.y+platform.height && spawn.y+spawn.height > platform.y && spawn.x+spawn.width > platform.x && spawn.x < platform.x+platform.width) {
				spawn.y = platform.y-spawn.height;
				spawn.vy = 0;
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
	//Spawn
	for(var spawn of spawns) {
		if(spawn.y+spawn.height > canvas.height) {
			spawn.y = canvas.height-spawn.height;
			spawn.vy = 0;
		}
	}
	//Player
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
	spawn();
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

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function init() {
	mainLoop()
}
init();