import { Vector2, Range, vec2, plus, rotateDeg, scale, degOfVector } from "./math";
import { Color, SetList } from "./lib";
import seedrandom from "seedrandom";
import { ParticleEmitter } from "./emitter";
import { ParticleSimulator } from "./simulator";
import linq from "linq";
import { ParticleImageRenderer } from "./render";

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
    randomID: number;
    renderer: ParticleImageRenderer;
}
export interface IParticleSystem
{
    position: Vector2;
    update(dt: number): Particle[];
    startEmit(): void;
    endEmit(): void;
    clear(): void;
}
export class ParticleSystem implements IParticleSystem
{
    position: Vector2 = Vector2.zero;
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

        this.simulator.simulate(this.particles, dt, this.rand);

        return this.particles;
    }

    startEmit()
    {
        this.emitting = true;
    }
    endEmit()
    {
        this.emitting = false;

    }
    clear()
    {
        this.particles.clear();
    }
}

export class CombinedParticleSystem implements IParticleSystem
{
    position: Vector2 = new Vector2(0, 0);
    particles: Particle[];
    particleSystems: ParticleSystem[];

    update(dt: number)
    {
        dt = 0.0166;
        let particles: Particle[][] = [];
        this.particleSystems.forEach(system =>
        {
            let originalPos = system.position;
            system.position = plus(system.position, this.position);
            particles.push(system.update(dt))
            system.position = originalPos;
        });
        this.particles = new Array(linq.from(particles).sum(p => p.length));
        let idx = 0;
        for (let j = 0; j < particles.length; j++)
        {
            for (let i = 0; i < particles[j].length; i++)
                this.particles[idx++] = particles[j][i];    
        }
        return this.particles;
    }
    startEmit()
    {
        this.particleSystems.forEach(system => system.startEmit());
    }
    endEmit()
    {
        this.particleSystems.forEach(system => system.endEmit());
    }
    clear()
    {
        this.particleSystems.forEach(system => system.clear());
    }
}

export function combine(...particleSystems: ParticleSystem[])
{
    let system = new CombinedParticleSystem();
    system.particleSystems = particleSystems;
    return system;
}