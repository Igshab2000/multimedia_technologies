import React, { useMemo } from "react";
import { IHeaderProps } from "./Header.types";
import { Layout } from 'antd'
import { headerStyle } from "./Header.styles";
import { Menu } from "../Menu/Menu";
import { useHistory } from "react-router";


const { Header: AntHeader } = Layout;

export const Header: React.FC<IHeaderProps> = (props: IHeaderProps) => {
    const { menuItems } = props;
    const history = useHistory();

    const memoizedDefaultSelectedKeys = useMemo(() => {
        const item =  menuItems.find((item) => item.url === history.location.pathname);

        return item ? [String(item.key)] : ["1"];
    }, [])

    return (
        <AntHeader style={headerStyle}>
            <Menu 
                theme={"dark"}
                mode={"horizontal"}
                menuItems={menuItems}
                defaultSelectedKeys={memoizedDefaultSelectedKeys}
                // onClick={handleClick}
            />
        </AntHeader> 
    )
}