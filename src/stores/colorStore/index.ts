import { CmykStore } from "./cmykStore/cmykStore";
import { ColorStore } from "./ColorStore";
import { HsbStore } from "./hsbStore/hsbStore";
import { HslStore } from "./hslStore/hslStore";
import { LabStore } from "./labStore/labStore";
import { RgbStore } from "./rgbStore/rgbStore";
import { XyzStore } from "./xyzStore/xyzStore";
import { YuvStore } from "./yuvStore/yuvStore";

export const colorStore = new ColorStore();

export const rgbStore = new RgbStore();
export const cmykStore = new CmykStore();
export const hsbStore = new HsbStore();
export const hslStore = new HslStore();
export const labStore = new LabStore();
export const xyzStore = new XyzStore();
export const yuvStore = new YuvStore();

export type TCustomStore = RgbStore | CmykStore | HsbStore | HslStore | LabStore | XyzStore | YuvStore;



