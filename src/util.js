//Return random float between min and max//
function getRandomNumber(min, max) {
	return Math.random()*(max-min)+min;
}

//Check if obj1 is colliding with obj2//
function checkCollision(obj1, obj2) {
	//Using ~~ to truncate - checking collisions with integers is (theoretically) better
	if(~~obj1.y < ~~obj2.y + ~~obj2.height && ~~obj1.y + ~~obj1.height > ~~obj2.y && ~~obj1.x + ~~obj1.width > ~~obj2.x && ~~obj1.x < ~~obj2.x + ~~obj2.width) {
		return true;
	}

	return false;
}

//Calculate score metric//
function calculateScore() {
	humanityWeight = 4.20;
	time = gameTimer/60.0;
	return Math.round(humanity*humanityWeight + time);
}

//Displays the score//
function displayScore() {
	context.fillStyle = "purple";
	context.font = "48px serif";
	context.textAlign = "center";
	context.fillText("high score: " + highScore, canvas.width/2, 120);
	context.fillText("score: " + score, canvas.width/2, 170);
	context.fillText("final humanity: " + humanity, canvas.width/2, 250);
	if(spawnDead === 0) {
		percentageMessage = "percentage: :(";
	}
	else {
		percentageMessage = "percentage: " + humanity + "/" + spawnDead + " = " + ((humanity/spawnDead)*100).toFixed(2) + "%";
	}
	context.fillText(percentageMessage, canvas.width/2, 300);
	context.fillText("time survived: " + (gameTimer/60.0).toFixed(2) + " seconds", canvas.width/2, 350);
}

//Checks if an object can be removed from the game//
function canDespawn(object) {
	//Checks if an object is off-screen
	if(object.x+object.width <= 0) {
		return true;
	}
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
	if(object instanceof Jetpack) {
		if(object.touched) {
			return true;
		}
	}

	return false;
}

//Spawns objects to the screen//
function spawnObjects() {
	//Spawn spawns (lol)//
	//Use '&& gameTimer != 0' to prevent a spawn on the first frame
	if(gameTimer % spawnCounterTarget === 0 && gameTimer !== 0) {
		randX = getRandomNumber(100,canvas.width-100);
		randY = getRandomNumber(-100, 0);
		//Generate a possible vx for the spawn based on the randX.  The goal is to
		//choose a vx such that the spawn will fly towards the center (and not just
		//offscreen).
		if(randX < canvas.width/2) {
			vxRange = getRandomNumber(0,2);
		}
		else {
			vxRange = getRandomNumber(-2,0);
		}
		vxChoices = [0, vxRange]; //Heavily weight the possibility of getting '0'
		randVx = vxChoices[Math.floor(Math.random()*vxChoices.length)];
		spawns.push(new Spawn(randX,randY,randVx,0,23,23));
	}

	//Spawn platforms//
	if(gameTimer % platformCounterTarget === 0) {
		randWidth = getRandomNumberPlatform(40,90);
		spawnHeight = 10;
		randX = getRandomNumberPlatform(canvas.width,canvas.width+(randWidth*2));
		randY = getRandomNumberPlatformYExcluded((canvas.height/2)+50, canvas.height-(spawnHeight*10)+50, randX, randWidth+50, spawnHeight+50);
		platforms.push(new Platform(randX,randY,randWidth,spawnHeight,'#000000'));
	}

	//Spawn powerups//
	//Jetpack
	if(gameTimer % powerupCounterTarget === 0 && gameTimer !== 0) {
		randX = getRandomNumber(100,canvas.width-100);
		randY = getRandomNumber(-100, 0);
		if(randX < canvas.width/2) {
			vxRange = getRandomNumber(0,2);
		}
		else {
			vxRange = getRandomNumber(-2,0);
		}
		vxChoices = [0, vxRange]; //Heavily weight the possibility of getting '0'
		randVx = vxChoices[Math.floor(Math.random()*vxChoices.length)];
		powerups.push(new Jetpack(randX,randY,randVx,0,20,20));
		//TODO: Better approach?
		//Because the triggering of targets is based on modulo, add powerupCounterTarget to itself
		//to prevent targets from triggering sooner than intended.  E.g., say the first random choice
		//for powerupCounterTarget was 600, then the second was 800.  Without using prev+new,
		//a powerup would drop at gameTimer == 600 and then at gameTimer == 800, even though only 200 frames had passed.
		//With prev+new, a powerup would drop at gameTimer == 600 and gameTimer == 1400, as expected.
		powerupCounterTarget = powerupCounterTarget+Math.floor(getRandomNumber(600,1200));
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