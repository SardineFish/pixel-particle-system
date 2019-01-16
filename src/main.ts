import { ParticleRenderer, DownScaleRenderer } from "./render";
import { SetList, Color, LoopList } from "./lib";
import { Particle, ParticleSystem, IParticleSystem, combine } from "./particle";
import seedrandom from "seedrandom";
import { vec2, Range, rotateDeg, scale } from "./math";
import { ParticleSimulator, constantValue, increase, lifeTimeColor, deathColor, randomTimeDestroy, randomDestroy, decrease } from "./simulator";
import { ParticleEmitter, randomAngle, randomInRange, randomColor, circleEmitter, lineEmitter } from "./emitter";
import linq from "linq";

const $ = (selector: string): HTMLElement => document.querySelector(selector);
const rand = seedrandom("233333");

let particleSystem: IParticleSystem;
let blood = new ParticleSystem(rand);
blood.emitter = new ParticleEmitter(rand);
blood.simulator = new ParticleSimulator();
blood.count = 40;

blood.emitter.direction = randomAngle(-180, 180);
blood.emitter.speed = randomInRange(50, 300);
blood.emitter.size = randomInRange(5, 10);
blood.emitter.color = randomColor(new Color(105, 37, 42), new Color(255, 49, 64));
blood.emitter.acceleration = constantValue(vec2(0, 800));

//simulator.speed = increase(-1600);
//simulator.color = deathColor(new Color(105, 37, 42), .3);
blood.simulator.size = increase(-20);



let fire = new ParticleSystem(rand);
fire.count = 3;
fire.interval = 0.1;
fire.emitter.direction = randomAngle(-20, 20);
fire.emitter.size = randomInRange(10, 20);
fire.emitter.speed = constantValue(100);
fire.emitter.color = randomColor(Color.fromString("#fff044"), Color.fromString("#ffb244"));
fire.emitter.acceleration = constantValue(vec2(0, -100));

fire.simulator.size = increase(30, 30);
fire.simulator.destroy = randomTimeDestroy(1.6);
fire.simulator.color = deathColor(Color.fromString("#461f1c",0.1), 2);

let largeSmoke = new ParticleSystem(rand);
largeSmoke.count = 3;
largeSmoke.interval = 0.3;
largeSmoke.emitter.direction = randomAngle(-10, 10);
largeSmoke.emitter.size = constantValue(0);
largeSmoke.emitter.speed = constantValue(50);
largeSmoke.emitter.color = constantValue(Color.fromString("#7a6a66"));

largeSmoke.simulator.size = increase(20);
largeSmoke.simulator.destroy = randomTimeDestroy(3);
largeSmoke.simulator.color = deathColor(new Color(52, 45, 43,0), 5);

let smoke = new ParticleSystem(rand);
smoke.position = vec2(0, -100);
smoke.count = 5;
smoke.interval = 0.1;
smoke.emitter.direction = randomAngle(-30, 30);
smoke.emitter.size = randomInRange(20, 30);
smoke.emitter.speed = constantValue(80);
smoke.emitter.color = randomColor(new Color(122,106,102,0.6), new Color(123,59,46,0.6));
smoke.emitter.acceleration = constantValue(vec2(0, -100));
smoke.emitter.position = circleEmitter(40);

smoke.simulator.size = increase(20, 40);
smoke.simulator.destroy = randomTimeDestroy(2);
smoke.simulator.color = deathColor(new Color(52,45,43,0.6), 2);

let fireAndSmoke = combine(largeSmoke, smoke, fire );


let water = new ParticleSystem(rand);
water.emitter.direction = constantValue(vec2(0, 1));
water.emitter.speed = constantValue(0);
water.emitter.color = randomColor(Color.fromString("#74c2e7"), Color.fromString("#5297d8"));
water.emitter.position = lineEmitter(30);
water.emitter.size = randomInRange(5, 20);

water.simulator.acceleration = constantValue(vec2(0, 300));


let foam = new ParticleSystem(rand);
foam.count = 5;
foam.emitter.color = randomColor(new Color(255, 255, 255), Color.fromString("#e2f1ff"));
foam.emitter.position = lineEmitter(40);
foam.emitter.size = randomInRange(5, 20);
foam.emitter.speed = randomInRange(20, 50);

foam.simulator.destroy = randomTimeDestroy(0.5);

//particleSystem = combine(water, foam);

let boom = new ParticleSystem(rand);
boom.emitter.size = randomInRange(1, 10);
boom.emitter.speed = randomInRange(800,1500);
boom.emitter.color = randomColor(Color.fromString("#ff2818"), Color.fromString("#fec65a"));

boom.simulator.speed = decrease(4000);
boom.simulator.size = decrease(20); 
boom.simulator.color = deathColor(Color.fromString("#fef85a"), 0.3);


let boom1 = new ParticleSystem(rand);
boom1.emitter.size = randomInRange(10, 20);
boom1.emitter.speed = randomInRange(500, 600);
boom1.emitter.color = randomColor(Color.fromString("#ff2818"), Color.fromString("#ff6418"));

boom1.simulator.speed = decrease(3000);
boom1.simulator.size = decrease(50);
boom1.simulator.color = deathColor(Color.fromString("#ffb018"), 0.3);


let emmmm = new ParticleSystem(rand);
emmmm.emitter.size = randomInRange(10, 1);
emmmm.emitter.speed = randomInRange(300, 600);
emmmm.emitter.color = constantValue(new Color(255, 255, 255));

emmmm.simulator.size = decrease(10);
emmmm.simulator.acceleration = (v, dt, p) =>
{
    return scale(rotateDeg(p.direction, 90), 5000);
}

particleSystem = fireAndSmoke; //combine(boom1, boom);















// UI
let fpsBuffer = new LoopList(30);
let downScaleRenderer = new DownScaleRenderer($("#canvas-render") as HTMLCanvasElement);
downScaleRenderer.scaleRate = 8;
let renderer = new ParticleRenderer($("#canvas-preview") as HTMLCanvasElement);
(window as any).renderer = renderer;
renderer.composite //= "lighten"
renderer.start();
renderer.onUpdate = (dt) =>
{
    renderer.clear(new Color(0,0,0,0));
    let particles = particleSystem.update(dt);
    renderer.render(particles);

    downScaleRenderer.render(renderer.canvas);

    // Performace
    $("#particles-count").innerText = particles.length.toString();
    fpsBuffer.insert(1 / dt);
    $("#fps").innerText = Math.round(linq.from(fpsBuffer).sum() / fpsBuffer.length).toString();
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
    renderer.clear();
    particleSystem.clear();
    particleSystem.endEmit();
}