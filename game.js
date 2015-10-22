//Canvas setup//
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var raf;

//Canvas dimensions//
canvas.width = 800;
canvas.height = 500;

//Keypress booleans//
var leftPressed;
var rightPressed;
var upPressed;
var upBigPressed;
var upSmallPressed;
var restartPressed;

//Jumping booleans//
var jumping = false;

//Acceleration/
var gravity;
var spawnGravity;
var horizAcc;

//Scroll Speed//
var playerScrollSpeed;
var platformScrollSpeed;
var spawnScrollSpeed;

//Timers and Counters//
var gameScalingTimerShort; //makes game harder with time
var gameScalingTargetShort; //5 seconds
var gameScalingTimerLong;
var gameScalingTargetLong; //10 seconds
var spawnCounter;
var spawnCounterTarget;
var platformCounter;
var platformCounterTarget;

//Player movement values//
//var upSpeed = -8;
var upBigSpeed;
var upSmallspeed;
var leftSpeed;
var rightSpeed;

//Scoring//
var points;

//Loss condition//
var loseKill = false; //Lose by touching ("killing") a falling object
var loseWall = false; //Lose by touching the leftside of the canvas

//Control FPS//
var fps,fpsInterval,startTime,now,then,elapsed;

//Initializes (or re-initializes) variables.//
function startValues() {
	platforms = [new Platform(canvas.width/3,canvas.height/2,80,10,'black'),new Platform(500,200,80,10,'black'),new Platform(700,canvas.height/2,80,10,'black')];
	
	//Keypress values//
	leftPressed = false;
	rightPressed = false;
	upPressed = false;
	upBigPressed = false;
	upSmallPressed = false;
	restartPressed = false;

	//Player//
	player.vx = 0;
	player.vy = 0;
	player.x = canvas.width/3;
	player.y = canvas.height/2;

	//Acceleration//
	gravity = 0.2;
	spawnGravity = 2;
	horizAcc = 0.2;

	//Scroll Speed//
	playerScrollSpeed = -1;
	platformScrollSpeed = -1;
	spawnScrollSpeed = -1;

	//Timers and Counters//
	gameScalingTimerShort = 0; //makes game harder with time
	gameScalingTargetShort = 300; //5 seconds
	gameScalingTimerLong = 0;
	gameScalingTargetLong = 600; //10 seconds
	spawnCounter = 0;
	spawnCounterTarget = 120;
	platformCounter = 0;
	platformCounterTarget = 70;

	//Player movement values//
	//upSpeed = -8;
	upBigSpeed = -8;
	upSmallspeed = -5;
	leftSpeed = -5;
	rightSpeed = 5;

	//Scoring//
	points = 0;
}

//Spawn definitions//
//ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight); //reference
function Spawn(x,y,vx,vy,width,height,color) {
	this.x = x; this.y = y; this.vx = 0; this.vy = 0; this.width = width; this.height = height; this.color = color;
	this.onGround = false;
	this.touched = false;
}

Spawn.prototype.draw = function(){
	var guyImage = new Image();
	if(this.onGround) {
		guyImage.src = 'assets/test_guy_1_splatter.png';
	}
	else {
		guyImage.src = 'assets/test_guy_1.png';
	}
	context.drawImage(guyImage, 0, 0, 25, 25, this.x, this.y, this.width, this.height);
}
Spawn.prototype.update = function(){
	//Horizontal movement//
	if(this.onGround) {
		this.x += spawnScrollSpeed
	}

	//Horizontal platform collision detection//
	for(var i=0; i<platforms.length; i++) {
		platform = platforms[i];
		if (checkCollision(this,platform)) {
			if(this.vx > 0) { //Leftside case
				this.x = platform.x-this.width;
			 	this.vx = 0;
			}
			else if (this.vx < 0) { //Rightside case
				this.x = platform.x+platform.width;
		 	 	this.vx = 0;
			}
		}
	}

	//Vertical movement//
	this.y += spawnGravity;
	//Vertical platform collision detection//
	for(var i=0; i<platforms.length; i++) {
		platform = platforms[i];
		//Since spawns only fall from the top, should only have to worry about one vertical case.
		if (checkCollision(this,platform)) {
			this.y = platform.y-this.height;
			this.vy = 0;
			this.onGround = true; //Might be a worthless (since platforms are already moving), but here just in case.
		}
	}

	//Bottomside canvas collision detection//
	if(this.y+this.height > canvas.height) {
		this.y = canvas.height-this.height;
		this.vy = 0;
		this.onGround = true;
		this.touched = true;
	}
}

