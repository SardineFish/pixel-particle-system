import { Vector2, Range, rotateDeg, vec2, plus } from "./math";
import { Particle } from "./particle";
import { Color } from "./lib";
import seedrandom from "seedrandom";
import { constantValue } from "./simulator";
import { ParticleImageRenderer, circleRenderer } from "./render";

type ValueGenerator<T=number | Vector2 | Color> = (p: Particle, rand: seedrandom.prng) => T;


export class ParticleEmitter
{
    acceleration: ValueGenerator<Vector2> = constantValue(Vector2.zero);
    position: ValueGenerator<Vector2> = constantValue(Vector2.zero);
    size: ValueGenerator<number> = constantValue(5);
    speed: ValueGenerator<number> = constantValue(100);
    direction: ValueGenerator<Vector2> = randomAngle(-180, 180);
    color: ValueGenerator<Color> = constantValue(new Color(0, 0, 0, 1));
    rand: seedrandom.prng;
    renderer: ParticleImageRenderer = circleRenderer;

    constructor(rand: seedrandom.prng)
    {
        this.rand = rand;
    }

    emit(position: Vector2): Particle
    {
        let p = new Particle();
        p.size = this.size(p, this.rand);
        p.position = plus(this.position(p, this.rand), position);
        p.direction = this.direction(p, this.rand);
        p.speed = this.speed(p, this.rand);
        p.acceleration = this.acceleration(p, this.rand);
        p.color = this.color(p, this.rand);
        p.lifeTime = 0;
        p.randomID = this.rand();
        p.renderer = this.renderer;
        return p;
    }
}

export function randomInRange(from: number, to: number):ValueGenerator<number>
{
    const range = new Range(from, to);
    return (p, rand) => range.interpolate(rand()); 
}
export function randomAngle(fromDeg: number, toDeg: number, baseDir:Vector2 = new Vector2(0,-1)): ValueGenerator<Vector2>
{
    const range = new Range(fromDeg, toDeg);
    return (p, rand) => rotateDeg(baseDir, range.interpolate(rand()));
}
export function randomColor(colorA: Color, colorB: Color):ValueGenerator<Color>
{
    const rangeH = new Range(colorA.hue, colorB.hue);
    const rangeS = new Range(colorA.saturation, colorB.saturation);
    const rangeL = new Range(colorA.lightness, colorB.lightness);
    const rangeA = new Range(colorA.alpha, colorB.alpha);
    return (p, rand) => Color.fromHSL(rangeH.interpolate(rand()), rangeS.interpolate(rand()), rangeL.interpolate(rand()),rangeA.interpolate(rand()));
}
export function circleEmitter(radius: number): ValueGenerator<Vector2>
{
    return (p, rand) =>
    {
        let l = Math.sqrt(rand()) * radius;
        let ang = rand() * Math.PI * 2;
        return vec2(l * Math.cos(ang), l * Math.sin(ang));
    }
}
export function boxEmitter(halfSize: number): ValueGenerator<Vector2>
{
    return (p, rand) => vec2(halfSize * (rand() * 2 - 1), halfSize * (rand() * 2 - 1));
}
export function lineEmitter(halfLength: number): ValueGenerator<Vector2>
{
    return (p, rand) => vec2(halfLength * (rand() * 2 - 1), 0);
}