/**
 * @class Círculo principal
 */
class Circle {
	/**
	 * @constructor
	 * @param {number} r Raio do círculo
	 * @param {number} wid Largura do círculo
	 * @param {number} heig Altura do círculo
	 */
	constructor(r, wid, heig) {
		this.r = r;
		this.wid = wid;
		this.heig = heig;
		this.rotation = random(TWO_PI);
		this.time = millis();
		this.pg = createGraphics(this.r * 2, this.r * 2);
		this.pg.pixelDensity(1);
	}

	/**
	 * Função que desenha o círculo e o mesh gradient interno
	 */
	draw() {
		let ctx = drawingContext

		push()
		translate(this.wid, this.heig)

		// máscara do círculo para conter o mesh
		ctx.beginPath()
		ctx.arc(0, 0, this.r, 0, Math.PI * 2)
		ctx.clip()

		ctx.fillStyle = "#87b3d4"

		const colors = [
			"#ffffff",
			"#00a3ff",
			"#006AC5",
		]

		this.rotation += 0.35;

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
		pop()
	}

	/**
	 * Atualiza posição do círculo
	 * @param {number} wid Nova largura do círculo
	 * @param {number} heig Nova altura do círculo
	 */
	windowResized(wid, heig) {
		this.wid = wid
		this.heig = heig
	}
}