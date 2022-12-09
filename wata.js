var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

c.width  = window.innerWidth;
c.height = window.innerHeight;

document.onmousemove = function(e) {
	var event = e || window.event;
	window.mouseX = event.clientX;
	window.mouseY = event.clientY;
}

window.mouseX = 0;
window.mouseY = 0;
wasMouseAboveWater = null;
previousMouseY = 0;

points = [];
speeds = [];
var pointSpacing = 10;
var edgeCount = Math.round(c.width/pointSpacing -1);
pointSpacing = c.width/edgeCount;

for (i = 0; i < c.width; i += pointSpacing) {
	points.push(0);
	speeds.push(0);
}

function getWavy() {
	updateWater();
	drawWater();
}

function updateWater() {
	isMouseAboveWater = window.mouseY > (c.height/2);
	if (isMouseAboveWater != wasMouseAboveWater) {
		pointIndex = Math.round(window.mouseX / pointSpacing);
		if (pointIndex < 0) {
			pointIndex = 0;
		}
		if (pointIndex > points.length - 1) {
			pointIndex = points.length -1;
		}
		speeds[pointIndex] += (window.mouseY - previousMouseY) * .5;
	}
	wasMouseAboveWater = isMouseAboveWater;
	previousMouseY = window.mouseY;

	for (i = 0; i < points.length -1; i++) {
		point = points[i];
		speed = speeds[i];
		nextSpeed = speeds[i+1];
		nextPoint = points[i+1];
		positionDif = (nextPoint - point);
		speeds[i] += positionDif * .03;
		speeds[i+1] -= positionDif * .03;
		speedDif = (nextSpeed - speed);
		speeds[i] += speedDif * .1;
		speeds[i+1] -= speedDif * .1;
	}

	for (i = 0; i < points.length; i++) {
		points[i] += speeds[i];
		speeds[i] += points[i] * -.01;
		speeds[i] *= .99;
	}
}

function drawWater() {
	ctx.fillStyle = "#FBCD20";
	ctx.fillRect(0, 0, c.width, c.height);
	ctx.beginPath();
	ctx.moveTo(0, c.height);
	for (i = 0; i < points.length; i++) {
		ctx.lineTo(pointSpacing * i, c.height/2 + points[i]);
	}
	ctx.lineTo(c.width, c.height);
	ctx.closePath();
	ctx.fillStyle = "#FF5D77";
	ctx.fill();
}

setInterval(getWavy, 16);
