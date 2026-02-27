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
let bg = '#246897'

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
	
	circle = new Circle(radius, numPoints, windowWidth/2, windowHeight/2);
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

	background(bg)

	let centerX = windowWidth / 2
	let centerY = windowHeight / 2

	noStroke()

	push()
	fill(lerpColor(bg, primary, map(bass, 0, 255, 0, 0.10)))
	ellipse(centerX, centerY, map(bass, 0, 255, 0, radius * 9))
	pop()

	push()
	fill(lerpColor(bg, primary, map(bass, 0, 255, 0, 0.20)))
	ellipse(centerX, centerY, map(bass, 0, 255, 0, radius * 8))
	pop()

	push()
	fill(lerpColor(bg, primary, map(bass, 0, 255, 0, 0.35)))
	ellipse(centerX, centerY, map(bass, 0, 255, 0, radius * 7))
	pop()

	push()
	fill(lerpColor(bg, primary, map(bass, 0, 255, 0, 0.40)))
	ellipse(centerX, centerY, map(bass, 0, 255, 0, radius * 6))
	pop()

	push()
	fill(lerpColor(bg, primary, map(bass, 0, 255, 0, 0.45)))
	ellipse(centerX, centerY, map(bass, 0, 255, 0, radius * 5))
	pop()

	push()
	fill(lerpColor(bg, primary, map(bass, 0, 255, 0, 0.5)))
	ellipse(centerX, centerY, map(bass, 0, 255, 0, radius * 4))
	pop()

	circle.update()
	circle.draw()

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