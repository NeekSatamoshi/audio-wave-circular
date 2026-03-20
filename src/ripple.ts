import type p5 from "p5";

export default class Ripple {
  private p: p5;

  private colorRipple: p5.Color;

  private offset: number;
  private velocity: number;
  private maxOffset: number;

  private alpha: number;
  private alphaVelocity: number;
  private transparency: number;

  private smoothedAudio: number;
  private previousAudio: number;

  private releaseDelay: number;
  private releaseCounter: number;

  constructor(p: p5, maxOffset: number, releaseDelay: number, colorRipple: p5.Color, transparency: number = 0.4) {
    this.p = p;

    this.colorRipple = colorRipple;

    this.offset = 0;
    this.velocity = 0;
    this.maxOffset = maxOffset;

    this.alpha = 0;
    this.alphaVelocity = 0;
    this.transparency = transparency;

    this.smoothedAudio = 0;
    this.previousAudio = 0;

    this.releaseDelay = releaseDelay;
    this.releaseCounter = 0;
  }

  update(audioForce: number) {
    const p = this.p;

    this.smoothedAudio = p.lerp(this.smoothedAudio, audioForce, 0.15);

    let effectiveAudio = this.smoothedAudio;

    if (this.smoothedAudio < this.previousAudio) {
      if (this.releaseCounter < this.releaseDelay) {
        this.releaseCounter++;
        effectiveAudio = this.previousAudio;
      }
    } else {
      this.releaseCounter = 0;
    }

    this.previousAudio = effectiveAudio;

    let targetOffset = p.map(effectiveAudio, 0, 255, 0, this.maxOffset);
    let force = targetOffset - this.offset;

    this.velocity += force * 0.05;
    this.velocity *= 0.8;
    this.offset += this.velocity;

    let targetAlpha = p.map(effectiveAudio, 0, 60, 0, 180, true);

    let alphaForce = targetAlpha - this.alpha;
    this.alphaVelocity += alphaForce * 0.1;
    this.alphaVelocity *= 0.8;
    this.alpha += this.alphaVelocity;
  }

  draw(circleRadius: number, width: number, height: number) {
    const p = this.p;

    if (this.alpha <= 1) return;

    p.push();

    let finalDiameter = (circleRadius + this.offset) * 2;
    let finalAlpha = this.alpha * this.transparency;

    p.noStroke();
    this.colorRipple.setAlpha(finalAlpha);
    p.fill(this.colorRipple);
    p.ellipse(width, height, finalDiameter);
    p.pop();
  }
}
