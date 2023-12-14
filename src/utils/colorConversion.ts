import { TColorRepresentation, T_CMYK, T_HLS, T_HSB, T_HSV, T_LAB, T_RGB, T_XYZ, T_YUV } from "../stores/colorStore/colorTypes"
import { clamp, H_MAX, RGB_MAX, SVB_MAX } from "./consts";

export const hsvToRgb = (hsv: T_HSV): T_RGB => {
    const { h, s, v } = hsv;

    let r: number = 0, g: number = 0, b: number = 0;

    const newS = s / SVB_MAX;
    let newV = v / SVB_MAX;

    if(s === 0) {
        r = v * RGB_MAX;
        g = v * RGB_MAX;
        b = v * RGB_MAX;
    } else {
        const newH = h / 60;
        const hi = Math.floor(newH) % 6;

        const H_i = newH - Math.floor(newH);
        const V_min = RGB_MAX * newV * (1 - newS);
        const V_dec = RGB_MAX * newV * (1 - newS * H_i);
        const V_inc = RGB_MAX * newV * (1 - newS * (1 - H_i));

        newV *= RGB_MAX;

        switch(hi) {
            case 0:
                r = newV;
                g = V_inc;
                b = V_min;
                break;
            case 1:
                r = V_dec;
                g = newV;
                b = V_min;
                break;
            case 2:
                r = V_min;
                g = newV;
                b = V_inc;
                break;
            case 3:
                r = V_min;
                g = V_dec;
                b = newV;
                break;
            case 4:
                r = V_inc;
                g = V_min;
                b = newV;
                break;
            case 5:
                r = newV;
                g = V_min;
                b = V_dec;
                break;
        }

        r = Math.floor(r);
        g = Math.floor(g);
        b = Math.floor(b);
    }

    return {r, g, b}
}

export const rgbToCmyk = (rgb: T_RGB): T_CMYK => {
    const { r, g, b } = rgb;

    let c = 1 - r / RGB_MAX;
    let m = 1 - g / RGB_MAX;
    let y = 1 - b / RGB_MAX;

    let tmpK = 1;

    if(c < tmpK) {
        tmpK = c;
    } 
    if(m < tmpK) {
        tmpK = m;
    } 
    if(y < tmpK) {
        tmpK = y;
    } 
    if(tmpK === 1) {
        c = 0;
        m = 0;
        y = 0;
    } else {
        c = Math.round(((c - tmpK) / (1 - tmpK)) * 100);
        m = Math.round(((m - tmpK) / (1 - tmpK)) * 100);
        y = Math.round(((y - tmpK) / (1 - tmpK)) * 100);
    }

    const k = Math.round(tmpK * 100);

    return {c, m, y, k};
}

export const rgbToHls = (rgb: T_RGB): T_HLS => {    
    const { r, g, b } = rgb;

    let newR = r / RGB_MAX;
    let newG = g / RGB_MAX;
    let newB = b / RGB_MAX;

    const minValue = Math.min(newR, newG, newB);
    const maxValue = Math.max(newR, newG, newB);
    const deltaRGBValue = maxValue - minValue;

    let h = 0;
    let s = 0;
    let l = (minValue + maxValue) / 2;

    if(deltaRGBValue !== 0) {
        if(l < 0.5) {
            s = deltaRGBValue / (minValue + maxValue)
        } else {
            s = deltaRGBValue / (2 - maxValue - minValue);
        }

        const delR = ((maxValue - newR) / 6 + deltaRGBValue / 2) / deltaRGBValue;
        const delG = ((maxValue - newG) / 6 + deltaRGBValue / 2) / deltaRGBValue;
        const delB = ((maxValue - newB) / 6 + deltaRGBValue / 2) / deltaRGBValue;

        if(newR === maxValue) {
            h = delB - delG;
        } else if(newG === maxValue) {
            h = 1 / 3 + delR - delB;
        } else if(newB === maxValue) {
            h = 2 / 3 + delG - delR;
        }

        if(h < 0) {
            h += 1;
        } 

        if(h > 1) {
            h -= 1;
        }
    }

    return { h: Math.floor(h * 360), l: Math.floor(s * 100), s: Math.floor(l * 100) };
}