//Platform definitions//
function Platform(x,y,width,height,color) {
	this.x = x; this.y = y; this.width = width; this.height = height; this.color = color;
	this.removeNow = false;
}
Platform.prototype.draw = function(){
	context.fillStyle = this.color;
 	context.fillRect(this.x,this.y,this.width,this.height);
}
Platform.prototype.update = function(){
	this.x += platformScrollSpeed;
}

var monsterImage = new Image();
function makeMonsterImage()
{
  monsterImage.onload = function(){
    context.drawImage(monsterImage, 0,0);
  }
  monsterImage.src = 'assets/test_monster_2.png';
}

//Check if obj1 is colliding with obj2//
function checkCollision(obj1, obj2) {
	//Using ~~ to truncate
	if(~~obj1.y < ~~obj2.y + ~~obj2.height && ~~obj1.y + ~~obj1.height > ~~obj2.y && ~~obj1.x + ~~obj1.width > ~~obj2.x && ~~obj1.x < ~~obj2.x + ~~obj2.width) {
		return true
	}

	return false
}

//player definition//
//ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight); //reference
var player = {
	x: canvas.width/3,
	y: canvas.height/2,
	vx: 0,
	vy: 0,
	width: 28,
	height: 30,
	color: 'red',
	onGround: false,

	draw: function() {
		var monsterImage = new Image();
		monsterImage.src = 'assets/test_monster_2.png';
		context.drawImage(monsterImage, 3, 2, 26, 28, this.x, this.y, this.width, this.height);
	},
	update: function() {
		//Horizontal movement//
		if(leftPressed) {
			if(player.vx > leftSpeed) {
				player.vx -= horizAcc;
			}
		}
		else if(rightPressed) {
			if(player.vx < rightSpeed) {
				player.vx += horizAcc;
			}
		}
		else {
			if (player.onGround) {
				//Check first to see if the number is close to be not quite
				//0.1.  This prevents endless sliding.
				if (Math.abs(player.vx - horizAcc) < horizAcc) {
					player.vx = 0;
				}
				else if (player.vx > 0) {
					player.vx -= horizAcc;
				}
				else if (player.vx < 0) {
					player.vx += horizAcc;
				}
			}
		}
		player.x += player.vx;

		//Horizontal platform collision detection//
		for(var i=0; i<platforms.length; i++) {
			platform = platforms[i];
			if(checkCollision(player,platform)) {
				if(player.vx > 0 && !leftPressed) { //Leftside case
					player.x = platform.x-player.width;
				 	player.vx = 0;
				}
				else if (player.vx < 0 && !rightPressed) { //Rightside case
					player.x = platform.x+platform.width;
			 	 	player.vx = 0;
				}
			}
		}

		//Vertical movement//
		if(upPressed && player.onGround && !jumping) {
			if(upSmallPressed) {
				player.vy = upSmallspeed;
			}
			if(upBigPressed) {
				player.vy = upBigSpeed;
			}
			player.onGround = false;
			jumping = true;
		}
		else {
			player.vy += gravity; //Gravity is always applied except on the frame of jumping
		}
		player.y += player.vy;

		//Vertical platform collision detection//
		for(var i=0; i<platforms.length; i++) {
			platform = platforms[i];
			if (checkCollision(player,platform)) {
				if(player.vy > 0) { //Topside case
					player.y = platform.y-player.height;
				 	player.vy = 0;
				 	player.onGround = true;
				 	jumping = false;
				}
				else if (player.vy < 0) { //Bottomside case
					player.y = platform.y+platform.height;
			 	 	player.vy = 0;
				}
			}
		}

		//Spawn collision detection//
		for(var i=0; i<spawns.length; i++) {
			spawn = spawns[i];
			if (checkCollision(player,spawn)) {
				spawn.touched = true;
				if(spawn.onGround) {
					points += 1;
				}
				else {
					loseKill = true;
				}
			}
		}

		//Rightside canvas collision detection//
		if(player.x+player.width > canvas.width) {
			player.x = canvas.width-player.width;
			player.vx = 0;
		}
		//Leftside canvas collision detection//
		//else if(player.x <= 0) {
		else if(player.x+playerScrollSpeed <= 0) {
			player.x = 0;
			player.vx = -1*playerScrollSpeed; //"Push" against the wall
		}
		//Default horizontal scrolling//
		else if(player.x+playerScrollSpeed > 0) {
			player.x += playerScrollSpeed;
		}

		//Bottomside canvas collision detection//
		if(player.y+player.height > canvas.height) {
			player.y = canvas.height-player.height;
			player.vy = 0;
			player.onGround = true;
			jumping = false;
			loseWall = true;
		}
		//Topside canvas collision detection//
		else if(player.y < 0) {
			player.y = 0;
			player.vy = 0;
		}
	}
};

