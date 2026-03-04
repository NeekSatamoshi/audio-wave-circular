let radius;
let fft, amplitude;
let waveform;
let circle;
let state = "START";
let title = "";
let titleColor;
let mic;

let smoothBass = 0;
let ripples = []
let threshold = 80
let lastRippleTime = 0
let rippleDelay = 250
let showTitle = false

//main color
let primary = '#ffffff'
//gradient color
let secondary = '#ffffff'
//background
let bg = '#596975'

function setup() {
	primary = color(primary)
	bg = color(bg)
	secondary = color(secondary)
	titleColor = color(secondary)

	createCanvas(windowWidth, windowHeight);
	background(0);
	angleMode(DEGREES);

	radius = windowHeight / 6

	fft = new p5.FFT(0.8)
	amplitude = new p5.Amplitude(0.5)
	waveform = []

	circle = new Circle(radius);

	smoothBass = 0
	pixelDensity(1)
}

function mousePressed() {
	userStartAudio().then(() => {
		if (!mic || state == "START") {
			mic = new p5.AudioIn();
			mic.start(() => {
				fft.setInput(mic);
				amplitude.setInput(mic);

				waveform = fft.waveform();

				title = "Microphone";
				titleColor.setAlpha(255);
				showTitle = true;
				state = "PLAYING";
			});
		} if (state == 'PLAYING') {
			mic.stop();
			title = "Stopped";
			titleColor.setAlpha(255);
			showTitle = true;
			state = "START";
		}
	}).catch(e => {
		alert("Unable to start audio: " + e.message);
	});
}

function drawTitle() {

	if(!showTitle) return;

	titleColor.setAlpha(alpha(titleColor) - 5)

	if (alpha(titleColor) <= 0) {
		showTitle = false
		return
	}

	push()
	fill(titleColor)
	textSize(100)
	textAlign(CENTER, CENTER)
	text(title, 0, 0, windowWidth, windowHeight)
	pop()
}

function drawStart() {
	push()
	fill(secondary)
	textSize(100)
	textAlign(CENTER, CENTER)
	pop()
}

function drawPlaying() {
	waveform = fft.waveform()
	ampl = amplitude.getLevel()
	fft.analyze()
	bass = fft.getEnergy("bass")

	smoothBass = lerp(smoothBass, bass, 0.04)

	background(bg)

	let centerX = windowWidth / 2
	let centerY = windowHeight / 2

	noStroke()

	if (smoothBass > threshold && millis() - lastRippleTime > rippleDelay) {
		// console.log("Criando ripple");
		ripples.push(new Ripple(centerX, centerY, radius * 4))
		lastRippleTime = millis()
	}

	for (let i = ripples.length - 1; i >= 0; i--) {
		ripples[i].draw()
		ripples[i].update()

		if (ripples[i].isDead()) {
			ripples.splice(i, 1)
		}
	}

	for (let i = ripples.length - 1; i >= 0; i--) {
		ripples[i].draw()
		ripples[i].update()

		if (ripples[i].isDead()) {
			ripples.splice(i, 1)
		}
	}

	circle.draw()
	drawTitle();
}

function draw() {
	if (state == "START") { drawPlaying(); drawStart(); }
	if (state == "PLAYING") { drawPlaying(); }
}

//Atualiza o fundo e o desenho Deixando Responsivo
function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
	background(bg)
}

class Ripple {
	constructor(x, y, maxR) {
		this.x = x
		this.y = y
		this.r = 0
		this.maxR = maxR
		this.speed = 5
		this.alpha = 180
	}

	update() {
		this.r += this.speed

		// fade suave proporcional ao tamanho
		this.alpha = map(this.r, 0, this.maxR, 180, 0)
	}

	draw() {
		noFill()
		stroke(red(primary), green(primary), blue(primary), this.alpha * 0.6)
		strokeWeight(2)
		ellipse(this.x, this.y, this.r)
	}

	isDead() {
		return this.r > this.maxR
	}
}