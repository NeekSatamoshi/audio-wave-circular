let radius;
let fft, amplitude;
let waveform;
let circle;
let state = "START";
let title = "";
let titleColor;
let mic;

let smoothBass = 0;
let threshold = 80
let showTitle = false
let titleAlpha = 0

let circleSize = 0
let circleVelocity = 0
let baseSize

let ripples = []

let ripple1
let ripple2
let ripple3
let ripple4

//main color
let colorRipple = '#ffffff'
//gradient color
let colorText = '#ffffff'

let bgGradient;
let c1
let c2
let c3

let wid, heig;

function createBackground() {
	bgGradient = createGraphics(windowWidth, windowHeight);

	c1 = color('#45A3D7') //esquerda
	c2 = color('#2887BC') //meio
	c3 = color('#206D97') //direita

	let colWidth = bgGradient.width / 3

	bgGradient.noStroke()

	bgGradient.fill(c1)
	bgGradient.rect(0, 0, colWidth, bgGradient.height)

	bgGradient.fill(c2)
	bgGradient.rect(colWidth, 0, colWidth, bgGradient.height)

	bgGradient.fill(c3)
	bgGradient.rect(colWidth * 2, 0, colWidth, bgGradient.height)
}

function setup() {
	createBackground()

	colorRipple = color(colorRipple)
	colorText = color(colorText)
	titleColor = color(colorText)

	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	pixelDensity(1)

	radius = windowHeight / 10

	wid = width / 2
	heig = height / 2.5

	baseSize = radius
	circleSize = baseSize
	circleVelocity = 0

	fft = new p5.FFT(0.8)
	amplitude = new p5.Amplitude(0.5)
	waveform = []

	ripple1 = new LiveRipple(60, 0.4, 0)
	ripple2 = new LiveRipple(120, 0.4, 15)
	ripple3 = new LiveRipple(180, 0.4, 15)
	ripple4 = new LiveRipple(190, 0.4, 18)

	ripples.push(ripple1, ripple2, ripple3, ripple4)

	circle = new Circle(circleSize, wid, heig)
	smoothBass = 0
}

function mousePressed() {
	userStartAudio().then(() => {
		if (state === "START") {
			mic = new p5.AudioIn();
			/* mic.getSources(gotSources) */
			mic.start(() => {
				fft.setInput(mic);
				amplitude.setInput();
				title = "Microphone";
				titleAlpha = 255;
				showTitle = true;
				state = "PLAYING";

				//Mutar e Desmutar o Audio
				mic.connect()
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
	fill(colorText)
	textSize(100)
	textAlign(CENTER, CENTER)
	pop()
}

function drawPlaying() {
	fft.analyze()
	let bass = fft.getEnergy("bass")
	let mid = fft.getEnergy("highMid")
	smoothBass = lerp(smoothBass, bass, 0.08)

	let targetExpansion = map(smoothBass, 0, 255, 0, radius * 0.35)

	
	if (smoothBass > 80) {
		circle.mic = true;
	} else {
		circle.mic = false;
	}

	let force = (baseSize + targetExpansion) - circleSize
	
	circleVelocity += force * 0.05
	circleVelocity *= 0.85
	circleSize += circleVelocity

	circle.r = circleSize

	ripples.forEach(ripple => {
		ripple.update(smoothBass + mid)
		ripple.draw(circle.r)
	})

	circle.draw()

	drawTitle();
}

/**
 * Desenha o background e o círculo inicial, caso no estado "START",
 * e utiliza a função drawPlaying, caso no estado "PLAYING".
 */
function draw() {
	image(bgGradient, 0, 0, width, height)

	if (state == "PLAYING") {
		drawPlaying();
	} else {
		let force = baseSize - circleSize

		circleVelocity += force * 0.05
		circleVelocity *= 0.85
		circleSize += circleVelocity
		circle.r = circleSize

		ripples.forEach(ripple => {
			ripple.update(0)
			ripple.draw(circleSize)
		})

		circle.draw()

		drawTitle()
	}
}

/** 
* Atualiza o fundo e o desenho deixando responsivo 
*/
function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
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
		let rippleColor = color(colorRipple)
		rippleColor.setAlpha(finalAlpha)
		fill(rippleColor)
		ellipse(wid, heig, finalDiameter)
		pop()
	}
}