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

		// fundo neutro
		ctx.fillStyle = "#bac1fd"
		ctx.fillRect(-this.r, -this.r, this.r * 2, this.r * 2)

		const colors = [
			"#1733ec",
			"#792cc1",
		]

		let time = millis() * 0.0003

		ctx.globalCompositeOperation = "source-over"
		ctx.filter = "blur(100px)"

		let totalBlobs = 3

		for (let i = 0; i < totalBlobs; i++) {

			let colorIndex = i % colors.length

			let x = (noise(i * 300 + time) - 0.5) * this.r * 2.5
			let y = (noise(i * 400 + time + 100) - 0.5) * this.r * 2.5

			// RAIO MENOR = menos mistura
			let gradient = ctx.createRadialGradient(
				x, y, 0,
				x, y, this.r * 0.7
			)
			
			gradient.addColorStop(0, colors[colorIndex])
			gradient.addColorStop(0.3, colors[colorIndex])
			gradient.addColorStop(1, "transparent")

			ctx.fillStyle = gradient
			ctx.fillRect(-this.r * 2, -this.r * 2, this.r * 4, this.r * 4)
		}
		ctx.filter = "none"

		ctx.restore()
		pop()
	}
}

/* gradient1.addColorStop(0, "#b3edff")
gradient1.addColorStop(0.4, "#99dbff")
gradient1.addColorStop(0.7, "#47ceff")
gradient1.addColorStop(1, "#2a7bbe") */

/* COLORS SET ROXO= [
			ctx.fillStyle = "#00CED1"
			"#8A2BE2",
			"#000080"
		] */