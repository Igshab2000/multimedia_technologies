import { action, makeObservable, observable } from "mobx";
import { getColorRepresentation } from "../../../utils/colorConversion";
import { EModelColor, T_RGB } from "../colorTypes";

type TRgbColor = "_valueColor" | "_valueColorModel";

export class RgbStore {
    private _valueColor: string = "";
    private _valueColorModel: T_RGB = {} as T_RGB;

    public type: EModelColor = EModelColor.RGB;

    constructor() {
        makeObservable<this, TRgbColor>(this, {
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
        const { r, g, b } = getColorRepresentation<T_RGB>(value);
        
        this._valueColor = `${r}; ${g}; ${b}`;
    }

    public setValueColorModel(value: string) {
        const valueArr = value.split("; ");

        this._valueColorModel = {
            r: Number(valueArr[0]),
            g: Number(valueArr[1]),
            b: Number(valueArr[2]),
        };
    }
}