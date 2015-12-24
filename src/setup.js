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
var jetpackCounterTarget;
var doublePointsCounterTarget;

//Player movement values//
var upBigSpeed;
var upSmallSpeed;
var leftSpeed;
var rightSpeed;
var terminalVelocity;

//Scoring//
var humanity;
var spawnCollected;
var spawnDead; //The total number of spawns that have died (and are therefore collectable)
var score;
var prevScore = 0;
var highScore = 0;

//Loss conditions//
var loseKill; //Lose by touching ("killing") a falling object
var loseWall; //Lose by touching the leftside of the canvas

//Control FPS//
var fps,fpsInterval,startTime,now,then,elapsed;

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
	platformXValues = [canvas.width/3, 420, 525, 700];
	platforms = [new Platform(0,canvas.height/2+50,80,10,'black'),
				 new Platform(0,340,80,10,'black'),
				 new Platform(0,400,80,10,'black'),
				 new Platform(0,(canvas.height/2)+50,80,10,'black')];

	//Randomize x positions;
	shuffleArray(platformXValues);
	for(var i = 0; i < platforms.length; i++) {
		platforms[i].x = platformXValues[i];
	}
	spawns = [];
	powerups = [];

	//Player//
	player.vx = 0;
	player.vy = 0;
	player.x = canvas.width/3;
	player.y = canvas.height/2;
	player.hasJetpack = false;

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
	platformCounterTarget = 90;
	powerupCounterTarget = Math.floor(getRandomNumber(420,900));
	jetpackCounterTarget = 600;
	doublePointsCounterTarget = 600;

	//Player movement values//
	upBigSpeed = -7;
	upSmallSpeed = -5;
	leftSpeed = -5;
	rightSpeed = 5;
	terminalVelocity = 9;

	//Scoring//
	humanity = 0;
	spawnCollected = 0;
	spawnDead = 0;
	score = 0;

	//Loss conditions//
	loseKill = false;
	loseWall = false;
}