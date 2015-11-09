//Canvas setup//
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var raf;

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

//Scroll Speed//
var playerScrollSpeed;
var platformScrollSpeed;
var spawnScrollSpeed;

//Timers and Counters//
var gameTimer;
var gameScalingTargetShort;
var gameScalingTargetLong;
var spawnCounterTarget;
var platformCounterTarget;
var powerupCounterTarget;
var jetpackCounterTarget;

//Player movement values//
var upBigSpeed;
var upSmallspeed;
var leftSpeed;
var rightSpeed;

//Scoring//
var points;
var spawnDead; //The total number of spawns that have died (and are therefore collectable)

//Loss condition//
var loseKill = false; //Lose by touching ("killing") a falling object
var loseWall = false; //Lose by touching the leftside of the canvas

//Control FPS//
var fps,fpsInterval,startTime,now,then,elapsed;

//Initializes (or re-initializes) variables//
function startValues() {
	platforms = [new Platform(canvas.width/3,canvas.height/2+50,80,10,'black'),
				 new Platform(500,200+50,80,10,'black'),
				 new Platform(700,(canvas.height/2)+50,80,10,'black')];
	
	//Keypress values//
	leftPressed = false;
	rightPressed = false;
	upPressed = false;
	upBigPressed = false;
	upSmallPressed = false;
	restartPressed = false;

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
	vertAcc = -0.4;

	//Scroll Speed//
	playerScrollSpeed = -1;
	platformScrollSpeed = -1;
	spawnScrollSpeed = -1;

	//Timers and Counters//
	gameTimer = 0;
	gameScalingTargetShort = 300; //5 seconds
	gameScalingTargetLong = 600; //10 seconds
	spawnCounterTarget = 100;
	platformCounterTarget = 70;
	powerupCounterTarget = 900;
	jetpackCounterTarget = 600;

	//Player movement values//
	upBigSpeed = -7;
	upSmallspeed = -5;
	leftSpeed = -5;
	rightSpeed = 5;

	//Scoring//
	points = 0;
	spawnDead = 0;
}