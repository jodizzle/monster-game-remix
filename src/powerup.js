function Jetpack(x,y,vx,vy,width,height,color) {
	this.x = x; this.y = y; this.vx = vx; this.vy = vy; this.width = width; this.height = height; this.color = color;
	this.onGround = false;
	this.touched = false;
}

Jetpack.prototype.draw = function() {
	if(!this.touched) {
		context.fillStyle = "#25E820";
		context.fillRect(this.x,this.y,this.width,this.height);
	}
};
Jetpack.prototype.update = function() {
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
			this.onGround = true;
		}
	}

	//Bottomside canvas collision detection//
	if(this.y+this.height > canvas.height) {
		this.y = canvas.height-this.height;
		this.touched = true;
	}
};