export const rgbToHsb = (rgb: T_RGB): T_HSB => {
    const { r, g, b } = rgb;

    let newR = r / RGB_MAX;
    let newG = g / RGB_MAX;
    let newB = b / RGB_MAX;

    const minValue = Math.min(newR, newG, newB);
    const maxValue = Math.max(newR, newG, newB);
    const deltaRGBValue = maxValue - minValue;

    let h = 0;
    let s = 0;
    let hsB = maxValue;

    if(deltaRGBValue !== 0) {
        s = deltaRGBValue / maxValue;

        const delR = ((maxValue - newR) / 6 + deltaRGBValue / 2) / deltaRGBValue;
        const delG = ((maxValue - newG) / 6 + deltaRGBValue / 2) / deltaRGBValue;
        const delB = ((maxValue - newB) / 6 + deltaRGBValue / 2) / deltaRGBValue;

        if(newR === maxValue) {
            h = delB - delG;
        } else if(newG === maxValue) {
            h = 1 / 3 + delR - delB;
        } else if(newB === maxValue) {
            h = 2 / 3 + delG - delR;
        }

        if(h < 0) {
            h += 1;
        }

        if(h > 1) {
            h -= 1;
        }
    }

    h = Math.floor(h * H_MAX);
    s = Math.floor(s * SVB_MAX);
    hsB = Math.floor(hsB * SVB_MAX)

    return { h, s, b: hsB };
}

export const rgbToYuv = (rgb: T_RGB): T_YUV => {
    const { r, g, b } = rgb;

    const kR = 0.299;
    const kB = 0.114;

    const y = kR * r + (1 - kR - kB) * g + kB * b;
    const u = (0.5 * (b - y)) / (1 - kB) + 128;
    const v = (0.5 * (r - y)) / (1 - kR) + 128;

    return { y, u, v };
}

export const rgbToXvz = (rgb: T_RGB): T_XYZ => {
    const { r, g, b } = rgb;

    let newR = r / RGB_MAX;
    let newG = g / RGB_MAX;
    let newB = b / RGB_MAX;

    if(newR > 0.04045) {
        newR = Math.pow((newR + 0.055) / 1.055, 2.4);
    } else {
        newR = newR / 12.92;
    }

    if(newG > 0.04045) {
        newG = Math.pow((newG + 0.055) / 1.055, 2.4);
    } else {
        newG = newG / 12.92;
    }

    if(newB > 0.04045) {
        newB = Math.pow((newB + 0.055) / 1.055, 2.4);
    } else {
        newB = newB / 12.92;
    }

    newR = newR * SVB_MAX;
    newG = newG * SVB_MAX;
    newB = newB * SVB_MAX;

    const x = Math.floor(newR * 0.4124 + newG * 0.3576 + newB * 0.1805);
    const y = Math.floor(newR * 0.2126 + newG * 0.7152 + newB * 0.0722);
    const z = Math.floor(newR * 0.0193 + newG * 0.1192 + newB * 0.9505);

    return { x, y, z };
}

export const xyzToLab = (xyz: T_XYZ): T_LAB => {
    const { x, y, z } = xyz;

    const refX = 95.047;
    const refY = 100.0;
    const refZ = 108.883;
    
    let newX = x / refX;
    let newY = y / refY;
    let newZ = z / refZ;

    if (newX > 0.008856) {
        newX = Math.pow(newX, 1 / 3);
    } else {
        newX = 7.787 * newX + 16 / 116;
    }

    if (newY > 0.008856) {
        newY = Math.pow(newY, 1 / 3);
    } else {
        newY = 7.787 * newY + 16 / 116;
    }

    if (newZ > 0.008856) {
        newZ = Math.pow(newZ, 1 / 3);
    } else {
        newZ = 7.787 * newZ + 16 / 116;
    }

    const l = 116 * newY - 16;
    const a = 500 * (newX - newY);
    const b = 200 * (newY - newZ);

    return { l, a, b };
}

export const yuvToRgb = (yuv: T_YUV): T_RGB => {
    const { y, u, v } = yuv;

    const kr = 0.2627;
    const kb = 0.0593;

    const r = Math.floor(clamp(y + 1.402 * (v - 128), 0, 255));
    const g = Math.floor(
        clamp(y - (kb * 1.772 * (u - 128) + kr * 1.402 * (v - 128)) / 0.587, 0, 255)
    );
    const b = Math.floor(clamp(y + 1.772 * (u - 128), 0, 255));

    return { r, g, b };
}

