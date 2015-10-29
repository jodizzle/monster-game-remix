//Check if obj1 is colliding with obj2//
function checkCollision(obj1, obj2) {
	//Using ~~ to truncate
	if(~~obj1.y < ~~obj2.y + ~~obj2.height && ~~obj1.y + ~~obj1.height > ~~obj2.y && ~~obj1.x + ~~obj1.width > ~~obj2.x && ~~obj1.x < ~~obj2.x + ~~obj2.width) {
		return true
	}

	return false
}
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