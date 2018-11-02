import { Vector2, Range, rotateDeg, vec2, plus } from "./math";
import { Particle } from "./particle";
import { Color } from "./lib";
import seedrandom from "seedrandom";
import { constantValue } from "./simulator";

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