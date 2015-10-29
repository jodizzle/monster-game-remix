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