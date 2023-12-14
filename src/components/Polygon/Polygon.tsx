import { clone } from "lodash";
import React from "react";

export enum EInvertType {
  FULL = "FULL",
  HALF_UP_DOWN = "HALF_UP_DOWN",
  HALF_LEFT_RIGHT = "HALF_LEFT_RIGHT",
}

export enum ENegativeType {
  FULL = "FULL",
  HALF_UP_DOWN = "HALF_UP_DOWN",
  HALF_LEFT_RIGHT = "HALF_LEFT_RIGHT",
}

interface IPolygonProps {
  file?: string;
  brightnessValue: number;
  contrastValue: number;
  negativeValue: number;
  invert?: EInvertType;
  negative?: ENegativeType;
}

interface IPolygonState {
  readyToRender: false;
}

class Polygon extends React.PureComponent<IPolygonProps, IPolygonState> {
  private static invert(rgb: number[]): number[] {
    let [r, g, b] = rgb;
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;

    return [r, g, b];
  }

  private static negative(rgb: number[], negativeValue: number): number[] {
    let [r, g, b] = rgb;

    if (!(r >= negativeValue || g >= negativeValue || b >= negativeValue)) {
      r = 0;
      g = 0;
      b = 0;
    } else {
      r = 255;
      g = 255;
      b = 255;
    }

    return [r, g, b];
  }

  private static applyContrast(rgb: number[], avgGray: number, contrast: number): number[] {
    contrast = contrast / 255;
    let [r, g, b] = rgb;
    r += (r - avgGray) * contrast;
    g += (g - avgGray) * contrast;
    b += (b - avgGray) * contrast;

    return [r, g, b];
  }

  private static applyBrightness(rgb: number[], brightness: number): number[] {
    let [r, g, b] = rgb;

    r += brightness;
    g += brightness;
    b += brightness;
    return [r, g, b];
  }

  private static floorRgbData(rgb: number[]): number[] {
    let [r, g, b] = rgb;
    if (r > 255) {
      r = 255;
    } else if (r < 0) {
      r = 0;
    }
    if (g > 255) {
      g = 255;
    } else if (g < 0) {
      g = 0;
    }
    if (b > 255) {
      b = 255;
    } else if (b < 0) {
      b = 0;
    }

    return [r, g, b];
  }

  private static calcRgbData(
    srcData: Uint32Array,
    avgGray: number,
    contrastValue: number,
    brightnessValue: number
  ): Uint32Array {
    const data = clone(srcData);

    for (let i = 0; i < data.length; i++) {
      let r = data[i] & 0xff;
      let g = (data[i] >> 8) & 0xff;
      let b = (data[i] >> 16) & 0xff;

      [r, g, b] = this.applyContrast([r, g, b], avgGray, contrastValue);
      [r, g, b] = this.applyBrightness([r, g, b], brightnessValue);
      [r, g, b] = this.floorRgbData([r, g, b]);

      data[i] = (data[i] & 0xff000000) | (b << 16) | (g << 8) | r;
    }
    return data;
  }

  private static getAvgGrayColor(data: Uint32Array): number {
    let avgGray = 0;

    for (let i = 0; i < data.length; i++) {
      let r = data[i] & 255;
      let g = (data[i] >> 8) & 255;
      let b = (data[i] >> 16) & 255;
      avgGray += r * 0.2126 + g * 0.7152 + b * 0.0722;
    }

    return avgGray;
  }

  private histogramSrcRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  private imgSrcRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  private histogramOutRef: React.RefObject<HTMLCanvasElement> = React.createRef();
  private imgOutRef: React.RefObject<HTMLCanvasElement> = React.createRef();

  constructor(props: IPolygonProps) {
    super(props);
    this.renderSrcImg = this.renderSrcImg.bind(this);
    this.renderOutImg = this.renderOutImg.bind(this);
  }

  public componentDidMount() {
    this.renderSrcImg();
    this.renderOutImg();
  }

  public componentDidUpdate(prevProps: Readonly<IPolygonProps>) {
    console.log("componentDidUpdate");
    
    const { file } = this.props;
    if (
      (file && prevProps.file !== file) ||
      prevProps.brightnessValue !== this.props.brightnessValue ||
      prevProps.contrastValue !== this.props.contrastValue ||
      prevProps.invert !== this.props.invert ||
      prevProps.negativeValue !== this.props.negativeValue ||
      prevProps.negative !== this.props.negative
    ) {
      this.renderOutImg();
    }

    if (file && prevProps.file !== file) {
      this.renderSrcImg();
    }
  }

