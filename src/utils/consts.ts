import { firstLabInPath } from "./routes/paths";

export const menuItems = [
    {key: 1, title: "lab1", url: firstLabInPath },
];

export const SVB_MAX = 100;
export const RGB_MAX = 255;
export const H_MAX = 360;

export const clamp = (n: number, low: number, high: number) => {
    if (n < low) {
        return low;
    }
    if (n > high) {
        return high;
    }

    return n;
}

