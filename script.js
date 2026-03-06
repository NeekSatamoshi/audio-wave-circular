let radius;
let fft, amplitude;
let waveform;
let circle;
let state = "START";
let title = "";
let titleColor;
let mic;

let smoothBass = 0;

let circleSize = 0
let circleVelocity = 0
let baseSize

//main color
let primary = "#93e4fc"
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

	baseSize = radius
	circleSize = baseSize
	circleVelocity = 0

	fft = new p5.FFT(0.8)
	amplitude = new p5.Amplitude(0.5)
	waveform = []

	circle = new Circle(circleSize);

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
				state = "PLAYING";
			});
		} if (state == 'PLAYING') {
			mic.stop();
			title = "Stopped"
			titleColor.setAlpha(255);
			state = "START";
		}
	}).catch(e => {
		alert("Unable to start audio: " + e.message);
	});
}

function drawTitle() {
	titleColor.setAlpha(alpha(titleColor) - 5)
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
	fft.analyze()
	waveform = fft.waveform()
	ampl = amplitude.getLevel()
	bass = fft.getEnergy("bass")

	// subida "rápida" e descida suave
	if (bass > smoothBass) {
		smoothBass = lerp(smoothBass, bass, 0.10)
	} else {
		smoothBass = lerp(smoothBass, bass, 0.04)
	}

	background(bg)

	let centerX = windowWidth / 2
	let centerY = windowHeight / 2

	noStroke()

	// ondas suaves
	let layers = 20;
	let maxRadius = radius * 6;
	let minRadius = radius * 4;

	for (let i = 0; i < layers; i++) {
		let t = i / (layers - 1);
		let eased = t * t * (3.2 - 2 * t)

		let r = lerp(maxRadius, minRadius, t);
		let alpha = lerp(0.03, 0.28, eased);
		let c = lerpColor(bg, primary, alpha)
		c.setAlpha(lerp(5, 60, eased));
		fill(c);

		ellipse(centerX, centerY, map(smoothBass, 0, 255, 0, r))
	}

	let targetExpansion = map(smoothBass, 0, 255, 0, radius * 0.1)

	let force = (baseSize + targetExpansion) - circleSize

	circleVelocity += force * 0.08
	circleVelocity *= 0.88
	circleSize += circleVelocity

	circle.r = circleSize

	circle.draw()

	drawTitle()
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