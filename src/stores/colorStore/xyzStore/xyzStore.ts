import { action, makeObservable, observable } from "mobx";
import { getColorRepresentation, rgbToXvz } from "../../../utils/colorConversion";
import { EModelColor, T_RGB, T_XYZ } from "../colorTypes";

type TXyzColor = "_valueColor" | "_valueColorModel";

export class XyzStore {
    private _valueColor: string = "";
    private _valueColorModel: T_XYZ = {} as T_XYZ;

    public type: EModelColor = EModelColor.XYZ;

    constructor() {
        makeObservable<this, TXyzColor>(this, {
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
        const xyzColor =  rgbToXvz(rgbValue);

        const { x, y, z } = getColorRepresentation<T_XYZ>(xyzColor);

        this._valueColor = `${x}; ${y}; ${z}`;
    }

    public setValueColorModel(value: string) {
        const valueArr = value.split("; ");

        this._valueColorModel = {
            x: Number(valueArr[0]),
            y: Number(valueArr[1]),
            z: Number(valueArr[2]),
        };
    }
}