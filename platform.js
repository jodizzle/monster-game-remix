//Platform definitions//
function Platform(x,y,width,height,color) {
	this.x = x; this.y = y; this.width = width; this.height = height; this.color = color;
	this.removeNow = false;
}
Platform.prototype.draw = function(){
	context.fillStyle = this.color;
 	context.fillRect(this.x,this.y,this.width,this.height);
}
Platform.prototype.update = function(){
	this.x += platformScrollSpeed;
}