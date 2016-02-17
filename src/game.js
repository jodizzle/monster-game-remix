//Main loop functions//
function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height); //Clears the screen every frame

	if(!loseKill && !loseWall) {
		//Draw background//
		var backgroundImage = new Image();
		backgroundImage.src = 'assets/background.png';
		context.drawImage(backgroundImage, 0, 0);
		//Draw army//
		var armyImage = new Image();
		armyImage.src = 'assets/army.png';
		context.drawImage(armyImage, armyCos(gameTimer), canvas.height-armySine(gameTimer));
		//Display instructions//
		context.strokeStyle = "black";
		context.fillStyle = "purple";
		context.font = "44px serif";
		context.textAlign = "center";
		context.lineWidth = 0.3;
		drawText("you are no monster", canvas.width/2, 240);
		drawText("prove it", canvas.width/2, 290);
		drawText("only kill people when they're dead", canvas.width/2, 340);
		//Controls//
		context.font = "32px serif";
		context.textAlign = "start";
		drawText("z: big jump", 290, 30);
		drawText("x: little jump", 290, 70);
		drawText("p: " + audioMessage + " music", canvas.width-280, 30);
		drawText("c: cycle music", canvas.width-280, 70);
		drawText("r: restart", canvas.width-280, 110);
		drawText("space: (un)pause", canvas.width-280, 150);
		//Bottom Message//
		context.font = "32px serif";
		context.textAlign = "center";
		drawText("don't let the army down here get you", canvas.width/2, 440);
	}

	//Display text//
	context.fillStyle = "purple";
	context.font = "40px serif";
	context.textAlign = "start";
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
		context.font = "32px serif";
		drawText("humanity: " + humanity, 10, 30);
		drawText("time: " + (gameTimer/60.0).toFixed(1) + "s", 10, 70);
		context.lineWidth = 1;
		if(player.hasJetpack) {
			context.fillStyle = jetpackColor;
			drawText("jetpack: " + ((jetpackCounterTarget-(gameTimer-player.jetpackTimer))/60).toFixed(2) + "s", 10, 110)
		}
		if(player.hasDoublePoints) {
			context.fillStyle = doublePointsColor;
			drawText("x2 points: " + ((doublePointsCounterTarget-(gameTimer-player.doublePointsTimer))/60).toFixed(2) + "s", 10, 150);
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

	player.draw(); //Want to draw player above everything else.
}
function update() {
	//Updates objects//
	if (!loseKill && !loseWall) {
		gameTimer += 1;
	}
	if(gameTimer % gameScalingTargetShort === 0) {
		if(spawnCounterTarget > 10) {
			spawnCounterTarget -= 10; //makes spawns spawn faster
									  //speed currently reaches it's cap at 50 seconds
		}
		if(platformCounterTarget > 10) {
			platformCounterTarget -= 10;
		}
		spawnGravity += 0.5; //faster falling spawns
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
		//Empty arrays
		platforms = [];
		spawns = [];
		powerups = [];
		//Remove scrolling
		playerScrollSpeed = 0;
		platformScrollSpeed = 0;
		spawnScrollSpeed = 0;
		//Do some scoring
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
		case 32: //Pause the game when the spacebar is pressed
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
		case 82:
			restartPressed = false;
			break;
	}
});
//Prevent scrolling on the page with arrow keys and spacebar
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