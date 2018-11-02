import { Vector4 } from "./math";

export class Color
{
    red: number = 255;
    green: number = 255;
    blue: number = 255;
    alpha: number = 1.0;
    constructor(r: number, g: number, b: number, a: number = 1.0)
    {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a;
    }

    static add(a: Color, b: Color)
    {
        const t = b.alpha;
        return new Color(
            (1 - t) * a.red + t * b.red,
            (1 - t) * a.green + t * b.green,
            (1 - t) * a.blue + t * b.blue,
            1 - (1 - a.alpha) * (1 - b.alpha)
        );
    }

    static blend(a: Color, b: Color, t: number)
    {
        return new Color(
            (1 - t) * a.red + t * b.red,
            (1 - t) * a.green + t * b.green,
            (1 - t) * a.blue + t * b.blue,
            1
        );
    }

    toString()
    {
        return `rgba(${this.red},${this.green},${this.blue},${this.alpha})`;
    }
    toVector4(): Vector4
    {
        return new Vector4(this.red / 255, this.green / 255, this.blue / 255, this.alpha);
    }
}

export class SetList<T> extends Array<T>
{
    removeAt(idx: number): T
    {
        let element = this[idx] = this[this.length - 1];
        this.length--;
        return element;
    }
    remove(element: T)
    {
        return this.removeAt(this.indexOf(element));
    }
    clear()
    {
        for (let i = 0; i < this.length; i++)
            delete this[i];
        this.length = 0;
    }
    insert(element: T, idx: number = this.length)
    {
        if (idx < this.length)
        {
            let t = this[idx];
            this[idx] = element;
            this[this.length] = t;
        }
    }
}