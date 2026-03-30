// Sound vars
let mic;
let smoothBass = 0;
let threshold = 80

// Circle vars
let radius;
let fft, amplitude;
let waveform;
let circle;
let circleSize = 0
let circleVelocity = 0

// Ripple vars
let ripples = []
let ripple1
let ripple2
let ripple3
let ripple4
let colorRipple = '#ffffff'

let wid, heig;

/**
 * Função para criar o background com as três colunas
 */
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

/**
 * Função para definir o que será usado futuramente, como cores,
 * tamanhos, objetos, entre outros.
 */
function setup() {
	colorRipple = color(colorRipple)
	
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
	pixelDensity(1)
	
	createBackground()

	body = loadImage("./img/corpo_mula.png")

	radius = windowHeight / 12.8
	wid = windowWidth / 2
	heig = windowHeight / 2.5

	circleSize = radius
	circleVelocity = 0

	fft = new p5.FFT(0.8)
	amplitude = new p5.Amplitude(0.5)
	waveform = []

	ripple1 = new LiveRipple(60, 0.4, 0)
	ripple2 = new LiveRipple(100, 0.4, 3)
	ripple3 = new LiveRipple(140, 0.4, 6)
	ripple4 = new LiveRipple(150, 0.4, 9)

/* 	ripple1 = new LiveRipple(90, 0.4, 0)
	ripple2 = new LiveRipple(150, 0.4, 3)
	ripple3 = new LiveRipple(210, 0.4, 6)
	ripple4 = new LiveRipple(230, 0.4, 9) */

	ripples.push(ripple1, ripple2, ripple3, ripple4)

	circle = new Circle(circleSize, wid, heig)
	smoothBass = 0

	userStartAudio();
	mic = new p5.AudioIn();
	mic.start(() => {
		fft.setInput(mic);
		amplitude.setInput();

		//Mutar e Desmutar o Audio
		mic.connect()
	});
}


/**
 * Função que desenha o background, círculo e calcula a força do áudio para desenhar as ondas e a expansão do círculo.
 */
function draw() {
	image(bgGradient, 0, 0, windowWidth, windowHeight)
	
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
	
	let force = (radius + targetExpansion) - circleSize
	
	circleVelocity += force * 0.05
	circleVelocity *= 0.85
	circleSize += circleVelocity
	
	circle.r = circleSize

	push()

	imageMode(CENTER);

	let base = min(windowWidth, windowHeight);
	let imgWidth = radius * 4.5;
	let imgHeight = imgWidth * (body.height / body.width);
	

	image(body, wid, heig * 1.12, imgWidth, imgHeight);
	pop()
	
	ripples.forEach(ripple => {
		ripple.update(smoothBass + mid)
		ripple.draw(circle.r)
	})
	
	circle.draw()
}

/** 
* Atualiza o fundo e o desenho deixando responsivo 
*/
function windowResized() {
	resizeCanvas(windowWidth, windowHeight)

	wid = windowWidth / 2
	heig = windowHeight / 2.5

	radius = windowHeight / 12.8
	baseRadius = radius;

	circle.windowResized(wid, heig)
}