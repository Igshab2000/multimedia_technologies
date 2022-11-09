import { action, makeObservable, observable } from "mobx";
import { getColorRepresentation, rgbToHls } from "../../../utils/colorConversion";
import { EModelColor, T_HLS, T_RGB } from "../colorTypes";

type THslColor = "_valueColor" | "_valueColorModel";

export class HslStore {
    private _valueColor: string = "";
    private _valueColorModel: T_HLS = {} as T_HLS;

    public type: EModelColor = EModelColor.HLS;

    constructor() {
        makeObservable<this, THslColor>(this, {
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
        const hslColor = rgbToHls(value);
        const { h, s, l } = getColorRepresentation<T_HLS>(hslColor);
        
        this._valueColor = `${h}; ${l}; ${s}`;
    }

    public setValueColorModel(value: string) {
        const valueArr = value.split("; ");

        this._valueColorModel = {
            h: Number(valueArr[0]),
            l: Number(valueArr[1]),
            s: Number(valueArr[2]),
        };
    }
}