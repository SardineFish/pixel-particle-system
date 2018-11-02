import { ParticleRenderer } from "./render";
import { SetList, Color } from "./lib";
import { Particle } from "./particle";
import seedrandom from "seedrandom";
import { vec2 } from "./math";

const $ = (selector: string):HTMLElement => document.querySelector(selector);
const rand = seedrandom("233333");
let renderer = new ParticleRenderer($("#canvas-preview") as HTMLCanvasElement);
renderer.start();
let particles: SetList<Particle> = new SetList();
(window as any).renderer = renderer;

renderer.onUpdate = (dt) =>
{
    let pos = vec2(renderer.width * rand(), renderer.height * rand());
    let p = new Particle;
    p.position = pos;
    p.color = new Color(0, 0, 0, 1);
    p.size = 10;
    particles.push(p);
    renderer.clear();
    renderer.render(particles);
};

$("#button-stop").onclick = e => renderer.stop();