  private buildHistogram(imageRef: HTMLCanvasElement, histogramRef: HTMLCanvasElement) {
    const { brightnessValue, contrastValue } = this.props;
    const imageCanvas = imageRef.getContext("2d") as CanvasRenderingContext2D ;
    const pixels = imageCanvas.getImageData(
      0,
      0,
      (this.imgSrcRef.current as HTMLCanvasElement).width,
      (this.imgSrcRef.current as HTMLCanvasElement).height
    );
    const data = new Uint32Array(pixels.data.buffer);
    const avgGray = Polygon.getAvgGrayColor(data);
    const modifyData = Polygon.calcRgbData(data, avgGray, contrastValue, brightnessValue);

    // Histogram
    let histBrightness = new Array(256).fill(0);
    for (let i = 0; i < modifyData.length; i++) {
      let r = modifyData[i] & 0xff;
      let g = (modifyData[i] >> 8) & 0xff;
      let b = (modifyData[i] >> 16) & 0xff;
      histBrightness[r]++;
      histBrightness[g]++;
      histBrightness[b]++;
    }

    let maxBrightness = 0;
    for (let i = 1; i < 256; i++) {
      if (maxBrightness < histBrightness[i]) {
        maxBrightness = histBrightness[i];
      }
    }

    const histogram = histogramRef.getContext("2d") as CanvasRenderingContext2D;
    const dx = histogramRef.width / 256;
    const dy = histogramRef.height / maxBrightness;
    histogram.lineWidth = dx;
    histogram.fillStyle = "#fff";
    histogram.fillRect(0, 0, histogramRef.width, histogramRef.height);

    for (let i = 0; i < 256; i++) {
      let x = i * dx;
      histogram.strokeStyle = "#000000";
      histogram.beginPath();
      histogram.moveTo(x, histogramRef.height);
      histogram.lineTo(x, histogramRef.height - histBrightness[i] * dy);
      histogram.closePath();
      histogram.stroke();
    }

    imageCanvas.putImageData(pixels, 0, 0);
  }

  private renderSrcImg(): void {
    if (!this.imgSrcRef.current || !this.histogramSrcRef.current) {
      return;
    }
    const canvas = this.imgSrcRef.current.getContext("2d") as CanvasRenderingContext2D;

    const img = new Image();
    img.src = this.props.file as string;
    img.onload = () => {
      canvas.drawImage(img, 0, 0, 720, 480);
      this.buildHistogram(this.imgSrcRef.current as HTMLCanvasElement, this.histogramSrcRef.current as HTMLCanvasElement);
    };
  }

  private renderOutImg() {
    if (!this.imgOutRef.current || !this.histogramOutRef.current) {
      return;
    }

    const canvas = this.imgOutRef.current.getContext("2d") as CanvasRenderingContext2D ;
    const img = new Image();
    img.src = this.props.file as string;
    img.onload = () => {
      canvas.drawImage(img, 0, 0, 720, 480);
      this.inverseImage();
      this.applyNegative();
      this.buildHistogram(this.imgOutRef.current as HTMLCanvasElement, this.histogramOutRef.current as HTMLCanvasElement);
    };
  }

  private applyNegative(): void {
    const { negative, negativeValue } = this.props;

    if (!negative) {
      return;
    }

    const width = (this.imgOutRef.current as HTMLCanvasElement).width;
    const height = (this.imgOutRef.current as HTMLCanvasElement).height;
    let halfWidth = Math.floor(width / 2);

    const image = (this.imgOutRef.current as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D ;
    const pixels = image.getImageData(0, 0, width, height);
    const data = pixels.data;
    let includedInterval = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      if (includedInterval === width) {
        includedInterval = 0;
      }
      const [r, g, b] = Polygon.negative([data[i], data[i + 1], data[i + 2]], negativeValue);
      switch (negative) {
        case ENegativeType.HALF_LEFT_RIGHT:
          if (includedInterval < halfWidth) {
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
          }
          includedInterval++;
          break;
        case ENegativeType.HALF_UP_DOWN:
          if (data.length / 2 >= i) {
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
          }
          break;
        case ENegativeType.FULL:
        default:
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
      }
    }
    image.putImageData(pixels, 0, 0);
  }

  private inverseImage(): void {
    const { invert } = this.props;

    if (!invert) {
      return;
    }
    const width = (this.imgOutRef.current as HTMLCanvasElement).width;
    const height = (this.imgOutRef.current as HTMLCanvasElement).height;
    let halfWidth = Math.floor(width / 2);

    const image = (this.imgOutRef.current as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D ;
    const pixels = image.getImageData(0, 0, width, height);
    const data = pixels.data;
    let includedInterval = 0;

    for (let i = 0; i < data.length; i += 4) {
      if (includedInterval === width) {
        includedInterval = 0;
      }
      const [r, g, b] = Polygon.invert([data[i], data[i + 1], data[i + 2]]);
      switch (invert) {
        case EInvertType.HALF_LEFT_RIGHT:
          if (includedInterval < halfWidth) {
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
          }
          includedInterval++;
          break;
        case EInvertType.HALF_UP_DOWN:
          if (data.length / 2 >= i) {
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
          }
          break;
        case EInvertType.FULL:
        default:
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
      }
    }
    image.putImageData(pixels, 0, 0);
  }

  public render() {
    return (
      <>
        <div id={"target"} style={{ display: "flex", justifyContent: "space-around"}}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <canvas ref={this.imgSrcRef} width={350} height={350} />
            <canvas ref={this.histogramSrcRef} width={350} height={108} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <canvas ref={this.imgOutRef} width={350} height={350} />
            <canvas ref={this.histogramOutRef} width={350} height={108} />
          </div>
        </div>
      </>
    );
  }
}

export default Polygon;
