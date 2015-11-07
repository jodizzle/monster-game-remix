//Check if obj1 is colliding with obj2//
function checkCollision(obj1, obj2) {
	//Using ~~ to truncate - checking collisions with integers is (theoretically) better
	if(~~obj1.y < ~~obj2.y + ~~obj2.height && ~~obj1.y + ~~obj1.height > ~~obj2.y && ~~obj1.x + ~~obj1.width > ~~obj2.x && ~~obj1.x < ~~obj2.x + ~~obj2.width) {
		return true;
	}

	return false;
}
//Displays the score//
function displayScore() {
	context.fillStyle = "purple";
	context.font = "48px serif";
	context.textAlign = "center";
	context.fillText("final score: " + points, canvas.width/2, canvas.width/4);
	if(spawnDead == 0) {
		percentageMessage = "percentage: :(";
	}
	else {
		percentageMessage = "percentage: " + points + "/" + spawnDead + " = " + ((points/spawnDead)*100).toFixed(2) + "%";
	}
	context.fillText(percentageMessage, canvas.width/2, canvas.height/2);
	context.fillText("time survived: " + (gameTimer/60.0).toFixed(2) + " seconds", canvas.width/2, canvas.height-200);
}
//Checks to see if an object is off screen//
function canDespawn(object) {
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
	//Use '&& gameTimer != 0' to prevent a spawn on the first frame
	if(gameTimer % spawnCounterTarget == 0 && gameTimer != 0) {
		randX = getRandomNumberSpawn(100,canvas.width-100);
		randY = getRandomNumberSpawn(-100, 0);
		//Generate a possible vx for the spawn based on the randX.  The goal is to
		//choose a vx such that the spawn will fly towards the center (and not just
		//offscreen).
		if(randX < canvas.width/2) {
			vxRange = getRandomNumberSpawn(0,2);
		}
		else {
			vxRange = getRandomNumberSpawn(-2,0);
		}
		vxChoices = [0, vxRange]; //Heavily weight the possibility of getting '0'
		randVx = vxChoices[Math.floor(Math.random()*vxChoices.length)];
		spawns.push(new Spawn(randX,randY,randVx,0,23,23,'yellow'));
	}

	//Spawn platforms//
	if(gameTimer % platformCounterTarget == 0) {
		randWidth = getRandomNumberPlatform(40,90);
		spawnHeight = 10;
		randX = getRandomNumberPlatform(canvas.width,canvas.width+(randWidth*2));
		randY = getRandomNumberPlatformYExcluded((canvas.height/2)+50, canvas.height-(spawnHeight*10)+50, randX, randWidth, spawnHeight);
		platforms.push(new Platform(randX,randY,randWidth,spawnHeight,'#000000'));
	}
}
//Despawns (removes) objects that are offscreen//
function removeObjects(objectArray) {
	for(var i=0; i<objectArray.length; i++) {
		if(canDespawn(objectArray[i])) {
			objectArray.splice(i,1);
			i--;
		}
	}
}