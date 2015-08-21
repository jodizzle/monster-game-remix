console.log('loaded')

var canvas = document.getElementById('test');
var context = canvas.getContext('2d');
var raf;

var leftPressed = false
var rightPressed = false

var square = {
	x: 10,
	y: 10,
	vx: 0,
	vy: 0,
	color: 'red',
	draw: function() {
		context.fillStyle = this.color;
		context.fillRect(this.x,this.y,50,50);
	}
};

function draw() {
	//console.log('drawing')
	context.clearRect(0,0,canvas.width,canvas.height);
	//context.save();
	square.draw()
	square.x += square.vx;
	square.y += square.vy;
	raf = window.requestAnimationFrame(draw);
}

window.addEventListener('keydown',function(e) {
	//raf = window.requestAnimationFrame(draw);
	switch (e.which) {
		case 37:
			square.vx = -5;
			leftPressed = true;
			console.log('left');
			break;
		case 38:
			square.vy = -5;
			console.log('up');
			break;
		case 39:
			square.vx = 5;
			rightPressed = true;
			console.log('right');
			break;
		case 40:
			square.vy = 5;
			console.log('down');
			break;
	}
});

window.addEventListener('keyup',function(e){
	//window.cancelAnimationFrame(raf);
	// console.log('keyup')
	// if (e == 37 || e == 39) {
	// 	square.vx = 0;
	// 	console.log('stop horizontal');
	// }
	// if (e == 38 || e == 40) {
	// 	square.vy = 0;
	// 	console.log('stop vertical');
	// }
	// horizOff = false;
	// vertOff = false;
	switch (e.which) {
		case 37:
			if(rightPressed) {
				square.vx = 5;
			}
			else {
				square.vx = 0;
			}
			//horizOff = true;
			leftPressed = false;
			console.log('left');
			break;
		case 38:
			square.vy = 0;
			//vertOff = true;
			console.log('up');
			break;
		case 39:
			if(leftPressed) {
				square.vx = -5;
			}
			else {
				square.vx = 0;
			}
			rightPressed = false;
			square.vx = 0;
			//horizOff = true;
			console.log('right');
			break;
		case 40:
			square.vy = 0;
			//vertOff = true;
			console.log('down');
			break;
	}


	// //doesnt seem to fix much...
	// if(horizOff) {
	// 	console.log('horizontal off');
	// 	square.vx = 0;
	// }
	// if(vertOff) {
	// 	console.log('vertical off');
	// 	square.vy = 0;
	// }
});

function init() {
	draw();
}

init();