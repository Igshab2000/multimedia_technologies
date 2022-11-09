import React from "react";
import { generatePath, Redirect, RouteChildrenProps } from "react-router";
import { RouteConfig } from "react-router-config";
// import FirstLab from "../containers/FirstLab/FirstLab";
import withLazyLoader from "../hocs/withLazyLoader";
import { firstLabInKey } from "../utils/routes/keys";
import { firstLabInPath } from "../utils/routes/paths";

const FirstLab = withLazyLoader(() => import("../containers/FirstLab/FirstLab"));

interface IRoutes extends Omit<RouteConfig, "routes"> {}

export const routes: IRoutes[] =  [
    {
        key: firstLabInKey,
        path: firstLabInPath,
        component: FirstLab,
    },
    {
        key: "first",
        path: "/",
        isRedirectRoute: true,
        component: (props: RouteChildrenProps) => {
            return (
                <Redirect to={generatePath(
                    firstLabInPath,
                    (props.match && props.match.params) || {}
                )} />
            );
        }
    },
];
