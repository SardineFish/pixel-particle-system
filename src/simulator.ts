import { Particle } from "./particle";
import { Vector2, scale, plus } from "./math";
import { Color, SetList } from "./lib";

type ValueSimulator<T=number | Vector2 | Color> = (value: T, dt: number, p: Particle) => T;
type ParticleDestroy = (p: Particle) => boolean;

export class ParticleSimulator
{
    size: ValueSimulator<number> = KeepValue;
    speed: ValueSimulator<number> = KeepValue;
    velocity: ValueSimulator<Vector2> = KeepValue;
    direction: ValueSimulator<Vector2> = KeepValue;
    acceleration: ValueSimulator<Vector2> = KeepValue;
    color: ValueSimulator<Color> = KeepValue;
    destroy: ParticleDestroy = SizeDestroy;

    simulate(particles: SetList<Particle>, dt:number)
    {
        for (let i = 0; i < particles.length; i++)
        {
            let p = particles[i];

            p.lifeTime += dt;

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
        }
    }
}

export function KeepValue<T=number | Vector2 | Color>(t: T) { return t }
export const SizeDestroy = (p: Particle) => p.size <= 0;

export function increase(inc: number): ValueSimulator<number>
{
    return (v, t) => v + inc * t;
}
export function constantValue<T>(value: T): () => T
{
    return () => value;
}