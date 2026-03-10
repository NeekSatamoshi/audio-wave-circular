class Circle {
	constructor(r) {
		this.r = r
		this.t = random(1000);
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

		// fundo
		ctx.fillStyle = "#0048ff"
		ctx.fillRect(-this.r, -this.r, this.r * 2, this.r * 2)

		const colors = [
			"#fb00ff",
			"#00ffc3",
			"#c800ff",
			"#00a2ff",
		]

		let time = millis() * 0.0003

		ctx.globalCompositeOperation = "lighter"

		ctx.filter = "blur(70px) saturate(100%) brightness(30%)"

		let totalBlobs = 4

		for (let i = 0; i < totalBlobs; i++) {

			let colorIndex = i % colors.length

			let x = (noise(i * 300 + time) - 0.5) * this.r * 2.5
			let y = (noise(i * 400 + time + 100) - 0.5) * this.r * 2.5

			let gradient = ctx.createRadialGradient(
				x, y, 0,
				x, y, this.r * 1.1
			)

			gradient.addColorStop(0, colors[colorIndex])
			gradient.addColorStop(1, colors[colorIndex])
			gradient.addColorStop(1, "transparent")

			ctx.fillStyle = gradient
			ctx.fillRect(-this.r * 2, -this.r * 2, this.r * 4, this.r * 4)
		}

		ctx.filter = "none"
		ctx.globalCompositeOperation = "source-over"

		ctx.restore()
		pop()
	}
}