export class Vector2 extends Array<number>
{
    constructor(v: number[])
    constructor(x: number, y: number)
    constructor(x: number | number[], y?: number)
    {
        if (x instanceof Array)
            super(...x);
        else
            super(x, y);
    }

    get x(): number { return this[0]; }
    set x(value) { this[0] = value; }
    get y(): number { return this[1]; }
    set y(value) { this[1] = value; }

    get normalized()
    {
        let l = Math.hypot(this.x, this.y);
        return new Vector2(this.x / l, this.y / l);
    }
    get magnitude()
    {
        return Math.hypot(this.x, this.y);
    }
}

export class Vector4 extends Array<number>
{
    constructor(v: number[])
    constructor(x: number, y: number, z: number, w: number)
    constructor(x: number | number[], y?: number, z?: number, w?: number)
    {
        if (x instanceof Array)
            super(...x);
        else
            super(x, y, z, w);
    }

    get x(): number { return this[0]; }
    set x(value) { this[0] = value; }
    get y(): number { return this[1]; }
    set y(value) { this[1] = value; }
    get z(): number { return this[2]; }
    set z(value) { this[2] = value; }
    get w(): number { return this[3]; }
    set w(value) { this[3] = value; }

    get normalized()
    {
        return new Vector4(this.x / this.magnitude, this.y / this.magnitude, this.z / this.magnitude, this.w / this.magnitude);
    }
    get magnitude()
    {
        return Math.hypot(this.x, this.y, this.z, this.w);
    }
}

function vec4(x: number, y: number, z: number, w: number): Vector4
{
    return new Vector4(x, y, z, w);
}

export function vec2(x: number, y: number): Vector2
{
    return new Vector2(x, y);
}
export function plus(u: Vector2, v: Vector2): Vector2
export function plus(u: Vector4, v: Vector4): Vector4
export function plus(u: Vector4 | Vector2, v: Vector4 | Vector2): Vector4 | Vector2
{
    if (u instanceof Vector2)
    {
        return new Vector2(u.x + v.x, u.y + v.y);
    }
    else if (v instanceof Vector4)
    {
        return new Vector4(u.x + v.x, u.y + v.y, u.z + v.z, u.w + v.w);
    }
}
export function minus(u: Vector2, v: Vector2): Vector2
export function minus(u: Vector4, v: Vector4): Vector4
export function minus(u: Vector4 | Vector2, v: Vector4 | Vector2): Vector4 | Vector2
{
    if (u instanceof Vector2)
    {
        return new Vector2(u.x - v.x, u.y - v.y);
    }
    else if (v instanceof Vector4)
    {
        return new Vector4(u.x - v.x, u.y - v.y, u.z - v.z, u.w - v.w);
    }
}
export function scale(u: Vector2, k: number): Vector2
export function scale(u: Vector4, k: number): Vector4
export function scale(u: Vector4 | Vector2, k: number): Vector4 | Vector2
{
    if (u instanceof Vector2)
    {
        return new Vector2(u.x * k, u.y * k);
    }
    else
    {
        return new Vector4(u.x * k, u.y * k, u.z * k, u.w * k);
    }
}
export function dot(u: Vector2, v: Vector2): number
export function dot(u: Vector4, v: Vector4): number
export function dot(u: Vector4 | Vector2, v: Vector4 | Vector2): number
{
    if (u instanceof Vector2)
    {
        return u.x * v.x + u.y * v.y;
    }
    else if (v instanceof Vector4)
    {
        return u.x * v.x +
            u.y * v.y +
            u.z * v.z +
            u.w * v.w;
    }
}
export function rotateDeg(v: Vector2, deg: number): Vector2
{
    let rad = deg * Math.PI / 180;
    let cos = Math.cos(rad);
    let sin = Math.sin(rad);
    return new Vector2(v.x * cos - v.y * sin, v.x * sin + v.y * cos);
}
export function rotateRad(v: Vector2, rad: number): Vector2
{
    let cos = Math.cos(rad);
    let sin = Math.sin(rad);
    return new Vector2(v.x * cos - v.y * sin, v.x * sin + v.y * cos);
}
export function cross(u: Vector2, v: Vector2): number
{
    return u.x * v.y - u.y * v.x;
}

export class Matrix3x3
{
    constructor(mat: Matrix3x3 | number[][] = null)
    {
        this[0] = [1, 0, 0];
        this[1] = [0, 1, 0];
        this[2] = [0, 0, 1];
        if (mat instanceof Matrix3x3 || mat instanceof Array)
        {
            this[0] = mat[0].copyWithin(0, 0);
            this[1] = mat[1].copyWithin(0, 0);
            this[2] = mat[2].copyWithin(0, 0);
        }
    }
    [indexer: number]: number[];
    static get identity()
    {
        return new Matrix3x3();
    }
    static multipleVector(mat: Matrix3x3, v: Vector2): Vector2
    {
        let result = [
            mat[0][0] * v[0] + mat[0][1] * v[1] + mat[0][2] * 1,
            mat[1][0] * v[0] + mat[1][1] * v[1] + mat[1][2] * 1,
            mat[2][0] * v[2] + mat[2][1] * v[1] + mat[2][2] * 1,
        ]
        return new Vector2(result);
    }
    static multipleMatrix(a: Matrix3x3, b: Matrix3x3): Matrix3x3
    {
        let mat = new Matrix3x3();
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                for (let k = 0; k < 3; k++)
                    mat[i][j] = a[i][k] * b[k][j];
        return mat;
    }

    multipleVector(v: Vector2): Vector2
    {
        return Matrix3x3.multipleVector(this, v);
    }
    multipleMatrix(m: Matrix3x3): Matrix3x3
    {
        let mat = Matrix3x3.multipleMatrix(this, m);
        this[0] = mat[0].copyWithin(0, 0);
        this[1] = mat[1].copyWithin(0, 0);
        this[2] = mat[2].copyWithin(0, 0);
        return this;
    }
}

export class Range extends Vector2
{
    constructor(from: number, to: number)
    {
        super(from, to);
    }
    get from()
    {
        return this[0];
    }
    set from(value)
    {
        this[0] = value;
    }

    get to()
    {
        return this[1];
    }
    set to(value)
    {
        this[1] = value;
    }

    get size()
    {
        return this[1] - this[0];
    }
    interpolate(t: number): number
    {
        return t * this.size + this.from;
    }
    inRange(n: number): boolean
    {
        return this.from < n && n < this.to;
    }

    inRangeInclude(n: number): boolean
    {
        return this.from <= n && n <= this.to;
    }
}