import { action, makeObservable, observable } from "mobx";
import { T_HSV, T_RGB } from "./colorTypes";

type TColorStoreField = "_hue" | "_saturation" | "_colorValue" | "_hsv" | "_rgb";


export class ColorStore {
    //Цветовой тон 
    private _hue = 0;
    //Насыщенность
    private _saturation = 0;
    //Значение цвета
    private _colorValue = 0;

    private _hsv: T_HSV = {
        h: this._hue,
        s: this._saturation,
        v: this._colorValue,
    }

    private _rgb: T_RGB = {
        r: 0,
        g: 0,
        b: 0,
    }

    constructor() {
        makeObservable<this, TColorStoreField>(this, {
            _hue: observable,
            setHue: action,
            _saturation: observable,
            setSaturation: action,
            _colorValue: observable,
            setColorValue: action,
            _hsv: observable,
            _rgb: observable,
        });
    }

    //----------------------------------------COMPUTED------------------------------------//

    public get hue() {
        return this._hue;
    }

    public get saturation() {
        return this._saturation;
    }

    public get colorValue() {
        return this._colorValue;
    }

    public get hsv() {
        return this._hsv;
    }

    public get rgb() {
        return this._rgb;
    }

    //----------------------------------------ACTIONS------------------------------------//

    public setHue(hue: number) {
        this._hue = hue;
    }

    public setSaturation(saturation: number) {
        this._saturation = saturation;
    }

    public setColorValue(colorValue: number) {
        this._colorValue = colorValue;
    }

    public setRgb(hsv: T_HSV) {
        
    }
}