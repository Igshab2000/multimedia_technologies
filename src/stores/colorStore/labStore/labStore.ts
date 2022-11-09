import { action, makeObservable, observable } from "mobx";
import { getColorRepresentation, rgbToXvz, xyzToLab } from "../../../utils/colorConversion";
import { EModelColor, T_LAB, T_RGB, T_XYZ } from "../colorTypes";

type TLabColor = "_valueColor" | "_valueColorModel";

export class LabStore {
    private _valueColor: string = "";
    private _valueColorModel: T_LAB = {} as T_LAB;

    public type: EModelColor = EModelColor.LAB;

    constructor() {
        makeObservable<this, TLabColor>(this, {
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
        const xyzColor =  rgbToXvz(value);
        const labColor = xyzToLab(getColorRepresentation<T_XYZ>(xyzColor));
        const { l, a, b } = getColorRepresentation<T_LAB>(labColor);

        this._valueColor = `${l}; ${a}; ${b}`;
    }

    public setValueColorModel(value: string) {
        const valueArr = value.split("; ");

        this._valueColorModel = {
            l: Number(valueArr[0]),
            a: Number(valueArr[1]),
            b: Number(valueArr[2]),
        };
    }
}