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

//Acceleration/
var gravity;
var spawnGravity;
var horizAcc;
var horizFrictionGround;
var horizFrictionAir;

//Scroll Speed//
var playerScrollSpeed;
var platformScrollSpeed;
var spawnScrollSpeed;

//Timers and Counters//
var gameScalingTimerShort; //makes game harder with time
var gameScalingTargetShort;
var gameScalingTimerLong;
var gameScalingTargetLong;
var spawnCounter;
var spawnCounterTarget;
var platformCounter;
var platformCounterTarget;

//Player movement values//
var upBigSpeed;
var upSmallspeed;
var leftSpeed;
var rightSpeed;

//Scoring//
var points;

//Loss condition//
var loseKill = false; //Lose by touching ("killing") a falling object
var loseWall = false; //Lose by touching the leftside of the canvas

//Control FPS//
var fps,fpsInterval,startTime,now,then,elapsed;

var monsterImage = new Image();
function makeMonsterImage()
{
  monsterImage.onload = function(){
    context.drawImage(monsterImage, 0,0);
  }
  monsterImage.src = 'assets/test_monster_2.png';
}

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
	horizAcc = 0.2;
	//For friction, higher numbers -> more slow down
	//1 -> slow down at rate equal to acceleration
	horizFrictionGround = 1;
	horizFrictionAir = 0.30;

	//Scroll Speed//
	playerScrollSpeed = -1;
	platformScrollSpeed = -1;
	spawnScrollSpeed = -1;

	//Timers and Counters//
	gameScalingTimerShort = 0; //makes game harder with time
	gameScalingTargetShort = 300; //5 seconds
	gameScalingTimerLong = 0;
	gameScalingTargetLong = 600; //10 seconds
	spawnCounter = 0;
	spawnCounterTarget = 120;
	platformCounter = 0;
	platformCounterTarget = 70;

	//Player movement values//
	upBigSpeed = -8;
	upSmallspeed = -5;
	leftSpeed = -5;
	rightSpeed = 5;

	//Scoring//
	points = 0;
}