//platforms array//
var platforms = [new Platform(canvas.width/3,canvas.height/2,80,10,'black'),new Platform(500,200,80,10,'black'),new Platform(700,canvas.height/2,80,10,'black')];var platforms = [new Platform(canvas.width/3,canvas.height/2,80,10,'black'),new Platform(500,200,80,10,'black'),new Platform(700,canvas.height/2,80,10,'black')];
//spawns array//
var spawns = [];

//Displays the score//
function displayScore() {
	context.fillStyle = "purple";
	context.font = "48px serif";
	context.textAlign = "center";
	context.fillText("final score: " + points, canvas.width/2, canvas.height/2);
}
//Checks to see if an object is off screen//
function canDespawn(object){
	if(object instanceof Spawn) {
		if(object.touched) {
			return true;
		}
	}
	if(object instanceof Platform) {
		if(object.removeNow) {
			return true;
		}
	}
	else if(object.x+object.width <= 0) { //Similar to a leftside canvas collision
		return true;
	}
	else {
		return false;
	}
}
//Spawns objects to the screen//
function spawnObjects() {
	//Spawn spawns (lol)//
	if(spawnCounter >= spawnCounterTarget) {
		randX = getRandomNumberSpawn(100,canvas.width-100);
		//randY = getRandomNumberPlatform(0,canvas.height/4); //Only spawn on top fourth of canvas screen
		spawns.push(new Spawn(randX,0,0,0,23,23,'yellow'));
		spawnCounter = 0;
	}
	else {
		spawnCounter += 1;
	}

	//Spawn platforms//
	if(platformCounter == platformCounterTarget) {
		randWidth = getRandomNumberPlatform(40,90);
		spawnHeight = 10;
		randX = getRandomNumberPlatform(canvas.width,canvas.width+(randWidth*2));
		//randY = getRandomNumberPlatform(canvas.height/2,canvas.height-(spawnHeight*3));
		randY = getRandomNumberPlatformYExcluded(canvas.height/2, canvas.height-(spawnHeight*3), randX, randWidth, spawnHeight);
		platforms.push(new Platform(randX,randY,randWidth,spawnHeight,'#000000'));
		platformCounter = 0;
	}
	else {
		platformCounter += 1;
	}
}
//Despawns (removes) objects that are offscreen//
function removeObjects(objectArray) {
	var toRemove = [];
	for(var i=0; i<objectArray.length; i++) {
		if(canDespawn(objectArray[i])) {
			//toRemove.push(i); //push the index to remove
			objectArray.splice(i,1);
			i--;
		}
	}
}
//Random number generators//
function getRandomNumberPlatform(min, max) {
	return (Math.random()*Math.random())*(max-min)+min;
}
//Gets a random Y-value for a to-be-spawned platform in a way that avoids collisions with existing platforms//
	//*Currently only works if all platform Y-values are guranteed to be inside the min-max range*//
