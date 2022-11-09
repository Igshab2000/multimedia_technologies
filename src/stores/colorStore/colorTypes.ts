export type T_HSV = {
    h: number,
    s: number,
    v: number,
}

export type T_RGB = {
    r: number;
    g: number;
    b: number;
};

export type T_CMYK = {
    c: number;
    m: number;
    y: number;
    k: number;
};

export type T_HLS = {
    h: number;
    l: number;
    s: number;
}

export type T_XYZ = {
    x: number;
    y: number;
    z: number;
}

export type T_YUV = {
    y: number;
    u: number;
    v: number;
}

export type T_LAB = {
    l: number;
    a: number;
    b: number;
}

export type T_HSB = {
    h: number;
    s: number;
    b: number;
}

export enum EModelColor {
    HSV = "HSV",
    RGB = "RGB",
    CMYK = "CMYK",
    HLS = "HLS",
    XYZ = "XYZ",
    YUV = "YUV",
    LAB = "LAB",
    HSB = "HSB",
}

export type TColorRepresentation = {
    [k: string]: number;
}