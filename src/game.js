//Main loop functions//
function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height); // Clears the screen every frame.
	context.fillStyle = "purple";
	context.font = "36px serif";
	context.textAlign = "start";
	context.lineWidth = 3;

	if(!loseKill && !loseWall) {
		//Draw background//
		var backgroundImage = new Image();
		backgroundImage.src = 'assets/background.png';
		context.drawImage(backgroundImage, 0, 0);
		//Draw army//
		var armyImage = new Image();
		armyImage.src = 'assets/army.png';
		context.drawImage(armyImage, armyCos(gameTimer), canvas.height-armySine(gameTimer));
		drawText(context, "p: " + audioMessage + " music", 525, 30);
		drawText(context, "track: " + audioIndex, 270, 110);
		context.drawImage(textCanvas, 0, 0);
	}

	//Display text//
	context.font = "40px serif";
	if(loseKill) {
		context.fillText("you are the monster", 10, 50);
		displayScore();
		context.fillText("press r to restart", canvas.width/2, canvas.height-50);
	}
	else if(loseWall) {
		context.fillText("the army got you", 10, 50);
		displayScore();
		context.fillText("press r to restart", canvas.width/2, canvas.height-50);
	}
	else {
		context.font = "36px serif";
		drawText(context, "humanity: " + humanity, 10, 30);
		drawText(context, "time: " + (gameTimer/60.0).toFixed(1), 10, 70);
		if(player.hasJetpack) {
			context.fillStyle = jetpackColor;
			drawText(context, "jetpack: " + ((jetpackCounterTarget-(gameTimer-player.jetpackTimer))/60).toFixed(2), 10, 110);
		}
		if(player.hasDoublePoints) {
			context.fillStyle = doublePointsColor;
			drawText(context, "x2 points: " + ((doublePointsCounterTarget-(gameTimer-player.doublePointsTimer))/60).toFixed(2), 10, 150);
		}
		//Draws objects//
		for(var i = 0; i < spawns.length; i++) {
			spawns[i].draw();
		}
		for(var i = 0; i < platforms.length; i++) {
			platforms[i].draw();
		}
		for(var i = 0; i < powerups.length; i++) {
			powerups[i].draw();
		}
	}

	// Want to draw player above everything else.
	player.draw();
}
function update() {
	//Updates objects//
	if (!loseKill && !loseWall) {
		gameTimer += 1;
	}
	if(gameTimer % gameScalingTargetShort === 0) {
		if(spawnCounterTarget > 10) {
			// Makes spawns spawn faster.
			// Speed currently reaches it's cap at 50 seconds.
			spawnCounterTarget -= 10;
		}
		if(platformCounterTarget > 10) {
			platformCounterTarget -= 10;
		}
		spawnGravity += 0.5;
	}
	if(gameTimer % gameScalingTargetLong === 0) {
		platformScrollSpeed -= 1;
		spawnScrollSpeed -= 1;
		playerScrollSpeed -= 1;
		rightSpeed += 1;
	}

	player.update();
	if(!loseKill && !loseWall) {
		removeObjects(spawns);
		for(var i=0; i < spawns.length; i++) {
			spawns[i].update();
		}
		removeObjects(platforms);
		for(var i=0; i < platforms.length; i++) {
			platforms[i].update();
		}
		removeObjects(powerups);
		for(var i=0; i < powerups.length; i++) {
			powerups[i].update();
		}
	}
	else {
		// Empty arrays
		platforms = [];
		spawns = [];
		powerups = [];
		// Remove scrolling
		playerScrollSpeed = 0;
		platformScrollSpeed = 0;
		spawnScrollSpeed = 0;
		// Do some scoring
		score = calculateScore();
		if (score > highScore) {
			highScore = score;
		}
	}
	if(restartPressed) {
		prevScore = score;
		startValues();
	}
}
function mainLoop() {
	window.requestAnimationFrame(mainLoop);
	now = Date.now();
	elapsed = now - then;
	if(elapsed > fpsInterval && !paused) {
		then = now - (elapsed % fpsInterval);
		spawnObjects();
		update();
		draw();
	}
}

//Keyboard listeners//
window.addEventListener('keydown', function(e) {
	switch (e.which) {
		case 32: // Pause the game when the spacebar is pressed.
			drawPaused();
			paused = !paused;
			break;
		case 37:
			leftPressed = true;
			break;
		case 88:
			upSmallPressed = true;
			upPressed = true;
			jumping = true;
			break;
		case 90:
			upBigPressed = true;
			upPressed = true;
			jumping = true;
			break;
		case 39:
			rightPressed = true;
			break;
		case 40:
			downPressed = true;
			break;
		case 82:
			restartPressed = true;
			break;
	}
});
window.addEventListener('keyup', function(e) {
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
		case 40:
			downPressed = false;
			break;
		case 82:
			restartPressed = false;
			break;
	}
});
// Prevent scrolling on the page with arrow keys and spacebar.
window.addEventListener('keydown', function(e) {
	switch (e.which) {
		case 32: case 37: case 38: case 39: case 40:
			e.preventDefault();
			break;
		default:
			break;
	}
});

//Initial Calls//
function init(fps) {
	fpsInterval = 100/fps;
	then = Date.now();
	startTime = then;
	startValues();
	mainLoop();
}
init(60);