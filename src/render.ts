import { ParticleSystem, Particle } from "./particle";
import { Color } from "./lib";

export class ParticleRenderer
{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    frameUpdateId: number;
    running: boolean;
    lastUpdateTime: number;
    composite: "source-over" |
        "source-in" |
        "source-out" |
        "source-atop" |
        "destination-over" |
        "destination-in" |
        "destination-out" |
        "destination-atop" |
        "lighter" |
        "copy" |
        "xor" |
        "multiply" |
        "screen" |
        "overlay" |
        "darken" |
        "lighten" |
        "color-dodge" |
        "color-burn" |
        "hard-light" |
        "soft-light" |
        "difference" |
        "exclusion" |
        "hue" |
        "saturation" |
        "color" |
        "luminosity" = "source-over";
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
        if (this.running)
            this.frameUpdateId = requestAnimationFrame(t => this.update(t));
        let dt = delay - this.lastUpdateTime;
        this.lastUpdateTime = delay;
        let dtSeconds = dt / 1000;
        if (this.onUpdate)
            this.onUpdate(dtSeconds);
    }
    clear(bgColor: Color = new Color(0, 0, 0, 0), clear = true)
    {
        if (clear)
            this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = bgColor.toString();
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    render(particles: Particle[])
    {
        const ctx = this.ctx;
        ctx.globalCompositeOperation = this.composite;
        for (let i = 0; i < particles.length; i++)
        {
            let p = particles[i];
            ctx.fillStyle = p.color.toString();
            ctx.beginPath();
            ctx.arc(p.position.x, p.position.y, p.size, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

export class DownScaleRenderer
{
    canvas: HTMLCanvasElement;
    scaleRate: number = 1;
    constructor(canvas: HTMLCanvasElement)
    {
        this.canvas = canvas;
    }
    render(src: HTMLCanvasElement)
    {
        this.canvas.width = src.width / this.scaleRate;
        this.canvas.height = src.height / this.scaleRate;
        let imgSrc = src.getContext("2d").getImageData(0, 0, src.width, src.height);
        const ctx = this.canvas.getContext("2d");
        let img = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const w = img.width;
        const h = img.height;
        let buff32Src = new Uint32Array(imgSrc.data.buffer);
        let buff32 = new Uint32Array(img.data.buffer);
        for (let y = 0; y < h; y++)
        {
            for (let x = 0; x < w; x++)
            {
                buff32[y * h + x] = buff32Src[y * this.scaleRate * imgSrc.width + x * this.scaleRate];
            }
        }
        ctx.imageSmoothingEnabled = false;
        img = new ImageData(new Uint8ClampedArray(buff32.buffer), w, h);
        ctx.putImageData(img, 0, 0);
    }
}