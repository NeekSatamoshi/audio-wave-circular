class Circle {
	constructor(r, n) {
		this.r = r
		this.n = n
		this.offset = 0
	}

	update() {
		this.offset += 1.0   // velocidade da animação
	}

	draw() {
		let ctx = drawingContext
		
		let centerX = windowWidth / 2
		let centerY = windowHeight / 2

		// movimento interno do gradiente (orbital)
		let gradientX = centerX + cos(this.offset) * this.r * 0.4
		let gradientY = centerY + sin(this.offset) * this.r * 0.4

		let gradient = ctx.createRadialGradient(
			gradientX,
			gradientY,
			this.r * 0.1,
			centerX,
			centerY,
			this.r
		)

		gradient.addColorStop(0, "#b3edff")
		gradient.addColorStop(0.4, "#99dbff")
		gradient.addColorStop(0.7, "#47ceff")
		gradient.addColorStop(1, "#2a7bbe")

		ctx.fillStyle = gradient

		noStroke()
		ellipse(centerX, centerY, this.r * 2)
	}
}