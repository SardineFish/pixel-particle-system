import { Vector2, Range, vec2, plus, rotateDeg, scale, degOfVector } from "./math";
import { Color, SetList } from "./lib";
import seedrandom from "seedrandom";
import { ParticleEmitter } from "./emitter";
import { ParticleSimulator } from "./simulator";

export class Particle
{
    position: Vector2;
    velocity: Vector2;
    direction: Vector2;
    speed: number;
    acceleration: Vector2;
    size: number;
    lifeTime: number;
    color: Color;
}
export class ParticleSystem
{
    position: Vector2;
    particles: SetList<Particle> = new SetList();
    duration: number = 1;
    interval: number = 0.1;
    count: number = 30;
    rand: seedrandom.prng;
    emitting: boolean = false;
    time: number = -1;
    nextEmitTime: number = 0;

    emitter: ParticleEmitter = new ParticleEmitter(seedrandom());
    simulator: ParticleSimulator = new ParticleSimulator();

    constructor(rand: seedrandom.prng)
    {
        this.rand = rand;
    }

    update(dt: number)
    {
        if (this.time < 0)
            this.time = 0
        else
            this.time += dt;
        
        if (this.emitting && (this.time >= this.nextEmitTime))
        {
            this.nextEmitTime = this.time + this.interval;
            
            let count = this.count;
            for (let i = 0; i < count; i++)
            {
                this.particles.push(this.emitter.emit(this.position));
            }
        }

        this.simulator.simulate(this.particles, dt);
    }

    startEmit()
    {
        this.emitting = true;
    }
    endEmit()
    {
        this.emitting = false;

    }
}
