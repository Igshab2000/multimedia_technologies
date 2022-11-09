import React from "react";
import { ISpinnerProps } from "./Spinner.types";
import { Spin } from "antd";
import { wrapperStyle } from "./Spinner.styles";

export const Spinner: React.FC<ISpinnerProps> = (props) => {
    const { size, tip, ...rest} = props;

    return (
        <div style={wrapperStyle}>
            <Spin 
                size={size ? size : "large"}
                tip={tip ? tip : "Загрузка..."}
                {...rest}
            />
        </div>
    );
}
