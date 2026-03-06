class Circle {
	constructor(r) {
		this.baseRadius = r

		this.outerRadius = r
		this.innerRadius = r

		this.smoothedLevel = 0
		this.smoothedBass = 0

		this.colors = [
			"#4facfe",
			"#7367f0",
			"#00f2fe",
			"#a18cd1"
		]

		this.points = []

		for (let i = 0; i < 4; i++) {
			this.points.push({
				offsetX: random(1000),
				offsetY: random(1000),
				baseSpeed: random(0.002, 0.004),
				speed: 0
			})
		}
	}

	update(level = 0, bass = 0) {
		this.smoothedLevel = lerp(this.smoothedLevel, level, 0.12)
		this.smoothedBass = lerp(this.smoothedBass, bass, 0.12)

		let outerPulse = map(this.smoothedBass, 0, 80, 0, this.baseRadius * 0.04, true)
		this.outerRadius = lerp(this.outerRadius, this.baseRadius + outerPulse, 0.15)

		let innerPulse = map(this.smoothedBass, 0, 80, 0, this.baseRadius * 0.10, true)
		this.innerRadius = lerp(this.innerRadius, this.baseRadius + innerPulse, 0.15)

		this.points.forEach(p => {
			let speedBoost = map(this.smoothedLevel, 0, 0.3, 0, 0.002, true)
			p.speed = p.baseSpeed + speedBoost
			p.offsetX += p.speed
			p.offsetY += p.speed
		})
	}

	draw() {

		let ctx = drawingContext

		this.centerX = width / 2
		this.centerY = height / 2

		noStroke()
		fill("#0c1b22")
		ellipse(this.centerX, this.centerY, this.outerRadius * 2)

		ctx.save()
		ctx.globalCompositeOperation = "lighter"

		let blurAmount = map(this.smoothedLevel, 0, 0.3, 10, 18, true)
		ctx.filter = `blur(${blurAmount}px)`

		let intensityBoost = map(this.smoothedLevel, 0, 0.3, 0, 40, true)

		// ✨ INTERNO
		for (let i = 0; i < this.points.length; i++) {

			let p = this.points[i]

			let x = this.centerX + (noise(p.offsetX) - 0.5) * this.innerRadius * 1.3
			let y = this.centerY + (noise(p.offsetY) - 0.5) * this.innerRadius * 1.3

			let baseColor = color(this.colors[i])
			let r = red(baseColor)
			let g = green(baseColor)
			let b = blue(baseColor) + intensityBoost

			let gradient = ctx.createRadialGradient(
				x, y, 0,
				x, y, this.innerRadius
			)

			gradient.addColorStop(0, `rgba(${r},${g},${b},1)`)
			gradient.addColorStop(0.4, `rgba(${r},${g},${b},0.9)`)
			gradient.addColorStop(1, "rgba(0,0,0,0)")

			ctx.fillStyle = gradient
			ctx.beginPath()
			ctx.arc(this.centerX, this.centerY, this.innerRadius, 0, TWO_PI)
			ctx.fill()
		}

		ctx.restore()

		// núcleo
		ctx.save()
		ctx.globalCompositeOperation = "lighter"

		let coreIntensity = map(this.smoothedBass, 0, 80, 0.15, 0.4, true)

		let highlight = ctx.createRadialGradient(
			this.centerX,
			this.centerY,
			0,
			this.centerX,
			this.centerY,
			this.innerRadius
		)

		highlight.addColorStop(0, `rgba(255,255,255,${coreIntensity})`)
		highlight.addColorStop(1, "rgba(255,255,255,0)")

		ctx.fillStyle = highlight
		ctx.beginPath()
		ctx.arc(this.centerX, this.centerY, this.innerRadius, 0, TWO_PI)
		ctx.fill()

		ctx.restore()
	}
}