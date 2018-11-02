import { ParticleRenderer } from "./render";
import { SetList, Color } from "./lib";
import { Particle, ParticleSystem } from "./particle";
import seedrandom from "seedrandom";
import { vec2 } from "./math";

const $ = (selector: string):HTMLElement => document.querySelector(selector);
const rand = seedrandom("233333");
let renderer = new ParticleRenderer($("#canvas-preview") as HTMLCanvasElement);
renderer.start();
let particles: SetList<Particle> = new SetList();
(window as any).renderer = renderer;
let particleSystem = new ParticleSystem(rand);

renderer.onUpdate = (dt) =>
{
    particleSystem.update(dt);
    renderer.clear();
    renderer.render(particleSystem.particles);
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
$("#button-stop").onclick = e => renderer.stop();