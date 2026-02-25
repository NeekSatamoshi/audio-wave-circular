let radius
let numPoints

let fft
let amplitude

let primaryOrig

let waveform

let circle

let state="START"
let title=""
let titleColor
let mic;

function setup() {
	primaryOrig=color(primary)
	primary=color(primary)
	bg=color(bg)
	secondary=color(secondary)
	titleColor=color(secondary)
	
	createCanvas(windowWidth, windowHeight);
	background(0);
	angleMode(DEGREES);
	
	radius=windowHeight/8
	
	fft=new p5.FFT()
	amplitude=new p5.Amplitude(0.85)
	waveform=[]
	
	numPoints=512
	
	circle=new Circle(radius/2,numPoints)
}

function mousePressed() {
	userStartAudio().then(() => {
		if(!mic) {
			mic = new p5.AudioIn();
			mic.start(() => {
				fft.setInput(mic);
				amplitude.setInput(mic);

				waveform = fft.waveform();
				numPoints = waveform.length;

				circle = new Circle(radius/2, numPoints);

				title = "Microphone";
				titleColor.setAlpha(255);
				state = "PLAYING";
			});
		} else {
			mic.stop();
			title = "Mic stopped";
			titleColor.setAlpha(255);
			state = "START";
		}
	}).catch(e => {
		alert("Unable to start audio: " + e.message);
	});
}

function drawTitle() {
	titleColor.setAlpha(alpha(titleColor)-5)
	push()
	fill(titleColor)
	textSize(100)
	textAlign(CENTER,CENTER)
	text(title, 0, 0, windowWidth, windowHeight)
	pop()
}

function drawStart() {
	push()
	fill(secondary)
	textSize(100)
	textAlign(CENTER,CENTER)
	text("Click to start music / switch song!", windowWidth/2, windowHeight/2)
	pop()
}

function drawPlaying() {
	waveform=fft.waveform()
	ampl=amplitude.getLevel()
	fft.analyze()
	bass=fft.getEnergy("bass")
	
	noStroke()
	
	background(bg)
	
	push()
	
	translate(windowWidth/2,windowHeight/2)
	
	//PULSING CIRCLES
	push()
	fill(lerpColor(bg,primary,map(bass,0,255,0,0.176)))
	ellipse(0,0,map(bass,0,255,0,radius*9))
	pop()
	
	push()
	fill(lerpColor(bg,primary,map(bass,0,255,0,0.130)))
	ellipse(0,0,map(bass,0,255,0,radius*8))
	pop()
	
	push()
	fill(lerpColor(bg,primary,map(bass,0,255,0,0.095)))
	ellipse(0,0,map(bass,0,255,0,radius*7))
	pop()	
	
	push()
	fill(lerpColor(bg,primary,map(bass,0,255,0,0.090)))
	ellipse(0,0,map(bass,0,255,0,radius*6))
	pop()
	
	push()
	fill(lerpColor(bg,primary,map(bass,0,255,0,0.085)))
	ellipse(0,0,map(bass,0,255,0,radius*5))
	pop()
	
	//FPS DISPLAY
/* 	push()
	fill(lerpColor(bg,primary,0.25))
	textSize(50)
	text(floor(1000/deltaTime)+" FPS",10-(windowWidth/2),50-(windowHeight/2))
	pop() */
	
	circle.draw()
	
	pop()
	
	drawTitle()
}

function draw() {
	if(state=="START") {drawPlaying(); drawStart()}
	if(state=="PLAYING") {drawPlaying()}
}