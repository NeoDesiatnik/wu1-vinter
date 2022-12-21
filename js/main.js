let canvas = document.createElement('canvas');
canvas.setAttribute("id", "bg");
//canvas.setAttribute = "id:"
//let canvas = document.getElementById('bg');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

const SNOW_COLOR = "rgba(255,255,255,1)";
const BACKGROUND_COLOR = "#1c0030";

let ctx = canvas.getContext('2d');

let start = null;

let particles = [];
const PI_2 = 2 * Math.PI;

function randomInt(min,max) {
    return Math.floor(Math.random()*(max-min)) + min;
}

let body = document.getElementsByTagName('body')[0];

body.appendChild(canvas);

window.onresize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight; 
}
window.onscroll = () => {
    canvas.setAttribute("style", "top: " + window.pageYOffset + "px");
}


function step(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!start) start = timestamp;
    let progress = timestamp - start;

    particles.forEach(element => {
        element.draw();
    });

    spawnParticles(1);

    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);

const Particle = function(x, y, color)
{
    let particle = {};
    particle.x = x;
    particle.y = y;
    particle.dy = 1 + (Math.random()*2);
    particle.dx = -1 + (Math.random()*2);
    particle.color = SNOW_COLOR;
    particle.size = 2 + Math.floor(Math.random()*2);
    particle.draw = function()
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, PI_2, false);

        ctx.fillStyle = this.color;
        
        ctx.fill();
        particle.update();
    }
    particle.update = function()
    {
      this.y += this.dy;
      this.x += this.dx;
    }

    return particle;
}

function spawnParticles(amount) {
    for(let i = 0; i < amount; i++) {
        particles.push(Particle(randomInt(0, canvas.width), 0, 'rgba(235, 235, 235, 0.8)'));
    }
}

(function() {
	"use strict";

	var canvas = document.querySelector("#tv"),
		context = canvas.getContext("gl") || canvas.getContext("2d"),
		scaleFactor = 2.5, // Noise size
		samples = [],
		sampleIndex = 0,
		scanOffsetY = 0,
		scanSize = 0,
		FPS = 50,
		scanSpeed = FPS * 15, // 15 seconds from top to bottom
		SAMPLE_COUNT = 10;

	window.onresize = function() {
		canvas.width = canvas.offsetWidth / scaleFactor;
		canvas.height = canvas.width / (canvas.offsetWidth / canvas.offsetHeight);
		scanSize = (canvas.offsetHeight / scaleFactor) / 3;

		samples = []
		for(var i = 0; i < SAMPLE_COUNT; i++)
			samples.push(generateRandomSample(context, canvas.width, canvas.height));
	};

	function interpolate(x, x0, y0, x1, y1) {
		return y0 + (y1 - y0)*((x - x0)/(x1 - x0));
	}


	function generateRandomSample(context, w, h) {	
		var intensity = [];
		var random = 0;
		var factor = h / 50;
		var trans = 1 - Math.random() * 0.05;

		var intensityCurve = [];
		for(var i = 0; i < Math.floor(h / factor) + factor; i++)
			intensityCurve.push(Math.floor(Math.random() * 15));

		for(var i = 0; i < h; i++) {
			var value = interpolate((i/factor), Math.floor(i / factor), intensityCurve[Math.floor(i / factor)], Math.floor(i / factor) + 1, intensityCurve[Math.floor(i / factor) + 1]);
			intensity.push(value);
		}

		var imageData = context.createImageData(w, h);
		for(var i = 0; i < (w * h); i++) {
			var k = i * 4;
			var color = Math.floor(36 * Math.random());
			// Optional: add an intensity curve to try to simulate scan lines
			color += intensity[Math.floor(i / w)];
			imageData.data[k] = imageData.data[k + 1] = imageData.data[k + 2] = color;
			imageData.data[k + 3] = Math.round(100 * trans);
		}
		return imageData;
	} 

	function render() {
		context.putImageData(samples[Math.floor(sampleIndex)], 0, 0);

		sampleIndex += 20 / FPS; // 1/FPS == 1 second
		if(sampleIndex >= samples.length) sampleIndex = 0;

		var grd = context.createLinearGradient(0, scanOffsetY, 0, scanSize + scanOffsetY);

		grd.addColorStop(0, 'rgba(0,0,0,0)');
		grd.addColorStop(0.1, 'rgba(0,0,0,0)');
		grd.addColorStop(0.2, 'rgba(0,0,0,0)');
		grd.addColorStop(0.3, 'rgba(0,0,0,0)');
		grd.addColorStop(0.45, 'rgba(0,0,0,0)');
		grd.addColorStop(0.5, 'rgba(0,0,0,0)');
		grd.addColorStop(0.55, 'rgba(0,0,0,0)');
		grd.addColorStop(0.6, 'rgba(0,0,0,0)');
		//grd.addColorStop(0.8, 'rgba(255,255,255,0.15)');
		grd.addColorStop(1, 'rgba(0,0,0,0)');   

		context.fillStyle = grd;
		context.fillRect(0, scanOffsetY, canvas.width, scanSize + scanOffsetY);
		context.globalCompositeOperation = "lighter";

		scanOffsetY += (canvas.height / scanSpeed);
		if(scanOffsetY > canvas.height) scanOffsetY = -(scanSize / 2);

		window.requestAnimationFrame(render);
	}
	window.onresize();
	window.requestAnimationFrame(render);
})();