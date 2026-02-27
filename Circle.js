class Circle {
	width = windowWidth / 20000;
	height = windowHeight / 20000;
	constructor(r, n, x, y) {
		this.r = r
		this.n = n

		this.pos = createVector(x, y);
		this.vel = p5.Vector.random2D().mult(random(2, 5));
	}

	update() {
		this.pos.add(this.vel);
		if (this.pos.x > this.width) {
			this.vel.x *= -1;
			this.pos.x = this.width;
		} else if (this.pos.x < 0) {
			this.vel.x *= -1;
			this.pos.x = 0;
		}
		if (this.pos.y > this.height) {
			this.vel.y *= -1;
			this.pos.y = this.height;
		} else if (this.pos.y < 0) {
			this.vel.y *= -1;
			this.pos.y = 0;
		}
	}

	draw() {
		const colors = [
			"#ffffff",
			"#c7ebff",
			"#47ceff",
			"#2a7bbe",
		]

		let ctx = drawingContext;
		const grad = ctx.createRadialGradient(this.pos.x, this.pos.y, 10, this.pos.x, this.pos.y, 150,);
		grad.addColorStop(0.25, colors[0]);
		grad.addColorStop(0.5, colors[1]);
		grad.addColorStop(0.75, colors[2]);
		grad.addColorStop(1, colors[3]);

		push()
		noStroke()
		ctx.fillStyle = grad;
		ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2)
		pop()


		// Dependant circle
		/* push()
		beginShape()
		
		//Escolha: Circulo transparente ou Preenchido
		let warmth = lerpColor(bg, primary, map(ampl, 0, 1, 0, 1.5))
		fill(lerpColor(bg, warmth, map(ampl, 0, 1, 0, 0.5)))
		
		stroke(lerpColor(primary, secondary, ampl))
		strokeWeight(0)
		fill("#f00ff0")
		
		this.LCoords = this.LCoords.reverse()
		
		this.LCoords.forEach((point, i) => {
			curveVertex(point["x"], point["y"])
			})
			
			this.RCoords.forEach(point => {
				curveVertex(point["x"], point["y"])
				}) 
				endShape(CLOSE)
				pop() */
	}

	getPastelColor() {
		const colors = [
			"#ffffff",
			"#c7ebff",
			"#47ceff",
			"#2a7bbe",
		]

		const randomIndex = Math.floor(Math.random() * colors.length);
		const randomcolors = colors[randomIndex];

	}
}
