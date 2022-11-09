import { MenuProps } from "antd";

export type TMenuItem = {
    key: number,
    title: string,
    url: string,
}

export interface IMenuProps extends MenuProps {
    menuItems: TMenuItem[];
}