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
	if(spawnPoints.length === 0) {
		console.log('no room for new platform!');
		return 0;
	}

	//Decides which section to pick
	var choice = spawnPoints[Math.floor(Math.random()*spawnPoints.length)];
	return choice;
}
//For application to javascript Array.sort() method
function comparePlatformYValues(p1, p2) {
	if (p1.y < p2.y) {
		return -1;
	}
	if (p1.y > p2.y) {
		return 1;
	}
	return 0;
}

//Platform definitions//
function Platform(x,y,width,height,color) {
	this.x = x; this.y = y; this.width = width; this.height = height; this.color = color;
	this.removeNow = false;
}
Platform.prototype.draw = function() {
	context.fillStyle = this.color;
 	context.fillRect(this.x,this.y,this.width,this.height);
}
Platform.prototype.update = function() {
	this.x += platformScrollSpeed;
}