import { Menu as AntMenu } from "antd";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { IMenuProps } from "./Menu.types";

export const Menu: React.FC<IMenuProps> = (props: IMenuProps) => {
    const { menuItems, ...rest } = props;

    const memoizedMenuItems = useMemo(() => {
        return menuItems.map((menuItem) => {
            console.log("menuItem.url", menuItem.url);
            
            return(
                <AntMenu.Item key={menuItem.key}>
                    <Link to={menuItem.url}>
                        {menuItem.title} 
                    </Link>
                </AntMenu.Item>
            )
        });
    }, [menuItems]);
    
    return (
        <AntMenu {...rest}>{memoizedMenuItems}</AntMenu> 
    )
}