import { Vector2, Range } from "./math";
import { Color, SetList } from "./lib";

export class Particle
{
    position: Vector2;
    velocity: Vector2;
    speed: number;
    acceleration: Vector2;
    size: number;
    lifeTime: number;
    color: Color;
}
export class ParticleSystem
{
    particles: SetList<Particle> = new SetList();
    duration: number = 1;
    interval: number = 0.1;
    
}