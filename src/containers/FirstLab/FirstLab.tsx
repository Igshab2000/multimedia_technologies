import { ColorResult, HsvaColor, Saturation, Wheel } from "@uiw/react-color";
import { Form, Popconfirm, Table, Typography } from "antd";
import { observer } from "mobx-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import EditableCell from "../../components/EditableCell/EditableCell";
import { BaseLayout } from "../../layouts/BaseLayout/BaseLayout";
import { cmykStore, hsbStore, hslStore, labStore, rgbStore, TCustomStore, xyzStore, yuvStore } from "../../stores/colorStore";
import { T_RGB } from "../../stores/colorStore/colorTypes";
import { hsvToRgb, rgbToHex, rgbToHsb } from "../../utils/colorConversion";
import { colorBlockStyle, colorpickerContentStyle, containerStyle, saturationStyle, tableContainer, wheelStyle } from "./FirstLab.styles";
import { IFirstLabProps, IModelColorItem } from "./FirstLab.types";
import { ColorDataModel, ColorValue } from "./FirstLab.utils";

import "./FirstLab.css";

const stores: TCustomStore[] = [ cmykStore, hsbStore, hslStore, labStore, rgbStore, xyzStore, yuvStore ];

const FirstLab: React.FC<IFirstLabProps> = () => {
    const [hsvaWheel, setHsvaWheel] = useState(() => {return { h: 0, s: 100, v: 100, a: 1 }});
    const [hsvaSaturation, setHsvaSaturation] = useState(() => {return { h: hsvaWheel.h, s: 100, v: 100, a: 1 }});
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const dataColors: IModelColorItem[] = stores.map((store: TCustomStore) => new ColorDataModel(store));
    const [data, setData] = useState<IModelColorItem[]>(dataColors);
    const [hexColor, setHexColor] = useState<string>("");
    
    const updateData = useCallback((rgbColor: T_RGB) => {
        const dataColors = stores.map((store) => {
            store.setValueColor(rgbColor);

            return new ColorDataModel(store);
        });        

        setData(dataColors);
        setHexColor(rgbToHex(rgbColor));
    }, []);

    useEffect(() => {
        const h = Math.round(hsvaWheel.h);
        const s = Math.round(hsvaSaturation.s);
        const v = Math.round(hsvaSaturation.v);

        const rgbColor = hsvToRgb({h, s, v});        
        updateData(rgbColor);
    }, [hsvaWheel, hsvaSaturation, updateData]);

    const handleChangeWheel = useCallback((color: ColorResult) => {
        const h = color.hsva.h;

        setHsvaWheel({...hsvaWheel, h});
        setHsvaSaturation((prevState) => ({...prevState, h}));
    }, [hsvaWheel]);

    const handleChangeSaturation = useCallback((newColor: HsvaColor) => {
        const saturation = newColor.s;
        const colorValue = newColor.v;
        
        setHsvaSaturation({...hsvaSaturation, s: saturation, v: colorValue});
        setHsvaWheel((prevState) => {
            return {...prevState, };
        });
    }, [hsvaSaturation]);


    const isEditing = useCallback((record: IModelColorItem) => {
        return record.key === editingKey
    }, [editingKey])
    
    const memoizedColorPicker = useMemo(() => {
        return (
            <div style={colorpickerContentStyle}>
                <div style={wheelStyle}>
                    <Wheel
                        color={hsvaWheel}
                        onChange={handleChangeWheel}
                        className={"wheel-style"}
                    />
                </div>
                <div style={saturationStyle}>
                    <Saturation
                        hsva={hsvaSaturation}
                        onChange={handleChangeSaturation}
                    />
                </div>
            </div>
        )
    }, [hsvaWheel, hsvaSaturation]);

    const getCurrentStore = useCallback((key : string) => {
        return stores.find((store) => store.type === key) as TCustomStore;
    }, []);

    const handleColorElementSave = useCallback( async (key: string) => {
        try {
            const row = (await form.validateFields()) as IModelColorItem;
            console.warn("row", row);
            
            const store = getCurrentStore(key);

            store.setValueColorModel(row.colorTypeValue);

            const modelValue = store.valueColorModel;
            const rgbColor = new ColorValue(modelValue, store.type).rgbValue
            const { h, s, b: v } = rgbToHsb(rgbColor); 

            setHsvaWheel({...hsvaWheel, h});
            setHsvaSaturation({...hsvaSaturation, h, s, v});

        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    }, [form, hsvaWheel, hsvaSaturation, getCurrentStore]);

    const handleColorElementEdit = useCallback((record: IModelColorItem) => {
        form.setFieldsValue({ ...record});
        setEditingKey(record.key);
    }, [form]);

    const handleCancel = useCallback(() => {
        setEditingKey('');
    }, [])

    const getOperationTable = useCallback((editable: boolean, record: IModelColorItem) => {
        if(editable) {
            const confirmTitle = "Sure to cancel?";

            return (
                <span>
                    <Typography.Link onClick={() => handleColorElementSave(record.key)} style={{ marginRight: 8 }}>
                        Save
                    </Typography.Link>
                    <Popconfirm title={confirmTitle} onConfirm={handleCancel}>
                        <a>Cancel</a>
                    </Popconfirm>
                </span>
            );
        }
        
        return (
            <Typography.Link disabled={editingKey !== ''} onClick={() => handleColorElementEdit(record)}>
                Edit
            </Typography.Link>
        )
    }, [handleColorElementSave, handleCancel, handleColorElementEdit])

    const columnConfig = useMemo(() => {
        return [
            {
                title: "Color type",
                dataIndex: "key",
                width: "20%",
                editable: false,
            },
            {
                title: "Value",
                dataIndex: "colorTypeValue",
                width: "55%",
                editable: true,
            },
            {
                title: 'Operation',
                dataIndex: 'Operation',
                render: (_: any, record: IModelColorItem) => {
                    const editable = isEditing(record);

                    return getOperationTable(editable, record);
                }
            }
        ]
    }, [getOperationTable, isEditing]);

    const getMergedColumns = useMemo(() => {
        return columnConfig.map(col => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record: IModelColorItem) => ({
                    record,
                    inputType: "string",
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                }),
            };
        })
    }, [columnConfig]);

    const memoizedColorTable = useMemo(() => {
        return (
            <div style={tableContainer}>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell<IModelColorItem>,
                            },
                        }}
                        bordered
                        dataSource={data}
                        columns={getMergedColumns}
                        rowClassName="editable-row"
                        size={"middle"}
                    />
                </Form>
            </div>
        )
    }, [data, getMergedColumns, form]);

    const memoizedColorBlock = useMemo(() => {
        if(hexColor) {            
            return (
                <div style={colorBlockStyle(hexColor)}/>
            )
        }

        return null;
    }, [hexColor]);

    return (
        <BaseLayout type="1">
            <div style={containerStyle}>
                {memoizedColorPicker}
                {memoizedColorBlock}
                {memoizedColorTable}
                {/* <AppTest /> */}
            </div>
        </BaseLayout>
    );
}

export default observer(FirstLab);