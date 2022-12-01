import { Layout } from "antd";
import React, { useCallback } from "react";
import { useHistory, useLocation } from "react-router";
import { Header } from "../../components/Header/Header";
import { TMenuItem } from "../../components/Menu/Menu.types";
import { menuItems } from "../../utils/consts";
import { contentStyle, wrapperContentStyle } from "./BaseLayout.styles";

const { Content } = Layout;

export const BaseLayout: React.FC<React.PropsWithChildren<{type: string}>> = (props: React.PropsWithChildren<{type: string}>) => {
    const { children } = props;

    const history = useHistory();

    // const handleMenuitemClick = useCallback((item: TMenuItem | undefined) => {
    //     console.log(item);
        
    //     if(item) {
    //         history.push(item.url);            
    //     }
    // }, [history]);

    console.log("type", props.type)

    return (
        <Layout>
            <Header menuItems={menuItems}/>
            <Content style={wrapperContentStyle}>
                <div style={contentStyle}>
                    {children}
                </div>
            </Content>
        </Layout>
    )
}