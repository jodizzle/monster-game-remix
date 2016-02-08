//Canvas setup//
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

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

//Acceleration//
var gravity;
var spawnGravity;
var horizAccGround;
var horizAccAir;
var horizFrictionGround;
var horizFrictionAir;
var vertAcc;

//Object arrays//
var platforms = [];
var spawns = [];
var powerups = [];

//Scroll speeds//
var playerScrollSpeed;
var platformScrollSpeed;
var spawnScrollSpeed;

//Timers and counters//
var gameTimer;
var gameScalingTargetShort;
var gameScalingTargetLong;
var spawnCounterTarget;
var platformCounterTarget;
var powerupCounterTarget;
var powerupCounterLowerBound;
var powerupCounterUpperBound;
var jetpackCounterTarget;
var doublePointsCounterTarget;

//Player movement values//
var upBigSpeed;
var upSmallSpeed;
var leftSpeed;
var rightSpeed;
var terminalVelocity;

//Spawn movement values//
var spawnTrackXSpeed;
var spawnTrackYSpeed;

//Scoring//
var humanity;
var humanityWeight = 4.20; //Multiplier for humanity in score calculation
var spawnCollected;
var spawnDead; //The total number of spawns that have died (and are therefore collectable)
var score;
var prevScore = 0;
var highScore = 0;

//Loss conditions//
var loseKill; //Lose by touching ("killing") a falling object
var loseWall; //Lose by touching the leftside of the canvas

//Control FPS//
var paused = false; //Boolean switch for pausing
var fps,fpsInterval,startTime,now,then,elapsed;

//Audio//
audioMessage = "pause";

//Initializes (or re-initializes) variables//
function startValues() {
	//Keypress values//
	leftPressed = false;
	rightPressed = false;
	upPressed = false;
	upBigPressed = false;
	upSmallPressed = false;
	restartPressed = false;

	//Object arrays//
	platforms = []; //Reset platforms
	platformXValues = [400, 525, 700, canvas.width];
	platformYValues = [canvas.height/2 + 50, 340, 400, 425];

	//Randomize x- and y-positions:
	shuffleArray(platformXValues);
	shuffleArray(platformYValues);

	platforms.push(new Platform(canvas.width/3, canvas.height/2 + 50, 80, 10, 'black'));
	for(var i = 0; i < platformXValues.length; i++) {
		platforms.push(new Platform(platformXValues[i], platformYValues[i], 80, 10, 'black'));
	}
	spawns = [];
	powerups = [];

	//Player//
	player.vx = 0;
	player.vy = 0;
	player.x = canvas.width/3;
	player.y = canvas.height/2;
	player.hasJetpack = false;
	player.hasDoublePoints = false;

	//Acceleration//
	gravity = 0.2;
	spawnGravity = 2;
	horizAccGround = 0.3;
	horizAccAir = 0.4;
	//For friction, higher numbers -> more slow down
	//1 -> slow down at rate equal to acceleration
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
	powerupCounterTarget = Math.floor(getRandomNumber(powerupCounterLowerBound, powerupCounterUpperBound));
	jetpackCounterTarget = 600;
	doublePointsCounterTarget = 600;

	//Player movement values//
	upBigSpeed = -7;
	upSmallSpeed = -5;
	leftSpeed = -5;
	rightSpeed = 5;
	terminalVelocity = 9;

	//Spawn movement values//
	spawnTrackXSpeed = 0.75;
	spawnTrackYSpeed = 1;

	//Scoring//
	humanity = 0;
	spawnCollected = 0;
	spawnDead = 0;
	score = 0;

	//Loss conditions//
	loseKill = false;
	loseWall = false;
}