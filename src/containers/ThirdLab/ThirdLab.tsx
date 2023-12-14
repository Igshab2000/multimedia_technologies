import { Button, Card, Form, Input, Radio } from "antd"
import React, { useCallback, useState } from "react"
import { BaseLayout } from "../../layouts/BaseLayout/BaseLayout"
import { lengthFour, lengthOne, lengthThird, lengthTwo } from "./utils";

export const ThirdLab: React.FC = () => {
    const [ coding, setCoding ] = useState<string>();
    const [ decoding, setDecoding ] = useState<string>();
    const [ bitDo, setBitDo ] = useState<number>();
    const [ bitPosle, setBitPosle ] = useState<number>();
    const [ compressiya, setCompressiya ] = useState<number>();

    const setState = useCallback((result: any) => {
        const {coding, decoding, bitDo, bitPosle, compressiya} = result;

        setCoding(coding);
        setDecoding(decoding);
        setBitDo(bitDo);
        setBitPosle(bitPosle);
        setCompressiya(compressiya);
    }, []);

    const handleFormLayoutChange = useCallback(({chainLength, subsequence}: any) => {
        if(chainLength === "one") {
            const result = lengthOne(subsequence);
            setState(result);
        } else if(chainLength === "two") {
            const result = lengthTwo(subsequence);
            setState(result);
        } else if(chainLength === "three") {
            const result = lengthThird(subsequence);
            setState(result);
        } else if(chainLength === "four") {
            const result = lengthFour(subsequence);
            setState(result);
        }
    }, [setState]);
    
    return (
        <BaseLayout type="3">
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={handleFormLayoutChange}
                style={{width: "900px"}}
            >
                <Form.Item label="Длина цепочки:" name="chainLength">
                    <Radio.Group>
                        <Radio value="one">1</Radio>
                        <Radio value="two">2</Radio>
                        <Radio value="three">3</Radio>
                        <Radio value="four">4</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Последовательность:" name="subsequence">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary">Закодировать</Button>
                </Form.Item>
            </Form>
            <div style={{marginTop: "40px"}}>
                <Card title="Результат" size="default">
                    <p>Результат кодирования: {coding}</p>
                    <p>Результат декодирования: {decoding}</p>
                    <p>Количество бит до сжатия: {bitDo}</p>
                    <p>Количество бит после сжатия: {bitPosle}</p>
                    <p>Степень компрессии: {compressiya}</p>
                </Card>
            </div>
        </BaseLayout>
    )
}