function getRandomNumberPlatformYExcluded(min, max, randX, randWidth, spawnHeight) {
	//Find all platforms on the same vertical axis and add them to the excluded list
	excluded = [new Platform]; //'Dummy platform' variable that acts as storage for the min value but is still cooperative with the loops in this function.
	excluded[0].y = min;
	excluded[0].height = 0;
	for(var i=0;i<platforms.length;i++) {
		if(platforms[i].x+platforms[i].width > canvas.width) {	//Checks to see if it is (completely, including rightside) off-screen
			if((randX+randWidth > platforms[i].x && randX < platforms[i].x+platforms[i].width)) {	//Horizontal collision detection
				excluded.push(platforms[i]);
			}
		}
	}

	excluded.push(new Platform); //Dummy variable as above, but to hold the max value.
	excluded[excluded.length-1].y = max;
	excluded[excluded.length-1].height = 0;

	//Sorts by Y values.  The positions of min and max should be unchanged
	excluded.sort(comparePlatformYValues);

	//Generate random numbers for each Y-section (as defined by platforms in excluded) and checks to make sure that the platform can fit inside a given region.
	spawnPoints = [];
	for(var i=1;i<excluded.length;i++) { //rest of the cases
		minValue = excluded[i-1].y+excluded[i-1].height;
		maxValue = excluded[i].y;
		if(maxValue - minValue >= spawnHeight) { //only add the value as a potential spawn point if the spawn can fit in there.
											 	 //> or >=?
			spawnPoints.push(getRandomNumberPlatform(minValue,maxValue));
		}
	}

	//If no spawn points are possible, then return -spawnHeight (so as to move off the top of the screen).
	//Temporary fix?
	if(spawnPoints.length == 0) {
		console.log('no room for new platform!');
		return 0;
	}

	//Decides which section to pick
	var choice = spawnPoints[Math.floor(Math.random()*spawnPoints.length)];
	return choice
}
//For application to javascript Array.sort() method//
function comparePlatformYValues(p1, p2) {
	if (p1.y < p2.y) {
		return -1;
	}
	if (p1.y > p2.y) {
		return 1;
	}
	return 0;
}
function getRandomNumberSpawn(min, max) {
	return Math.random()*(max-min)+min;
}

