class Circle {
	constructor(r) {
		this.r = r;
		this.rotation = random(TWO_PI);
		this.mic = false;
		this.time = millis();
		this.pg = createGraphics(this.r * 2, this.r * 2);
		this.pg.pixelDensity(1);
	}

	draw() {
		let ctx = drawingContext

		push()
		translate(width / 2, height / 2)

		ctx.save()

		// máscara circular
		ctx.beginPath()
		ctx.arc(0, 0, this.r, 0, Math.PI * 2)
		ctx.clip()

		// fundo neutro
		ctx.fillStyle = "#7492f3"
		ctx.fillRect(-this.r, -this.r, this.r * 2, this.r * 2)

		const colors = [
			"#0077ff",
			"#47ceff",
			"#b0e1fb",
		]

		if (!this.mic) {
			this.rotation += 0.5;
		}

		let rotation = this.rotation;

		ctx.globalCompositeOperation = "source-over"
		ctx.filter = "blur(35px)"

		let totalBlobs = 6;


		for (let i = 1; i <= totalBlobs; i++) {
			let angle = rotation + i * (360 / totalBlobs)

			let radius = this.r * 0.60

			let x = cos(angle) * radius
			let y = sin(angle) * radius

			let gradient = ctx.createRadialGradient(
				x, y, 0,
				x, y, this.r / 2
			)

			let colorIndex = (i - 1) % colors.length

			gradient.addColorStop(0, colors[colorIndex])
			gradient.addColorStop(1, colors[colorIndex])
			gradient.addColorStop(1, "transparent")

			noStroke()
			ctx.fillStyle = gradient
			ctx.fillRect(-this.r * 2, -this.r * 2, this.r * 4, this.r * 4)
		}

		ctx.filter = "none"

		ctx.restore()
		pop()
	}
}