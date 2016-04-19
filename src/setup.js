//Canvas setup//
canvas = document.getElementById('game');
context = canvas.getContext('2d');
textCanvas = document.createElement('canvas');
textContext = textCanvas.getContext('2d');

//Canvas dimensions//
canvas.width = textCanvas.width = 800;
canvas.height = textCanvas.height = 500;

//Pausing//
paused = false; // Boolean switch for pausing.
audioMessage = "pause";

//Powerup Colors//
jetpackColor = "#25E820";
multiPointsColor = "#FE2C2C";
freezeColor = "#4402F7";

//Initialize variables//
function startValues() {
	//Keypress values//
	leftPressed = false;
	rightPressed = false;
	downPressed = false;
	upPressed = false;
	upBigPressed = false;
	upSmallPressed = false;
	restartPressed = false;

	//Jumping booleans//
	jumping = false;

	//Platform Dimensions//
	platformWidthLowerBound = 40;
	platformWidthUpperBound = 90;
	platformHeightLowerBound = 5;
	platformHeightUpperBound = 10;

	//Object arrays//
	platforms = []; // Reset platforms.
	platformXValues = [400, 525, 700, canvas.width];
	platformYValues = [canvas.height/2 + 50, 340, 400, 425];

	// Randomize x- and y-positions
	shuffleArray(platformXValues);
	shuffleArray(platformYValues);

	platforms.push(new Platform(canvas.width/3, canvas.height/2 + 50, 80, 10, 'black'));
	for(var i = 0; i < platformXValues.length; i++) {
		platforms.push(new Platform(platformXValues[i], 
		                            platformYValues[i], 
		                            Math.round(getRandomNumber(platformWidthLowerBound, platformWidthUpperBound)), 
		                            Math.round(getRandomNumber(platformHeightLowerBound, platformHeightUpperBound)), 
		                            'black'));
	}
	spawns = [];
	powerups = [];

	//Player//
	player.vx = 0;
	player.vy = 0;
	player.x = canvas.width/3;
	player.y = canvas.height/2;
	player.hasJetpack = false;
	player.hasMultiPoints = false;
	player.hasFreeze = false;

	//Acceleration//
	gravity = 0.2;
	spawnGravity = 2;
	horizAccGround = 0.3;
	horizAccAir = 0.4;
	// For friction, higher numbers -> more slow down.
	// 1 -> slow down at rate equal to acceleration.
	horizFrictionGround = 1;
	horizFrictionAir = 0.3;
	vertAcc = -0.5;

	//Scroll speed//
	playerScrollSpeed = -1;
	platformScrollSpeed = -1;
	spawnScrollSpeed = -1;

	//Timers and counters//
	gameTimer = 0;
	gameScalingTargetShort = 300; //5 seconds
	gameScalingTargetLong = 600; //10 seconds
	spawnCounterTarget = 100;
	platformCounterTarget = 100;
	powerupCounterLowerBound = 300;
	powerupCounterUpperBound = 600;
	powerupCounterTarget = Math.round(getRandomNumber(powerupCounterLowerBound, powerupCounterUpperBound));
	jetpackCounterTarget = 600;
	multiPointsCounterTarget = 900;
	freezeCounterTarget = 300;

	//Player movement values//
	upBigSpeed = -7;
	upSmallSpeed = -5;
	leftSpeed = -5;
	rightSpeed = 5;
	terminalVelocity = 5;
	fastFallMultiplier = 3; // 3 times regular gravity.

	//Spawn movement values//
	spawnTrackXSpeed = 0.75;
	spawnTrackYSpeed = 1;

	//Scoring//
	humanity = 0;
	humanityWeight = 5; // Multiplier for humanity in score calculation.
	multiPointsValue = 2; // The amount of points that MultiPoints adds.
	timeWeight = 1; // Multiplier for time in score calculation,
	spawnCollected = 0;
	spawnDead = 0;
	score = 0;
	prevScore = 0;
	highScore = 0;

	//Loss conditions//
	loseKill = false;
	loseWall = false;

	//Draw to text canvas//
	textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
	//Display instructions//
	textContext.strokeStyle = "black";
	textContext.fillStyle = "purple";
	textContext.font = "44px serif";
	textContext.textAlign = "center";
	textContext.lineWidth = 3;
	drawText(textContext, "YOU ARE NO MONSTER", canvas.width/2, 240);
	drawText(textContext, "PROVE IT", canvas.width/2, 290);
	drawText(textContext, "only kill people when they're dead", canvas.width/2, 340);
	//Controls//
	textContext.font = "30px serif";
	textContext.textAlign = "start";
	drawText(textContext, "z: big jump", 300, 30);
	drawText(textContext, "x: little jump", 300, 65);
	drawText(textContext, "c: cycle music", 555, 65);
	drawText(textContext, "r: restart", 555, 100);
	drawText(textContext, "space: pause", 555, 135);
	//Bottom Message//
	textContext.textAlign = "center";
	textContext.font = "28px serif";
	textContext.lineWidth = 2.5;
	drawText(textContext, "(arrow keys to move; down key to fast-fall)", canvas.width/2, 390);
	drawText(textContext, "(don't let the army down here get you)", canvas.width/2, 440);
}