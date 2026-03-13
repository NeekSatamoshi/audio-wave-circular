/**
 * @class
 * Classe das ondas de áudio, com as funções para desenhar e atualizá-las.
 */
class LiveRipple {

    /**
     * @constructor
     * @param {number} maxOffset Distância máxima que a onda pode ir
     * @param {number} transparency Transparência da onda
     * @param {number} releaseDelay Delay de movimentação da onda
     */
    constructor(maxOffset, transparency, releaseDelay = 0) {
        this.offset = 0
        this.velocity = 0
        this.maxOffset = maxOffset

        this.alpha = 0
        this.alphaVelocity = 0
        this.transparency = transparency

        this.smoothedAudio = 0
        this.previousAudio = 0

        this.releaseDelay = releaseDelay
        this.releaseCounter = 0
    }

    /**
     * Função para atualizar a velocidade e posição da onda de áudio
     * @param {number} audioForce Potência do áudio sendo utilizado
     */
    update(audioForce) {
        this.smoothedAudio = lerp(this.smoothedAudio, audioForce, 0.15)

        let effectiveAudio = this.smoothedAudio

        if (this.smoothedAudio < this.previousAudio) {
            if (this.releaseCounter < this.releaseDelay) {
                this.releaseCounter++
                effectiveAudio = this.previousAudio
            }
        } else {
            this.releaseCounter = 0
        }
        this.previousAudio = effectiveAudio

        let targetOffset = map(effectiveAudio, 0, 255, 0, this.maxOffset)
        let force = targetOffset - this.offset

        this.velocity += force * 0.05
        this.velocity *= 0.85
        this.offset += this.velocity

        let targetAlpha = map(effectiveAudio, 0, 60, 0, 180, true)

        let alphaForce = targetAlpha - this.alpha
        this.alphaVelocity += alphaForce * 0.1
        this.alphaVelocity *= 0.8
        this.alpha += this.alphaVelocity
    }

    /**
     * Função para desenhar as ondas de áudio.
     * @param {number} circleRadius Raio do círculo a ser usado de referência
     */
    draw(circleRadius) {
        if (this.alpha <= 1) return

        push()

        let finalDiameter = (circleRadius + this.offset) * 2
        let finalAlpha = this.alpha * this.transparency

        noStroke()
        let rippleColor = color(colorRipple)
        rippleColor.setAlpha(finalAlpha)
        fill(rippleColor)
        ellipse(wid, heig, finalDiameter)
        pop()
    }
}