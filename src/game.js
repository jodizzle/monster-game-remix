//Platforms array//
var platforms = [];
//Spawns array//
var spawns = [];
//Powerups array//
var powerups = [];

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
		context.fillText("p: toggle music", canvas.width-250, 150);
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
		context.fillText("time: "+(gameTimer/60.0).toFixed(1)+"s", 10, 100);
		if(player.hasJetpack) {
			context.fillText("jetpack: "+((jetpackCounterTarget-(gameTimer-player.jetpackTimer))/60).toFixed(2), 10, 150)
		}
		//Draws objects//
		for(var i=0; i<spawns.length; i++) {
			spawns[i].draw();
		}
		for(var i=0; i<platforms.length; i++) {
			platforms[i].draw();
		}
		for(var i=0; i<powerups.length; i++) {
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
	if(gameTimer % gameScalingTargetShort == 0) {
		if(spawnCounterTarget > 10) {
			spawnCounterTarget -= 10; //makes spawns spawn faster
									  //speed currently reaches it's cap at 50 seconds
		}
		spawnGravity += 0.5; //faster falling spawns
	}
	if(gameTimer % gameScalingTargetLong == 0) {
		platformScrollSpeed -= 0.3;
		spawnScrollSpeed -= 0.3;
		playerScrollSpeed -= 0.3;
		rightSpeed += 0.3;
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
		removeObjects(powerups);
		for(var i=0; i<powerups.length; i++) {
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
		//Teleport player
		// player.x = canvas.width/2;
		// player.y = canvas.height/2;
		// if(restartPressed) {
		// 	loseKill = false;
		// 	loseWall = false;
		// 	startValues();
		// }
	}
	if(restartPressed) {
		// TODO: Fix redundancy
		platforms = [];
		spawns = [];
		powerups = [];

		loseKill = false;
		loseWall = false;
		startValues();
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
window.addEventListener('keyup',function(e) {
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
window.addEventListener('keydown',function(e) {
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