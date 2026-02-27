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
let bg = '#006ead'

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

	circle = new Circle(radius, numPoints)
}

function mousePressed() {
	userStartAudio().then(() => {
		if (!mic || state == "START") {
			mic = new p5.AudioIn();
			mic.start(() => {
				fft.setInput(mic);
				amplitude.setInput(mic);

				waveform = fft.waveform();
				numPoints = waveform.length;

				circle = new Circle(radius, numPoints);

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
	waveform = fft.waveform()
	ampl = amplitude.getLevel()
	fft.analyze()
	bass = fft.getEnergy("bass")

	noStroke()

	background(bg)

	push()

	translate(windowWidth / 2, windowHeight / 2)

	//PULSING CIRCLES
	push()
	fill(lerpColor(bg, primary, map(bass, 0, 255, 0, 0.10)))
	ellipse(0, 0, map(bass, 0, 255, 0, radius * 9))
	pop()

	push()
	fill(lerpColor(bg, primary, map(bass, 0, 255, 0, 0.20)))
	ellipse(0, 0, map(bass, 0, 255, 0, radius * 8))
	pop()

	push()
	fill(lerpColor(bg, primary, map(bass, 0, 255, 0, 0.35)))
	ellipse(0, 0, map(bass, 0, 255, 0, radius * 7))
	pop()

	push()
	fill(lerpColor(bg, primary, map(bass, 0, 255, 0, 0.40)))
	ellipse(0, 0, map(bass, 0, 255, 0, radius * 6))
	pop()

	push()
	fill(lerpColor(bg, primary, map(bass, 0, 255, 0, 0.45)))
	ellipse(0, 0, map(bass, 0, 255, 0, radius * 5))
	pop()

	push()
	fill(lerpColor(bg, primary, map(bass, 0, 255, 0, 0.5)))
	ellipse(0, 0, map(bass, 0, 255, 0, radius * 4))
	pop()

	circle.update();
	circle.draw()
	pop()
	drawTitle()
}

function draw() {
	if (state == "START") { drawPlaying(); drawStart() }
	if (state == "PLAYING") { drawPlaying() }
}

//Atualiza o fundo e o desenho Deixando Responsivo
function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
	background(bg)
}