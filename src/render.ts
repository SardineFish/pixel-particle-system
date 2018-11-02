import { ParticleSystem, Particle } from "./particle";
import { Color } from "./lib";

export class ParticleRenderer
{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    frameUpdateId: number;
    running: boolean;
    lastUpdateTime: number;
    onUpdate: (dt: number) => void;
    get width() { return this.canvas.width }
    get height() { return this.canvas.height }
    set width(value) { this.canvas.width = value }
    set height(value) { this.canvas.height = value }

    constructor(element: HTMLCanvasElement)
    {
        this.canvas = element;
        this.ctx = this.canvas.getContext("2d");
    }
    start()
    {
        this.running = true;
        this.frameUpdateId = requestAnimationFrame((t)=>this.update(t));
    }
    stop()
    {
        this.running = false;
    }
    update(delay: number)
    {
        let dt = delay - this.lastUpdateTime;
        this.lastUpdateTime = delay;
        let dtSeconds = dt / 1000;
        if (this.onUpdate)
            this.onUpdate(dtSeconds);
        if (this.running)
            this.frameUpdateId = requestAnimationFrame(t => this.update(t));
    }
    clear(bgColor: Color = new Color(0, 0, 0, 0))
    {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = bgColor.toString();
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    render(particles: Particle[])
    {
        const ctx = this.ctx;
        for (let i = 0; i < particles.length; i++)
        {
            let p = particles[i];
            ctx.strokeStyle = p.color.toString();
            ctx.beginPath();
            ctx.arc(p.position.x, p.position.y, p.size, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}