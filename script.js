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
let titleAlpha = 0

let circleSize = 0
let circleVelocity = 0
let baseSize

let ripple1
let ripple2

//main color
let primary = '#61aae5'
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
	angleMode(DEGREES);
	pixelDensity(1)

	radius = windowHeight / 6

	baseSize = radius
	circleSize = baseSize
	circleVelocity = 0

	fft = new p5.FFT(0.8)
	amplitude = new p5.Amplitude(0.5)
	waveform = []

	ripple1 = new LiveRipple(80, 0.2, 0)
	ripple2 = new LiveRipple(160, 0.1, 10)

	circle = new Circle(circleSize)
	smoothBass = 0
}

function mousePressed() {
	userStartAudio().then(() => {
		if (state === "START") {
			mic = new p5.AudioIn();
			mic.start(() => {
				fft.setInput(mic);
				amplitude.setInput(mic);
				title = "Microphone";
				titleAlpha = 255;
				showTitle = true;
				state = "PLAYING";
			});

		} else if (state === "PLAYING") {
			mic.stop();
			title = "Stopped";
			titleAlpha = 255;
			showTitle = true;
			state = "START";
		}
	}).catch(e => {
		alert("Unable to start audio: " + e.message);
	});
}

function drawTitle() {
	if (!showTitle) return;

	push()
	noStroke()
	titleColor.setAlpha(titleAlpha)
	fill(titleColor)
	textSize(100)
	textAlign(CENTER, CENTER)
	text(title, 0, 0, windowWidth, windowHeight)
	pop()

	titleAlpha -= 4;

	if (titleAlpha <= 0) {
		titleAlpha = 0;
		showTitle = false;
	}
}

function drawStart() {
	push()
	fill(secondary)
	textSize(100)
	textAlign(CENTER, CENTER)
	pop()
}

function drawPlaying() {
	fft.analyze()
	let bass = fft.getEnergy("bass")
	smoothBass = lerp(smoothBass, bass, 0.08)

	let targetExpansion = map(smoothBass, 0, 255, 0, radius * 0.35)

	let force = (baseSize + targetExpansion) - circleSize

	circleVelocity += force * 0.08
	circleVelocity *= 0.88
	circleSize += circleVelocity

	circle.r = circleSize

	ripple1.update(smoothBass)
	ripple2.update(smoothBass)

	ripple1.draw(circle.r)
	ripple2.draw(circle.r)
	circle.draw()

	drawTitle();
}

function draw() {
	background(bg);

	if (state == "PLAYING") {
		drawPlaying();
	} else {
		let force = baseSize - circleSize

		circleVelocity += force * 0.05
		circleVelocity *= 0.85
		circleSize += circleVelocity
		circle.r = circleSize

		ripple1.update(0)
		ripple2.update(0)

		circle.draw()
		ripple1.draw(circleSize)
		ripple2.draw(circleSize)

		drawTitle()
	}
}

//Atualiza o fundo e o desenho Deixando Responsivo
function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
	background(bg)
}

class LiveRipple {

	constructor(maxOffset, transparency, releaseDelay = 0) {
		this.offset = 0
		this.velocity = 0
		this.maxOffset = maxOffset

		this.alpha = 0
		this.alphaVelocity = 0
		this.transparency = transparency

		this.smoothedAudio = 0
		this.previousAudio = 0

		this.releaseDelay = releaseDelay
		this.releaseCounter = 0
	}

	update(audioForce) {
		this.smoothedAudio = lerp(this.smoothedAudio, audioForce, 0.15)

		let effectiveAudio = this.smoothedAudio

		if (this.smoothedAudio < this.previousAudio) {
			if (this.releaseCounter < this.releaseDelay) {
				this.releaseCounter++
				effectiveAudio = this.previousAudio
			}
		} else {
			this.releaseCounter = 0
		}
		this.previousAudio = effectiveAudio

		let targetOffset = map(effectiveAudio, 0, 255, 0, this.maxOffset)
		let force = targetOffset - this.offset

		this.velocity += force * 0.08
		this.velocity *= 0.85
		this.offset += this.velocity

		let targetAlpha = map(effectiveAudio, 0, 60, 0, 180, true)

		let alphaForce = targetAlpha - this.alpha
		this.alphaVelocity += alphaForce * 0.1
		this.alphaVelocity *= 0.8
		this.alpha += this.alphaVelocity
	}

	draw(circleRadius) {
		if (this.alpha <= 1) return

		push()

		let finalDiameter = (circleRadius + this.offset) * 2
		let finalAlpha = this.alpha * this.transparency

		noStroke()
		let rippleColor = color(primary)
		rippleColor.setAlpha(finalAlpha)
		fill(rippleColor)
		ellipse(width / 2, height / 2, finalDiameter)
		pop()
	}
}