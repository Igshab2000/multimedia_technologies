import React, { useMemo } from "react";
import { IHeaderProps } from "./Header.types";
import { Layout } from 'antd'
import { headerStyle } from "./Header.styles";
import { Menu } from "../Menu/Menu";

const { Header: AntHeader } = Layout;

export const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
    const { menuItems } = props;

    return (
        <AntHeader style={headerStyle}>
            <Menu 
                theme={"dark"}
                mode={"horizontal"}
                menuItems={menuItems}
                defaultSelectedKeys={["1"]}
            />
        </AntHeader> 
    )
}