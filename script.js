let radius
let numPoints
let fft, amplitude
let primaryOrig
let waveform
let circle
let state = "START"
let title = ""
let titleColor
let mic;

//main color
let primary = '#ffffff'
//gradient color
let secondary = '#ffffff'
//background
let bg = '#596975'

function setup() {
	primaryOrig = color(primary)
	primary = color(primary)
	bg = color(bg)
	secondary = color(secondary)
	titleColor = color(secondary)

	createCanvas(windowWidth, windowHeight);
	background(0);
	angleMode(DEGREES);

	radius = windowHeight / 6

	fft = new p5.FFT()

	amplitude = new p5.Amplitude(0.99)

	waveform = []

	numPoints = 512

	circle = new Circle(radius);
}

function mousePressed() {
	userStartAudio();

	if (state === "START") {

		if (!mic) {
			mic = new p5.AudioIn();
		}

		mic.start();

		fft.setInput(mic);
		amplitude.setInput(mic);

		title = "Microfone";
		titleColor.setAlpha(255);
		state = "PLAYING";

	} else {

		if (mic) {
			mic.stop();
		}

		title = "Stopped";
		titleColor.setAlpha(255);
		state = "START";
	}
}

function drawTitle() {
	let currentAlpha = alpha(titleColor);
	if (currentAlpha > 0) {
		titleColor.setAlpha(currentAlpha - 5);
	}
	push();
	fill(titleColor);
	textSize(100);
	textAlign(CENTER, CENTER);
	text(title, 0, 0, width, height);
	pop();
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

	background(bg)

	noStroke()

	let level = amplitude.getLevel()
	fft.analyze()
	let bass = fft.getEnergy("bass")

	circle.update(level, bass)
	circle.draw(level, bass)

	drawTitle()
}

function draw() {
	background(bg)

	if (state === "PLAYING") {

		let level = amplitude.getLevel()
		fft.analyze()
		let bass = fft.getEnergy("bass")

		circle.update(level, bass)
		circle.draw(level, bass)

	} else {

		circle.update(0, 0)
		circle.draw(0, 0)
	}

	drawTitle() // sempre desenha o título por último
}

//Atualiza o fundo e o desenho Deixando Responsivo
function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
	background(bg)
}