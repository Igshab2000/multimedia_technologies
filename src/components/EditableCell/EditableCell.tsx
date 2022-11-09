import { Form, Input, InputNumber } from "antd";
import React from "react";
import { formItemStyle } from "./EditableCell.styles";
import { EditableCellProps } from "./EditableCell.types";

const EditableCell = <T,>(props: React.PropsWithChildren<EditableCellProps<T>>): JSX.Element => {
    const { editing, dataIndex, title, inputType, record, index, children, ...restProps } = props;
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;    

    return (
        <td {...restProps}>
            {editing ? (
            <Form.Item
                name={dataIndex}
                style={formItemStyle}
                rules={
                    [
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]
                }
            >
                {inputNode}
            </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default EditableCell;