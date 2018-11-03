import { Particle } from "./particle";
import { Vector2, scale, plus, Range, clamp01 } from "./math";
import { Color, SetList } from "./lib";

type ValueSimulator<T=number | Vector2 | Color> = (value: T, dt: number, p: Particle) => T;
type ParticleDestroy = (p: Particle, rand: seedrandom.prng) => boolean;

export class ParticleSimulator
{
    size: ValueSimulator<number> = KeepValue;
    speed: ValueSimulator<number> = KeepValue;
    velocity: ValueSimulator<Vector2> = KeepValue;
    direction: ValueSimulator<Vector2> = KeepValue;
    acceleration: ValueSimulator<Vector2> = KeepValue;
    color: ValueSimulator<Color> = KeepValue;
    destroy: ParticleDestroy = SizeDestroy;

    simulate(particles: SetList<Particle>, dt:number, rand:seedrandom.prng)
    {
        for (let i = 0; i < particles.length; i++)
        {
            let p = particles[i];

            // Size editor
            p.size = this.size(p.size, dt, p);

            // acceleration editor
            p.acceleration = this.acceleration(p.acceleration, dt, p); 
            // Get velocity
            p.velocity = scale(p.direction, p.speed); 
            // Apply acceleration
            p.velocity.plus(scale(p.acceleration, dt)); 
            // Velocity editor
            p.velocity = this.velocity(p.velocity, dt, p); 

            p.direction = this.direction(p.velocity.normalized, dt, p)
            p.speed = this.speed(p.velocity.magnitude, dt, p)
            p.speed = p.speed < 0 ? 0 : p.speed;
            // Speed & direction editor
            p.velocity = scale(p.direction, p.speed); 

            // Apply velocity
            p.position= plus(p.position,scale(p.velocity, dt)); 

            // Color editor
            p.color = this.color(p.color, dt, p); 

            if (this.destroy(p,rand))
                particles.removeAt(i--);
            
            p.lifeTime += dt;
        }
    }
}

export function KeepValue<T=number | Vector2 | Color>(t: T) { return t }
export const SizeDestroy = (p: Particle) => p.size <= 0;

export function increase(inc: number, max: number = Number.MAX_VALUE): ValueSimulator<number>
{
    return (v, t) =>
    {
        let value = v + inc * t;
        return value > max ? max : value;
    };
}
export function constantValue<T>(value: T): () => T
{
    return () => value;
}

export function lifeTimeColor(birth: Color, death: Color, lifeTime: number): ValueSimulator<Color>
{
    let rangeH = new Range(birth.hue, death.hue);
    let rangeS = new Range(birth.saturation, death.saturation);
    let rangeL = new Range(birth.lightness, death.lightness);
    if (rangeH.size > 180)
        rangeH.to -= 360;
    else if (rangeH.size < -180)
        rangeH.from += 360;
    return (color, dt, p) => Color.fromHSL(
        rangeH.interpolate(clamp01(p.lifeTime / lifeTime)),
        rangeS.interpolate(clamp01(p.lifeTime / lifeTime)),
        rangeL.interpolate(clamp01(p.lifeTime / lifeTime)));
}

export function deathColor(deathColor: Color, deathTime: number): ValueSimulator<Color>
{
    return (color, dt, p) =>
    {
        let restTime = deathTime - p.lifeTime;

        let rangeH = new Range(color.hue, deathColor.hue);
        let rangeS = new Range(color.saturation, deathColor.saturation);
        let rangeL = new Range(color.lightness, deathColor.lightness);
        let rangeAlpha = new Range(color.alpha, deathColor.alpha);
        color = Color.fromHSL(
            rangeH.interpolate(clamp01(dt / restTime)),
            rangeS.interpolate(clamp01(dt / restTime)),
            rangeL.interpolate(clamp01(dt / restTime)));
        color.alpha = rangeAlpha.interpolate(clamp01(dt / restTime));
        return color;
    }
}

export function timeDestroy(time: number):ParticleDestroy
{
    return (p) => p.lifeTime >= time;
}

export function randomDestroy(prob: number): ParticleDestroy
{
    return (p, rand) => p.randomID <= prob;
}

export function randomTimeDestroy(maxTime: number): ParticleDestroy
{
    return (p, rand) => p.lifeTime >= (p.randomID * maxTime);
}