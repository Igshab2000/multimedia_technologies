import { action, makeObservable, observable } from "mobx";
import { getColorRepresentation, rgbToYuv } from "../../../utils/colorConversion";
import { EModelColor, T_RGB, T_YUV } from "../colorTypes";

type TYuvColor = "_valueColor" | "_valueColorModel";

export class YuvStore {
    private _valueColor: string = "";
    private _valueColorModel: T_YUV = {} as T_YUV;

    public type: EModelColor = EModelColor.YUV;

    constructor() {
        makeObservable<this, TYuvColor>(this, {
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
        const rgbValue = getColorRepresentation<T_RGB>(value);
        const yuvColor = rgbToYuv(rgbValue);
        const { u, y, v } = getColorRepresentation<T_YUV>(yuvColor);

        this._valueColor = `${y}; ${u}; ${v}`;
    }

    public setValueColorModel(value: string) {
        const valueArr = value.split("; ");

        this._valueColorModel = {
            y: Number(valueArr[0]),
            u: Number(valueArr[1]),
            v: Number(valueArr[2]),
        };
    }
}