export const xyzToRgb = (xyz: T_XYZ): T_RGB => {
    const { x, y, z } = xyz;

    const newX = x / SVB_MAX;
    const newY = y / SVB_MAX;
    const newZ = z / SVB_MAX;

    let r = newX * 3.2406 + newY * -1.5372 + newZ * -0.4986;
    let g = newX * -0.9689 + newY * 1.8758 + newZ * 0.0415;
    let b = newX * 0.0557 + newY * -0.204 + newZ * 1.057;

    if(r > 0.0031308) {
        r = 1.055 * Math.pow(r, 1 / 2.4) - 0.055;
    } else {
        r = 12.92 * r;
    }

    if (g > 0.0031308) {
        g = 1.055 * Math.pow(g, 1 / 2.4) - 0.055;
    } else {
        g = 12.92 * g;
    }

    if (b > 0.0031308) {
        b = 1.055 * Math.pow(b, 1 / 2.4) - 0.055;
    } else {
        b = 12.92 * b;
    }

    return {
        r: Math.round(r * RGB_MAX),
        g: Math.round(g * RGB_MAX),
        b: Math.round(b * RGB_MAX),
    };
}

/**
    * Преобразование идет как LAB -> XYZ -> RGB
 */
export const labToRgb = (lab: T_LAB): T_RGB => {
    const xyz = labToXYZ(lab);

    return xyzToRgb(xyz);
}

export const labToXYZ = (lab: T_LAB): T_XYZ => {
    const { l, a, b } = lab;

    const refX = 95.047;
    const refY = 100.0;
    const refZ = 108.883;

    let newY = (l + 16) / 116;
    let newX = a / 500 + newY;
    let newZ = newY - b / 200;

    if (Math.pow(newY, 3) > 0.008856) {
        newY = Math.pow(newY, 3);
    } else {
        newY = (newY - 16 / 116) / 7.787;
    }

    if (Math.pow(newX, 3) > 0.008856) {
        newX = Math.pow(newX, 3);
    } else {
        newX = (newX - 16 / 116) / 7.787;
    }

    if (Math.pow(newZ, 3) > 0.008856) {
        newZ = Math.pow(newZ, 3);
    } else {
        newZ = (newZ - 16 / 116) / 7.787;
    }

    const x = Math.floor(newX * refX);
    const y = Math.floor(newY * refY);
    const z = Math.floor(newZ * refZ);

    return { x, y, z };
}

export const hueToRgb = (v1: number, v2: number, vH: number): number => {
    if (vH < 0) {
        vH += 1;
    }

    if (vH > 1) {
        vH -= 1;
    }

    if (6 * vH < 1) {
        return v1 + (v2 - v1) * 6 * vH;
    }

    if (2 * vH < 1) {
        return v2;
    }

    if (3 * vH < 2) {
        return v1 + (v2 - v1) * (2 / 3 - vH) * 6;
    }

    return v1;
}

export const hslToRgb = (hsl: T_HLS): T_RGB => {
    const { h, s, l } = hsl;

    let r: number;
    let g: number;
    let b: number;

    if (s === 0) {
      r = l * RGB_MAX;
      g = l * RGB_MAX;
      b = l * RGB_MAX;
    } else {
        let q = 0;
        let p = 0;

        if (l < 0.5) {
            q = l * (1 + s);
        } else {
            q = l + s - s * l;
        }

        p = 2 * l - q;

        r = Math.floor(RGB_MAX * hueToRgb(p, q, h + 1 / 3));
        g = Math.floor(RGB_MAX * hueToRgb(p, q, h));
        b = Math.floor(RGB_MAX * hueToRgb(p, q, h - 1 / 3));
    }

    return { r, g, b };
}

export const cmykToRgb = (cmyk: T_CMYK): T_RGB => {
    const { c, m, y, k } = cmyk;

    let newC = c / SVB_MAX;
    let newM = m / SVB_MAX;
    let newY = y / SVB_MAX;
    let newK = k / SVB_MAX;

    newC = newC * (1 - newK) + newK;
    newM = newM * (1 - newK) + newK;
    newY = newY * (1 - newK) + newK;

    const r = (1 - newC) * RGB_MAX;
    const g = (1 - newM) * RGB_MAX;
    const b = (1 - newY) * RGB_MAX;

    return { r, g, b };
}

export const hexToRgb = (hex: string): T_RGB | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : null;
}

const componentToHex = (value: number) => {    
    const hex = value.toString(16);

    return hex.length == 1 ? "0" + hex : hex;
}

export const rgbToHex = (rgbColor: T_RGB) => {
    return "#" + componentToHex(rgbColor.r) + componentToHex(rgbColor.g) + componentToHex(rgbColor.b);
}

export const getColorRepresentation = <T>(color: T) => {
    const roundedColor: TColorRepresentation = {};

    for(let key in color) {
        roundedColor[key] = Math.round(color[key] as number);
    }

    return roundedColor as T;
}