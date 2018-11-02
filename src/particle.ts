import { Vector2, Range, vec2, plus, rotateDeg, scale } from "./math";
import { Color, SetList } from "./lib";
import seedrandom from "seedrandom";

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
    count: number = 5;
    emitterType: "circle" | "box" | "line" | "point";
    emitterSize: 20;
    emitAngle: number = 0;
    rand: seedrandom.prng;
    emitting: boolean = false;
    time: number = -1;
    nextEmitTime: number = 0;

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
        
        if (this.emitting && this.time > this.nextEmitTime)
        {
            this.nextEmitTime += this.interval;
            
            let count = this.count;
            for (let i = 0; i < count; i++)
            {
                this.particles.push(this.emit());
            }
        }

        for (let i = 0; i < this.particles.length; i++)
        {
            let p = this.particles[i];

            // Size
            p.size -= 2;

            // Destroy
            if (p.size <= 0)
            {
                this.particles.remove(p);
                i--;
                continue;
            }

            // Velocity
            p.speed -= 0.1;
            p.speed = p.speed < 0 ? 0 : p.speed;
            p.velocity = scale(p.direction, p.speed);
            p.velocity = plus(p.velocity, scale(p.acceleration, dt));
            p.position = plus(p.position, scale(p.velocity, dt));

                

            // Color
        }
    }
    
    private emit(): Particle
    {
        let p = new Particle;
        p.lifeTime = 0;
        p.position = this.emitPosition();
        p.direction = this.emitDirection();
        p.speed = this.emitSpeed();
        p.size = this.emitSize();
        p.color = this.emitColor();
        p.acceleration = this.emitAcceleration();
        return p;
    }
    private emitPosition(): Vector2
    {
        if (this.emitterType === "circle")
        {
            let l = Math.sqrt(this.rand()) * this.emitterSize;
            let ang = this.rand() * Math.PI * 2;
            let pos = vec2(l * Math.cos(ang), l * Math.sin(ang));
            return plus(pos, this.position);
        }
        else if (this.emitterType === "box")
        {
            let pos = vec2(this.emitterSize * (this.rand() * 2 - 1), this.emitterSize * (this.rand() * 2 - 1));
            return plus(pos, this.position);
        }
        else if (this.emitterType === "line")
        {
            let pos = vec2(this.emitterSize * (this.rand() * 2 - 1), 0);
            return plus(pos, this.position);
        }
        return this.position;
    }
    private emitDirection(): Vector2
    {
        const range = new Range(0, 360);
        return rotateDeg(new Vector2(0, -1), range.interpolate(this.rand()));
    }
    private emitSpeed(): number
    {
        return 600;
    }
    private emitSize(): number
    {
        const range = new Range(5, 30);
        return range.interpolate(this.rand());
    }
    private emitAcceleration(): Vector2
    {
        return new Vector2(0, 0);
    }
    private emitColor(): Color
    {
        return new Color(0, 0, 0, 1);
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