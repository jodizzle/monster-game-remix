//Jetpack definitions//
function Jetpack(x, y, vx, vy, width, height, wobble) {
	this.x = x; this.y = y; this.vx = vx; this.vy = vy; this.width = width; this.height = height; this.wobble = wobble;
	this.onGround = false;
	this.touched = false;
	if(this.wobble) {
		wobbleAmplitude = Math.floor(getRandomNumber(3, 4));
	}
}
Jetpack.prototype.draw = function() {
	if(!this.touched) {
		context.fillStyle = jetpackColor;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
};
Jetpack.prototype.update = function() {
	//Horizontal movement//
	if(this.onGround) {
		this.x += spawnScrollSpeed;
	}
	else {
		if(this.wobble) {
			this.x += wobbleAmplitude*Math.cos((gameTimer%180)*0.03);
		}

		this.x += this.vx;
	}
	//Vertical movement//
	this.y += spawnGravity;

	//Vertical platform collision detection//
	for(var i = 0; i < platforms.length; i++) {
		platform = platforms[i];
		// Since spawns only fall from the top, should only have to worry about one vertical case.
		if (checkCollision(this, platform)) {
			this.y = platform.y - this.height;
			this.onGround = true;
		}
	}

	//Bottomside canvas collision detection//
	if(this.y + this.height > canvas.height) {
		this.y = canvas.height - this.height;
		this.touched = true;
	}
};

//Double Points definitions//
function DoublePoints(x, y, vx, vy, width, height, wobble) {
	this.x = x; this.y = y; this.vx = vx; this.vy = vy; this.width = width; this.height = height; this.wobble = wobble;
	this.onGround = false;
	this.touched = false;
	if(this.wobble) {
		wobbleAmplitude = Math.floor(getRandomNumber(3, 4));
	}
}
DoublePoints.prototype.draw = function() {
	if(!this.touched) {
		context.fillStyle = doublePointsColor;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
};
DoublePoints.prototype.update = function() {
	//Horizontal movement//
	if(this.onGround) {
		this.x += spawnScrollSpeed;
	}
	else {
		if(this.wobble) {
			this.x += wobbleAmplitude*Math.cos((gameTimer%180)*0.03);
		}

		this.x += this.vx;
	}
	//Vertical movement//
	this.y += spawnGravity;

	//Vertical platform collision detection//
	for(var i = 0; i < platforms.length; i++) {
		platform = platforms[i];
		// Since spawns only fall from the top, should only have to worry about one vertical case.
		if (checkCollision(this, platform)) {
			this.y = platform.y - this.height;
			this.onGround = true;
		}
	}

	//Bottomside canvas collision detection//
	if(this.y + this.height > canvas.height) {
		this.y = canvas.height - this.height;
		this.touched = true;
	}
};