//Main loop functions//
function draw() {
	context.clearRect(0,0,canvas.width,canvas.height); //Clears the screen every frame

	if(!loseKill && !loseWall) {
		//Draw background//
		var backgroundImage = new Image();
		backgroundImage.src = 'assets/background.png';
		context.drawImage(backgroundImage, 0, 0);
		//Draw army//
		var armyImage = new Image();
		armyImage.src = 'assets/army.png';
		context.drawImage(armyImage, 0, canvas.height-100);
		//Display instructions//
		context.fillStyle = "purple";
		context.font = "48px serif";
		context.textAlign = "center";
		context.fillText("u r no monster", canvas.width/2, 200);
		context.fillText("prove it", canvas.width/2, 250);
		context.fillText("only kill people when there dead", canvas.width/2, 300);
		//Controls//
		context.font = "32px serif";
		context.textAlign = "start";
		context.fillText("z: big jump", canvas.width-250, 50);
		context.fillText("x: little jump", canvas.width-250, 100);
		//Bottom Message//
		context.font = "32px serif";
		context.textAlign = "center";
		context.fillText("dont let the army down here get u", canvas.width/2, 400);
	}

	//Display text//
	context.fillStyle = "purple";
	context.font = "48px serif";
	context.textAlign = "start";
	if(loseKill) {
		context.fillText("u r the monster", 10, 50);
		displayScore();
		context.fillText("press r to restart", canvas.width/2, canvas.height-100);
	}
	else if(loseWall) {
		context.fillText("the army got u", 10, 50);
		displayScore();
		context.fillText("press r to restart", canvas.width/2, canvas.height-100);
	}
	else {
		context.fillText("humanity: "+points, 10, 50);
		//Draws objects//
		for(var i=0; i<spawns.length; i++) {
			spawns[i].draw();
		}
		for(var i=0; i<platforms.length; i++) {
			platforms[i].draw();
		}
	}

	player.draw(); //Want to draw player above everything else.
}
function update() {
	//Updates objects//
	if(gameScalingTimerShort == gameScalingTargetShort) {
		if(spawnCounterTarget > 10) {
			spawnCounterTarget -= 10; //faster spawns
		}
		spawnGravity += 0.5; //faster falling spawns
		gameScalingTimerShort = 0;
	}
	else {
		gameScalingTimerShort += 1;
	}
	if(gameScalingTimerLong == gameScalingTargetLong) {
		platformScrollSpeed -= 0.3;
		spawnScrollSpeed -= 0.3;
		playerScrollSpeed -= 0.3;
		rightSpeed += 0.3;
		gameScalingTimerLong = 0;
	}
	else {
		gameScalingTimerLong += 1;
	}

	player.update();
	if(!loseKill && !loseWall) {
		removeObjects(spawns);
		for(var i=0; i<spawns.length; i++) {
			spawns[i].update();
		}
		removeObjects(platforms);
		for(var i=0; i<platforms.length; i++) {
			platforms[i].update();
		}
	}
	else {
		//Empty arrays
		platforms = [];
		spawns = [];
		//Remove scrolling
		playerScrollSpeed = 0;
		platformScrollSpeed = 0;
		spawnScrollSpeed = 0;
		//Teleport player
		// player.x = canvas.width/2;
		// player.y = canvas.height/2;
		if(restartPressed) {
			loseKill = false;
			loseWall = false;
			startValues();
		}
	}
}
function mainLoop() {
	raf = window.requestAnimationFrame(mainLoop);
	now = Date.now();
	elapsed = now - then;
	if(elapsed > fpsInterval) {
		then = now - (elapsed % fpsInterval);
		spawnObjects();
		update();
		draw();
	}
}

//Keyboard listeners//
window.addEventListener('keydown',function(e) {
	switch (e.which) {
		case 37:
			leftPressed = true;
			break;
		case 88:
			upSmallPressed = true;
			upPressed = true;
			jumping = true;
			break
		case 90:
			upBigPressed = true;
			upPressed = true;
			jumping = true;
			break;
		case 39:
			rightPressed = true;
			break;
		case 82:
			restartPressed = true;
			break;
	}
});
window.addEventListener('keyup',function(e){
	switch (e.which) {
		case 37:
			leftPressed = false;
			break;
		case 88:
			upPressed = false;
			upSmallPressed = false;
			break;
		case 90:
			upPressed = false;
			upBigPressed = false;
			break;
		case 39:
			rightPressed = false;
			break;
		case 82:
			restartPressed = false;
			break;
	}
});
//Prevent scrolling on the page with arrow keys and spacebar//
window.addEventListener('keydown',function(e) {
	switch (e.which) {
		case 32: case 37: case 38: case 39: case 40:
			e.preventDefault();
			break;
		default:
			break;
	}
});

function init(fps) {
	fpsInterval = 100/fps;
	then = Date.now();
	startTime = then;
	startValues();
	mainLoop();
}
init(60);