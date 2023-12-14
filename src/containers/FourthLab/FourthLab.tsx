import { Button, Card, Input, message, Select, Typography } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { BaseLayout } from "../../layouts/BaseLayout/BaseLayout";
import { ETypeString, getDecodeText, getEncodedText, getEncodeRgb } from "./FourthLab.utils";

const { Title } = Typography;

const inputStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    width: "100%"
}

export const FourthLab: React.FC = () => {
    const [ inputStringType, setInputStringType ] = useState<string>(ETypeString.alphabetic);
    const [ inputValue, setInputValue ] = useState<string>("");
    const [ isInputError, setIsInputError ] = useState<boolean>(false);

    const [ encodedText, setEncodedText ] = useState<string>();
    const [ decodedText, setDecodedText ] = useState<string>();
    const [ encodedTextBits, setEncodedTextBits ] = useState<number>();
    const [ textBits, setTextBits ] = useState<number>();
    const [ compression, setCompression ] = useState<number>();

    const [messageApi, contextHolder] = message.useMessage();

    const handleChange = useCallback((selectValue: string) => {
        setInputStringType(selectValue);
        setInputValue("");
    }, []);

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        let result = "";

        if(inputStringType === ETypeString.alphabetic) {
            // result = value.replace(/[^A-Za-zА-Яа-яЁё]/g,'');
            result = value;
        }

        if(inputStringType === ETypeString.rgb) {
            result = value.replace(/[^0-9\s\(\)\,]/g,'');
        }

        setInputValue(result);
    }, [inputStringType]);

    const handleButtonClick = useCallback(() => {
        if(!inputValue) {
            setIsInputError(true);
        } else {
            setIsInputError(false);
            console.log("inputStringType", inputStringType);
            
            const { dictionary, encodedText } = 
                inputStringType === ETypeString.rgb ? 
                getEncodeRgb(inputValue) : 
                getEncodedText(inputValue);
            
            if(inputStringType === ETypeString.rgb && !encodedText) {
                messageApi.error('Строка не удовлетворяет формату RGB!');
                return;
            }

            const decodedText = getDecodeText(encodedText, inputStringType, dictionary);
            const textBits = (new Blob([inputValue]).size) * 8;
	        const encodedTextBits = (new Blob([encodedText]).size / 2) * 8;
	        const compression = Math.round((textBits - encodedTextBits) / textBits * 100);

            setEncodedText(encodedText);
            setDecodedText(decodedText);
            setEncodedTextBits(encodedTextBits);
            setTextBits(textBits);
            setCompression(compression);
        }

    }, [inputStringType, inputValue]);

    const memoizedHintSelect = useMemo(() => {
        const result = "Формат ввода для";

        if(inputStringType === ETypeString.alphabetic) {
            return `${result} букв: русские или английские буквы без пробелов`;
        }

        if(inputStringType === ETypeString.rgb) {
            return `${result} rgb: последовательности вида (r,g,b) через запятую без пробела`;
        }
    }, [inputStringType]);

    return (
        <BaseLayout type="4">
            {contextHolder}
            <div style={{width: "600px"}}>
                <Title level={4}>Тип вводимой строки</Title>
                <Select
                    defaultValue={ETypeString.alphabetic}
                    style={{ width: 250 }}
                    onChange={handleChange}
                    options={[
                        { label: 'Буквенный', value: ETypeString.alphabetic },
                        { label: 'RGB', value: ETypeString.rgb },
                    ]}
                />
                <div style={{marginTop: "25px"}}>
                    <Title level={5}>{memoizedHintSelect}</Title>
                </div>
                <div style={inputStyle}>
                    <Input 
                        value={inputValue}
                        addonBefore={"Строка:"} 
                        type={"test"} 
                        onChange={handleInputChange}
                        style={{ width: 400 }}
                        status={isInputError ? "error" : ""} 
                    />
                    <Button 
                        type="primary" 
                        onClick={handleButtonClick}
                        style={{marginLeft: "20px"}}
                    >
                        Закодировать
                    </Button>
                </div>
                <div style={{marginTop: "40px"}}>
                <Card title="Результат" size="default">
                    <p>Закодированная строка: {encodedText}</p>
                    <p>Бит в закодированной строке: {encodedTextBits}</p>
                    <p>Декодированная строка: {decodedText}</p>
                    <p>Бит в строке: {textBits}</p>
                    <p>Степень компрессии: {compression}</p>
                </Card>
            </div>
            </div>
        </BaseLayout>
    );
}