//Spawn definitions//
function Spawn(x,y,vx,vy,width,height) {
	this.x = x; this.y = y; this.vx = vx; this.vy = 0; this.width = width; this.height = height;
	this.onGround = false;
	this.touched = false;
	this.added = false; //Bool to check if the spawn has been counted by spawnDead
}
Spawn.prototype.draw = function() {
	var guyImage = new Image();
	if(this.onGround) {
		guyImage.src = 'assets/test_guy_1_splatter.png';
	}
	else {
		guyImage.src = 'assets/test_guy_1.png';
	}
	context.drawImage(guyImage, 0, 0, 25, 25, this.x, this.y, this.width, this.height);
}
Spawn.prototype.update = function() {
	//Horizontal movement//
	if(this.onGround) {
		this.x += spawnScrollSpeed;
	}
	else {
		this.x += this.vx;
	}

	//Vertical movement//
	this.y += spawnGravity;
	//Vertical platform collision detection//
	for(var i=0; i<platforms.length; i++) {
		platform = platforms[i];
		//Since spawns only fall from the top, should only have to worry about one vertical case.
		if (checkCollision(this,platform)) {
			this.y = platform.y-this.height;
			this.vy = 0;
			this.onGround = true; //Might be a worthless (since platforms are already moving), but here just in case.
			if(!this.added) {
				spawnDead += 1;
				this.added = true;
			}
		}
	}

	//Bottomside canvas collision detection//
	if(this.y+this.height > canvas.height) {
		this.y = canvas.height-this.height;
		this.vy = 0;
		this.onGround = true;
		this.touched = true;
	}
}