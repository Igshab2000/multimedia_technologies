import { Layout } from "antd";
import React from "react";
import { Header } from "../../components/Header/Header";
import { menuItems } from "../../utils/consts";
import { contentStyle, wrapperContentStyle } from "./BaseLayout.styles";

const { Content } = Layout;

export const BaseLayout: React.FC<React.PropsWithChildren<{type: string}>> = (props: React.PropsWithChildren<{type: string}>) => {
    const { children } = props;

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