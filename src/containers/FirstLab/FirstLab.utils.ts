import { TCustomStore } from "../../stores/colorStore";
import { EModelColor, T_CMYK, T_HLS, T_HSB, T_HSV, T_LAB, T_RGB, T_XYZ, T_YUV } from "../../stores/colorStore/colorTypes";
import { cmykToRgb, hslToRgb, hsvToRgb, labToRgb, xyzToRgb, yuvToRgb } from "../../utils/colorConversion";

export class ColorDataModel {
    public key: string;
    public colorTypeValue: string;

    constructor(store: TCustomStore) {
        this.key = store.type;
        this.colorTypeValue = store.valueColor;
    }
}

export class ColorValue<T> {
    private _colorModelValue: T;
    private _type: EModelColor;

    constructor(colorModelValue: T, type: EModelColor) {
        this._colorModelValue = colorModelValue;
        this._type = type;
    }

    public get rgbValue (): T_RGB {
        let rgbModelValue: T_RGB;

        switch(this._type) {
            case EModelColor.RGB:
                rgbModelValue = this._colorModelValue as T_RGB;
                break;

            case EModelColor.CMYK:
                rgbModelValue =  cmykToRgb(this._colorModelValue as T_CMYK);
                break;

            case EModelColor.HLS:
                rgbModelValue = hslToRgb(this._colorModelValue as T_HLS);
                break;

            case EModelColor.HSB:
                const { b, ...rest } = this._colorModelValue as T_HSB;
                const hsvModelColor = {
                    ...rest,
                    v: b,
                };

                rgbModelValue = hsvToRgb(hsvModelColor as T_HSV);
                break;

            case EModelColor.LAB:
                rgbModelValue = labToRgb(this._colorModelValue as T_LAB);
                break;

            case EModelColor.XYZ:
                rgbModelValue = xyzToRgb(this._colorModelValue as T_XYZ);
                break;

            case EModelColor.YUV:
                rgbModelValue = yuvToRgb(this._colorModelValue as T_YUV);
                break;

            default:
                rgbModelValue = this._colorModelValue as T_RGB;
        }

        return rgbModelValue;
    }
}
