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
var horizAcc;
var horizFrictionGround;
var horizFrictionAir;
// var vertAcc;

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

//Player movement values//
var upBigSpeed;
var upSmallspeed;
var leftSpeed;
var rightSpeed;

//Scoring//
var points;
var spawnCount;

//Loss condition//
var loseKill = false; //Lose by touching ("killing") a falling object
var loseWall = false; //Lose by touching the leftside of the canvas

//Control FPS//
var fps,fpsInterval,startTime,now,then,elapsed;

//Initializes (or re-initializes) variables//
function startValues() {
	platforms = [new Platform(canvas.width/3,canvas.height/2,80,10,'black'),new Platform(500,200,80,10,'black'),new Platform(700,canvas.height/2,80,10,'black')];
	
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

	//Acceleration//
	gravity = 0.2;
	spawnGravity = 2;
	horizAcc = 0.3;
	//For friction, higher numbers -> more slow down
	//1 -> slow down at rate equal to acceleration
	horizFrictionGround = 1;
	horizFrictionAir = 0.30;
	// vertAcc = -0.3;

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

	//Player movement values//
	upBigSpeed = -7;
	upSmallspeed = -5;
	leftSpeed = -5;
	rightSpeed = 5;

	//Scoring//
	points = 0;
	spawnCount = 0;
}