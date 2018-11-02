import { ParticleRenderer } from "./render";
import { SetList, Color } from "./lib";
import { Particle, ParticleSystem } from "./particle";
import seedrandom from "seedrandom";
import { vec2 } from "./math";
import { ParticleSimulator, constantValue, increase } from "./simulator";
import { ParticleEmitter, randomAngle, randomInRange } from "./emitter";

const $ = (selector: string): HTMLElement => document.querySelector(selector);
const rand = seedrandom("233333");

let particleSystem = new ParticleSystem(rand);
let emitter = new ParticleEmitter(rand);
let simulator = new ParticleSimulator();
particleSystem.emitter = emitter;
particleSystem.simulator = simulator;


emitter.direction = randomAngle(-180, 180);
emitter.speed = constantValue(300);
emitter.size = randomInRange(1, 10);


simulator.speed = increase(-300);




































// UI

let renderer = new ParticleRenderer($("#canvas-preview") as HTMLCanvasElement);
(window as any).renderer = renderer;
renderer.start();
renderer.onUpdate = (dt) =>
{
    particleSystem.update(dt);
    renderer.clear();
    renderer.render(particleSystem.particles);


    $("#particles-count").innerText = particleSystem.particles.length.toString();
    $("#fps").innerText = Math.round(1 / dt).toString();
};
let bound = renderer.canvas.getBoundingClientRect();
let style = getComputedStyle(renderer.canvas);
let clientOffset = vec2(bound.left + parseFloat(style.marginLeft), bound.top + parseFloat(style.marginTop));
let mouseHold = false;
renderer.canvas.addEventListener("mousedown", (e) =>
{
    mouseHold = true;
    particleSystem.startEmit();
});
renderer.canvas.addEventListener("mouseup", (e) =>
{
    mouseHold = false;
    particleSystem.endEmit();
});
renderer.canvas.addEventListener("mousemove", (e) =>
{
    particleSystem.position = vec2(e.clientX - clientOffset.x, e.clientY - clientOffset.y);
});
$("#button-stop").onclick = e =>
{
    particleSystem.particles.clear();
    particleSystem.endEmit();
}