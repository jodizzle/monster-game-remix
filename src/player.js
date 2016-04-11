//Player definitions//
var player = {
	x: canvas.width/3,
	y: canvas.height/2,
	vx: 0,
	vy: 0,
	width: 26,
	height: 28,
	onGround: false,
	hasJetpack: false,
	hasMultiPoints: false,
	hasFreeze: false,
	jetpackTimer: 0,
	multiPointsTimer: 0,
	freezeTimer: 0,

	draw: function() {
		var monsterImage = new Image();
		monsterImage.src = 'assets/test_monster_2.png';
		context.drawImage(monsterImage, 3, 2, this.width, this.height, this.x, this.y, this.width, this.height);
	},
	update: function() {
		//Check conditions of powerups//
		//Jetpack//
		if(player.hasJetpack && (gameTimer-player.jetpackTimer) === jetpackCounterTarget) {
			player.hasJetpack = false;
		}
		//Double Points//
		if(player.hasMultiPoints && (gameTimer-player.multiPointsTimer) === multiPointsCounterTarget) {
			player.hasMultiPoints = false;
			multiPointsValue = 2;
		}
		//Freeze//
		if(player.hasFreeze && (gameTimer-player.freezeTimer) === freezeCounterTarget) {
			player.hasFreeze = false;
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
				// Check first to see if the number is close to be not quite
				// 0.1.  This prevents endless sliding.
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
				// Use "lower friction" while in the air.
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
		for(var i = 0; i < platforms.length; i++) {
			platform = platforms[i];
			if(checkCollision(player, platform)) {
				if(player.vx > 0 && !leftPressed) { //Leftside case
					player.x = platform.x - player.width;
				 	player.vx = 0;
				}
				else if (player.vx < 0 && !rightPressed) { //Rightside case
					player.x = platform.x + platform.width;
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
			// Controls jetpack behavior.
			if (player.hasJetpack) {
				if (upPressed && player.vy > upSmallSpeed) {
					player.vy += vertAcc;
				}
			}
			if (!downPressed && player.vy < terminalVelocity) {
				// Gravity is always applied except on the frame of jumping.
				player.vy += gravity;
			}
			// As long as down is held, fast fall.  If down is released and above terminal
			// velocity, return to terminal velocity.
			else if(!downPressed && player.vy > terminalVelocity) {
				player.vy = terminalVelocity;
			}
			else if(downPressed) {
				player.vy += fastFallMultiplier*gravity;
			}
		}
		player.y += player.vy;

		//Vertical platform collision detection//
		for(var i = 0; i < platforms.length; i++) {
			platform = platforms[i];
			if (checkCollision(player, platform)) {
				//Topside case
				if(player.vy > 0) {
					player.y = platform.y - player.height;
				 	player.vy = 0;
				 	player.onGround = true;
				 	jumping = false;
				}
				// Bottomside case
				else if (player.vy < 0) {
					player.y = platform.y + platform.height;
			 	 	player.vy = 0;
				}
			}
		}

		//Spawn collision detection//
		for(var i = 0; i < spawns.length; i++) {
			spawn = spawns[i];
			if (checkCollision(player, spawn)) {
				spawn.touched = true;
				if(spawn.onGround) {
					if(player.hasMultiPoints) {
						humanity += multiPointsValue;
					}
					else {
						humanity += 1;
					}
					spawnCollected += 1;
				}
				else {
					loseKill = true;
					player.hasJetpack = false;
					player.hasMultiPoints = false;
				}
			}
		}
		//Powerup collision detection//
		for(var i = 0; i < powerups.length; i++) {
			powerup = powerups[i];
			if (checkCollision(player, powerup)) {
				powerup.touched = true;
				if(powerup instanceof Jetpack) {
					if(player.hasJetpack) {
						player.jetpackTimer += jetpackCounterTarget;
					}
					else {
						player.hasJetpack = true;
						player.jetpackTimer = gameTimer;
					}
				}
				if(powerup instanceof MultiPoints) {
					if(player.hasMultiPoints) {
						player.multiPointsTimer += multiPointsCounterTarget;
						multiPointsValue *= 2;
					}
					else {
						player.hasMultiPoints = true;
						player.multiPointsTimer = gameTimer;
					}
				}
				if(powerup instanceof Freeze) {
					if(player.hasFreeze) {
						player.freezeTimer += freezeCounterTarget;
					}
					else {
						player.hasFreeze = true;
						player.freezeTimer = gameTimer;
					}
				}
			}
		}

		//Rightside canvas collision detection//
		if(player.x + player.width > canvas.width) {
			player.x = canvas.width - player.width;
			player.vx = 0;
		}
		//Leftside canvas collision detection//
		else if(player.x + playerScrollSpeed <= 0) {
			player.x = 0;
			player.vx = -1*playerScrollSpeed; // "Push" against the wall.
		}
		//Default horizontal scrolling//
		else if(!player.hasFreeze && player.x + playerScrollSpeed > 0) {
			player.x += playerScrollSpeed;
		}
		//Bottomside canvas collision detection//
		if(player.y + player.height > canvas.height) {
			player.y = canvas.height - player.height;
			player.vy = 0;
			player.onGround = true;
			jumping = false;
			loseWall = true;
			player.hasJetpack = false;
			player.hasMultiPoints = false;
		}
		//Topside canvas collision detection//
		else if(player.y < 0) {
			player.y = 0;
			player.vy = 0;
		}
	}
};