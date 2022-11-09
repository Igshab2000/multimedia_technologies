import { action, makeObservable, observable } from "mobx";
import { getColorRepresentation, rgbToCmyk } from "../../../utils/colorConversion";
import { EModelColor, T_CMYK, T_RGB } from "../colorTypes";

type TCmykColor = "_valueColor" | "_valueColorModel";

export class CmykStore {
    private _valueColor: string = "";
    private _valueColorModel: T_CMYK = {} as T_CMYK;

    public type: EModelColor = EModelColor.CMYK;

    constructor() {
        makeObservable<this, TCmykColor>(this, {
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
        const cymkColor = rgbToCmyk(value);
        const { c, y, m, k } = getColorRepresentation<T_CMYK>(cymkColor);

        this._valueColor = `${c}; ${m}; ${y}; ${k}`;
    }

    public setValueColorModel(value: string) {
        const valueArr = value.split("; ");

        this._valueColorModel = {
            c: Number(valueArr[0]),
            m: Number(valueArr[1]),
            y: Number(valueArr[2]),
            k: Number(valueArr[3]),
        };
    }
}