//Player definition//
var player = {
	x: canvas.width/3,
	y: canvas.height/2,
	vx: 0,
	vy: 0,
	width: 28,
	height: 30,
	onGround: false,
	hasJetpack: false,
	jetpackTimer: 0,

	draw: function() {
		var monsterImage = new Image();
		monsterImage.src = 'assets/test_monster_2.png';
		context.drawImage(monsterImage, 3, 2, 26, 28, this.x, this.y, this.width, this.height);
	},
	update: function() {
		//Check conditions of powerups//
		//Jetpack//
		if(player.hasJetpack && (gameTimer-player.jetpackTimer) === jetpackCounterTarget) {
			player.hasJetpack = false;
		}

		//Horizontal movement//
		if(leftPressed) {
			if(player.vx > leftSpeed) {
				if(player.onGround) {
					player.vx -= horizAccGround;
				}
				else {
					player.vx -= horizAccAir;
				}
			}
		}
		else if(rightPressed) {
			if(player.vx < rightSpeed) {
				if(player.onGround) {
					player.vx += horizAccGround;
				}
				else {
					player.vx += horizAccAir;
				}
			}
		}
		else {
			if (player.onGround) {
				//Check first to see if the number is close to be not quite
				//0.1.  This prevents endless sliding.
				if (Math.abs(player.vx - horizAccGround) < horizAccGround) {
					player.vx = 0;
				}
				else if (player.vx > 0) {
					player.vx -= horizAccGround*horizFrictionGround;
				}
				else if (player.vx < 0) {
					player.vx += horizAccGround*horizFrictionGround;
				}
			}
			else {
				//Use "lower friction" while in the air.
				if (Math.abs(player.vx - horizAccAir) < horizAccAir) {
					player.vx = 0;
				}
				else if (player.vx > 0) {
					player.vx -= horizAccAir*horizFrictionAir;
				}
				else if (player.vx < 0) {
					player.vx += horizAccAir*horizFrictionAir;
				}
			}
		}
		player.x += player.vx;

		//Horizontal platform collision detection//
		for(var i=0; i<platforms.length; i++) {
			platform = platforms[i];
			if(checkCollision(player,platform)) {
				if(player.vx > 0 && !leftPressed) { //Leftside case
					player.x = platform.x-player.width;
				 	player.vx = 0;
				}
				else if (player.vx < 0 && !rightPressed) { //Rightside case
					player.x = platform.x+platform.width;
			 	 	player.vx = 0;
				}
			}
		}

		//Vertical movement//
		if(upPressed && player.onGround && !jumping) {
			if(upSmallPressed && !player.hasJetpack) {
				player.vy = upSmallSpeed;
			}
			if(upBigPressed && !player.hasJetpack) {
				player.vy = upBigSpeed;
			}
			player.onGround = false;
			jumping = true;
		}
		else {
			//Controls jetpack behavior
			if (player.hasJetpack) {
				if (upPressed && player.vy > upSmallSpeed) {
					player.vy += vertAcc;
				}
			}
			if (player.vy < terminalVelocity) {
				player.vy += gravity; //Gravity is always applied except on the frame of jumping
			}
		}
		player.y += player.vy;

		//Vertical platform collision detection//
		for(var i=0; i<platforms.length; i++) {
			platform = platforms[i];
			if (checkCollision(player,platform)) {
				if(player.vy > 0) { //Topside case
					player.y = platform.y-player.height;
				 	player.vy = 0;
				 	player.onGround = true;
				 	jumping = false;
				}
				else if (player.vy < 0) { //Bottomside case
					player.y = platform.y+platform.height;
			 	 	player.vy = 0;
				}
			}
		}

		//Spawn collision detection//
		for(var i=0; i<spawns.length; i++) {
			spawn = spawns[i];
			if (checkCollision(player,spawn)) {
				spawn.touched = true;
				if(spawn.onGround) {
					points += 1;
				}
				else {
					loseKill = true;
					player.hasJetpack = false;
				}
			}
		}

		//Powerup collision detection//
		for(var i=0; i<powerups.length; i++) {
			powerup = powerups[i];
			if (checkCollision(player,powerup)) {
				powerup.touched = true;
				if(powerup instanceof Jetpack) {
					player.hasJetpack = true;
					player.jetpackTimer = gameTimer;
				}
			}
		}

		//Rightside canvas collision detection//
		if(player.x+player.width > canvas.width) {
			player.x = canvas.width-player.width;
			player.vx = 0;
		}
		//Leftside canvas collision detection//
		else if(player.x+playerScrollSpeed <= 0) {
			player.x = 0;
			player.vx = -1*playerScrollSpeed; //"Push" against the wall
		}
		//Default horizontal scrolling//
		else if(player.x+playerScrollSpeed > 0) {
			player.x += playerScrollSpeed;
		}

		//Bottomside canvas collision detection//
		if(player.y+player.height > canvas.height) {
			player.y = canvas.height-player.height;
			player.vy = 0;
			player.onGround = true;
			jumping = false;
			loseWall = true;
			player.hasJetpack = false;
		}
		//Topside canvas collision detection//
		else if(player.y < 0) {
			player.y = 0;
			player.vy = 0;
		}
	}
};