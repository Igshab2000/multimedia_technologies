import { action, makeObservable, observable } from "mobx";
import { getColorRepresentation, rgbToHsb } from "../../../utils/colorConversion";
import { EModelColor, T_HSB, T_RGB } from "../colorTypes";

type THsbColor = "_valueColor" | "_valueColorModel";

export class HsbStore {
    private _valueColor: string = "";
    private _valueColorModel: T_HSB = {} as T_HSB;

    public type: EModelColor = EModelColor.HSB;

    constructor() {
        makeObservable<this, THsbColor>(this, {
            _valueColor: observable,
            _valueColorModel: observable,
            setValueColor: action,
            setValueColorModel: action,
        });
    }

    //----------------------------------------COMPUTED------------------------------------//
    public get valueColor() {
        return this._valueColor;
    }

    public get valueColorModel() {
        return this._valueColorModel;
    }

    //----------------------------------------ACTIONS------------------------------------//
    public setValueColor(value: T_RGB) {
        const hsbColor = rgbToHsb(value);
        const { h, s, b } = getColorRepresentation<T_HSB>(hsbColor);

        this._valueColor = `${h}; ${s}; ${b}`;
    }

    public setValueColorModel(value: string) {
        const valueArr = value.split("; ");

        this._valueColorModel = {
            h: Number(valueArr[0]),
            s: Number(valueArr[1]),
            b: Number(valueArr[2]),
        };
    }
}