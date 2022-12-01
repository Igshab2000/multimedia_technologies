import { Button, Col, Radio, RadioChangeEvent, Row, Slider } from "antd";
import React, { RefObject, useCallback, useMemo, useRef, useState } from "react";
import Polygon, { EInvertType, ENegativeType } from "../../components/Polygon/Polygon";
import { BaseLayout } from "../../layouts/BaseLayout/BaseLayout";
import { buttonContainerStyle, containerStyle, imageBlockStyle, settingStyle } from "./SecondLab.styles";

const SecondLab: React.FC = () => {
    const [file, setFile] = useState<string>(() => "");
    const [brightnessValue, setBrightnessValue] = useState<number>(() => 0);
    const [contrastValue, setContrastValue] = useState<number>(() => 0);
    const [negativeValue, setNegativeValue] = useState<number>(() => 0);
    const [invertType, setInvertType] = useState();
    const [negativeType, setNegativeType] = useState();

    const fileFieldRef = useRef<HTMLInputElement>();

    const handleSelectFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files) {
            setFile(URL.createObjectURL(event.target.files[0]));
        }
    }, []);

    const handleClickButton = useCallback(() => {
        if(fileFieldRef.current) {
            fileFieldRef.current.click();
        }
    }, []);

    const handleChangeBrightness = useCallback((value: number) => {
        setBrightnessValue(value);
    }, []);

    const handleChangeNegative = useCallback((value: number) => {
        setNegativeValue(value);
    }, []);

    const handleChangeInvertType = useCallback((event: RadioChangeEvent) => {
        const invertType = event.target.value;

        setInvertType(invertType);
    }, []);

    const handleChangeNegativeType = useCallback((event: RadioChangeEvent) => {
        const negativeType = event.target.value;

        setNegativeType(negativeType);
    }, []);

    const memoizedImage = useMemo(() => {
        if(file) {
            return (
                <Polygon
                    file={file}
                    brightnessValue={brightnessValue}
                    contrastValue={contrastValue}
                    invert={invertType}
                    negative={negativeType}
                    negativeValue={negativeValue}
                />
            );
        }

        return null;
    }, [file, brightnessValue, contrastValue, invertType, negativeType, negativeValue]);
    
    return (
        <BaseLayout type="2">
            <div style={containerStyle}>
                <div style={buttonContainerStyle}>
                    <input
                        ref={fileFieldRef as RefObject<HTMLInputElement>}
                        type={"file"}
                        onChange={handleSelectFile}
                        style={{ display: "none" }}
                    />
                    <Button onClick={handleClickButton} style={{ marginBottom: "16px" }}>
                        Выбрать изображение
                    </Button>
                </div>
                <div style={settingStyle}>
                    <div>
                        <Col>
                            <Row>Инвертирование</Row>
                            <Radio.Group onChange={handleChangeInvertType}>
                                <Row>
                                    <Radio value={undefined}>Отсутствует</Radio>
                                </Row>
                                <Row>
                                    <Radio value={EInvertType.FULL}>Полное</Radio>
                                </Row>
                                <Row>
                                    <Radio value={EInvertType.HALF_LEFT_RIGHT}>Частичное(слева направо)</Radio>
                                </Row>
                                <Row>
                                    <Radio value={EInvertType.HALF_UP_DOWN}>Частичное(сверху вниз)</Radio>
                                </Row>
                            </Radio.Group>
                            <Row>
                                <Col flex={"80px"}>
                                    <span style={{ display: "inline-block", margin: "6px auto" }}>Яркость</span>
                                </Col>
                                <Col flex={"auto"}>
                                    <Slider
                                    key={"brightness"}
                                    defaultValue={brightnessValue}
                                    max={255}
                                    min={-255}
                                    onAfterChange={handleChangeBrightness}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col flex={"80px"}>
                                    <span style={{ display: "inline-block", margin: "6px auto" }}>Контраст</span>
                                </Col>
                                <Col flex={"auto"}>
                                    <Slider
                                    key={"contrast"}
                                    defaultValue={contrastValue}
                                    onAfterChange={handleChangeBrightness}
                                    max={255}
                                    min={-255}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </div>
                    <div>
                        <Col>
                            <Row>Негатив</Row>
                            <Radio.Group onChange={handleChangeNegativeType}>
                                <Row>
                                    <Radio value={undefined}>Отсутствует</Radio>
                                </Row>
                                <Row>
                                    <Radio value={ENegativeType.FULL}>Полное</Radio>
                                </Row>
                                <Row>
                                    <Radio value={ENegativeType.HALF_LEFT_RIGHT}>Частичное(слева направо)</Radio>
                                </Row>
                                <Row>
                                    <Radio value={ENegativeType.HALF_UP_DOWN}>Частичное(сверху вниз)</Radio>
                                </Row>
                            </Radio.Group>
                            <Row>
                                <Col flex={"auto"}>
                                    <Slider
                                    key={"negative"}
                                    defaultValue={negativeValue}
                                    max={255}
                                    min={0}
                                    onAfterChange={handleChangeNegative}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </div>
                </div>
                <div style={imageBlockStyle}>
                    {memoizedImage}
                </div>
            </div>
        </BaseLayout>
    );
};

export default SecondLab;