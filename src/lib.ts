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

    get hue():number
    {
        const R = this.red / 255;
        const G = this.green / 255;
        const B = this.blue / 255;
        const max = Math.max(R, G, B);
        const min = Math.min(R, G, B);
        let h;
        if (max === min)
            h= 0;
        else if (max === R)
            h = 60 * (0 + (G - B) / (max - min));
        else if (max === G)
            h = 60 * (2 + (B - R) / (max - min));
        else if (max === B)
            h = 60 * (4 + (R - G) / (max - min));
        return h < 0 ? h + 360 : h;
    }
    get saturation(): number
    {
        const max = Math.max(this.red, this.green, this.blue) / 255;
        const min = Math.min(this.red, this.blue, this.green) / 255;
        if (max === 0)
            return 0
        else if (min == 1)
            return 0;
        return (max - min) / (1 - Math.abs(max + min - 1));
    }
    get lightness():number
    {
        const max = Math.max(this.red, this.green, this.blue) / 255;
        const min = Math.min(this.red, this.blue, this.green) / 255;
        return (max + min) / 2;
    }
    
    set hue(value: number)
    {
        this.setHSL(value, this.saturation, this.lightness);
    }
    set saturation(value: number)
    {
        this.setHSL(this.hue, value, this.lightness);
    }
    set lightness(value: number)
    {
        this.setHSL(this.hue, this.saturation, value);
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

    static fromHSL(h: number, s: number, l: number, alpha:number=1)
    {
        return new Color(0, 0, 0, alpha).setHSL(h, s, l);
    }

    setHSL(h: number, s: number, l: number)
    {
        h = h < 0 ? h + 360 : h;
        const chroma = (1 - Math.abs(2 * l - 1)) * s;
        if (isNaN(h))
        {
            this.red = this.green = this.blue = 0;
            return this;
        }
        h = h / 60;
        const x = chroma * (1 - Math.abs(h % 2 - 1));
        let color = [0, 0, 0];
        if (0 <= h && h <= 1)
            color = [chroma, x, 0];
        else if (h <= 2)
            color = [x, chroma, 0]
        else if (h <= 3)
            color = [0, chroma, x];
        else if (h <= 4)
            color = [0, x, chroma];
        else if (h <= 5)
            color = [x, 0, chroma];
        else if (h <= 6)
            color = [chroma, 0, x];
        let m = l - chroma / 2;
        this.red = Math.floor((color[0] + m) * 255);
        this.green = Math.floor((color[1] + m) * 255);
        this.blue = Math.floor((color[2] + m) * 255);
        return this;
    }

    static fromString(str:string, alpha:number=1):Color
    {
        str = str.replace(new RegExp(/\s/g), "");

        var reg = new RegExp("#[0-9a-fA-F]{6}");
        if (reg.test(str))
        {
            str = str.replace("#", "");
            var strR = str.charAt(0) + str.charAt(1);
            var strG = str.charAt(2) + str.charAt(3);
            var strB = str.charAt(4) + str.charAt(5);
            var r = parseInt(strR, 16);
            var g = parseInt(strG, 16);
            var b = parseInt(strB, 16);
            return new Color(r, g, b, alpha);
        }
        reg = new RegExp("rgb\\(([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1})\\)");
        if (reg.test(str))
        {
            var colorArray = str.replace("rgb(", "").replace(")", "").split(",");
            var r = parseInt(colorArray[0]);
            var g = parseInt(colorArray[1]);
            var b = parseInt(colorArray[2]);
            var a = 1.00;
            return new Color(r, g, b, a);
        }
        reg = new RegExp("rgba\\(([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1}),([0-9]+(\\.[0-9]+){0,1})\\)");
        if (reg.test(str))
        {
            var colorArray = str.replace("rgba(", "").replace(")", "").split(",");
            var r = parseInt(colorArray[0]);
            var g = parseInt(colorArray[1]);
            var b = parseInt(colorArray[2]);
            var a = parseFloat(colorArray[3]);
            return new Color(r, g, b, a);
        }
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

export class LoopList<T> extends Array<T>
{
    private idx: number = -1;
    constructor(size: number)
    {
        super();
        this.length = size;
    }

    insert(element: T)
    {
        this.idx = (this.idx + 1) % this.length;
        this[this.idx] = element;
    }
}
