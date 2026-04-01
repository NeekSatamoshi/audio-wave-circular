import p5 from "p5";
import { P5CanvasInstance, P5Canvas } from "@p5-wrapper/react";
import Circle from "./circle";
import Ripple from "./ripple";

function sketch(p: P5CanvasInstance) {
  let bgGradient: p5.Graphics;

  // Sound vars
  let audioCtx: AudioContext;
  let analyser: AnalyserNode;
  let freqData: Uint8Array<ArrayBuffer>;
  let micStarted = false;
  let smoothBass = 0;

  // Circle vars
  let circle: Circle;
  let radius: number;
  let circleSize = 0;
  let circleVelocity = 0;

  // Ripple vars
  let ripples: Ripple[] = [];
  let ripple1;
  let ripple2;
  let ripple3;
  let ripple4;
  let colorRipple: p5.Color;

  const createBackground = (p: p5, bg: p5.Graphics) => {
    let c1 = p.color("#45A3D7");
    let c2 = p.color("#2887BC");
    let c3 = p.color("#206d97");

    let colWidth = bg.width / 3;

    bg.noStroke();

    bg.fill(c1);
    bg.rect(0, 0, colWidth, bg.height);

    bg.fill(c2);
    bg.rect(colWidth, 0, colWidth, bg.height);

    bg.fill(c3);
    bg.rect(colWidth * 2, 0, colWidth, bg.height);
  };

  const initAudio = async () => {
    if (micStarted) return;

    let inputDevice: MediaDeviceInfo = {
      groupId: "",
      deviceId: "",
      label: "",
      kind: "audioinput",
      toJSON() {
        return { groupId: this.groupId, deviceId: this.deviceId, label: this.label, kind: this.kind };
      },
    };

    await navigator.mediaDevices.enumerateDevices().then(
      (devices) => {
        devices.forEach((device) => {
          // console.log(`${device.label} - ${device.kind} - ${device.deviceId}`);
          if (device.kind === "audioinput" && device.label.toLocaleLowerCase().includes("cable output")) {
            inputDevice = device;
            // console.log("Conectado com sucesso");
          }
        });
      },
      () => {
        alert("Failed to get media devices!");
      },
    );

    audioCtx = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: inputDevice.deviceId,
      },
    });

    const source = audioCtx.createMediaStreamSource(stream);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;

    source.connect(analyser);

    freqData = new Uint8Array(analyser.frequencyBinCount);

    micStarted = true;

    analyser.connect(audioCtx.destination);
  };

  const getEnergy = (minFreq: number, maxFreq: number) => {
    analyser.getByteFrequencyData(freqData);

    const nyquist = audioCtx.sampleRate / 2;

    const lowIndex = Math.floor((minFreq / nyquist) * freqData.length);
    const highIndex = Math.floor((maxFreq / nyquist) * freqData.length);

    let sum = 0;
    let count = 0;

    for (let i = lowIndex; i <= highIndex; i++) {
      sum += freqData[i];
      count++;
    }

    return count > 0 ? sum / count : 0;
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    bgGradient = p.createGraphics(p.windowWidth, p.windowHeight);
    createBackground(p, bgGradient);

    colorRipple = p.color("#ffffff");

    let width = p.windowWidth / 2;
    let height = p.windowHeight / 2;
    radius = p.windowHeight / 10;

    circleSize = radius;
    circleVelocity = 0;

    circle = new Circle(p, circleSize, width, height);

    ripple1 = new Ripple(p, 60, 0, colorRipple);
    ripple2 = new Ripple(p, 120, 2, colorRipple);
    ripple3 = new Ripple(p, 180, 6, colorRipple);
    ripple4 = new Ripple(p, 190, 10, colorRipple);

    ripples.push(ripple1, ripple2, ripple3, ripple4);

    p.angleMode(p.DEGREES);
    initAudio();
  };

  p.draw = () => {
    p.background(0);

    p.image(bgGradient, 0, 0, p.windowWidth, p.windowHeight);

    let bass = 0;
    let mid = 0;

    if (micStarted) {
      bass = getEnergy(20, 140);
      // console.log(bass);
      mid = getEnergy(400, 2500);
    }
    smoothBass = p.lerp(smoothBass, bass, 0.08);

    let targetExpansion = p.map(smoothBass, 0, 255, 0, radius * 0.35);

    if (smoothBass > 30) {
      circle.setMic(true);
    } else {
      circle.setMic(false);
    }

    let force = radius + targetExpansion - circleSize;

    circleVelocity += force * 0.05;
    circleVelocity *= 0.85;
    circleSize += circleVelocity;

    circle.updateRadius(circleSize);

    ripples.forEach((ripple) => {
      ripple.update(smoothBass);
      ripple.draw(circleSize, p.windowWidth / 2, p.windowHeight / 2);
    });

    circle.draw();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);

    bgGradient = p.createGraphics(p.windowWidth, p.windowHeight);
    createBackground(p, bgGradient);

    circle.resize(p.windowWidth / 2, p.windowHeight / 2);
  };
}

export default function App() {
  return <P5Canvas sketch={sketch} />;
}
