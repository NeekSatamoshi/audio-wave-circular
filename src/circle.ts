import type p5 from "p5";

export default class Circle {
  private p: p5;
  private radius: number;
  private width: number;
  private height: number;
  private rotation: number;
  private mic: boolean;
  private pg: p5.Graphics;

  constructor(p: p5, radius: number, width: number, height: number) {
    this.p = p;
    this.radius = radius;
    this.width = width;
    this.height = height;

    this.rotation = p.random(p.TWO_PI);
    this.mic = false;

    this.pg = p.createGraphics(this.radius * 2, this.radius * 2);
    this.pg.pixelDensity(1);
  }

  setMic(mic: boolean) {
    this.mic = mic;
  }

  updateRadius(radius: number) {
    this.radius = radius;
  }

  draw() {
    const p = this.p;
    const ctx = p.drawingContext as CanvasRenderingContext2D;

    if (!this.mic) {
      this.rotation += 1;
    }

    p.push();
    p.translate(this.width, this.height);

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.clip();

    const colors = ["#ffffff", "#00a3ff", "#006AC5"];

    let totalBlobs = 6;

    ctx.globalCompositeOperation = "source-over";
    ctx.filter = "blur(35px)";

    for (let i = 1; i <= totalBlobs; i++) {
      let angle = this.rotation + i * (360 / totalBlobs);

      let rad = this.radius * 0.6;

      let x = p.cos(angle) * rad;
      let y = p.sin(angle) * rad;

      let gradient = ctx.createRadialGradient(x, y, 0, x, y, this.radius / 2);

      let colorIndex = (i - 1) % colors.length;

      gradient.addColorStop(0, colors[colorIndex]);
      gradient.addColorStop(1, colors[colorIndex]);
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.fillRect(-this.radius * 2, -this.radius * 2, this.radius * 4, this.radius * 4);
    }

    p.pop();
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
