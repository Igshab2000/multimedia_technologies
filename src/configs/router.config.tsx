import React from "react";
import { generatePath, Redirect, RouteChildrenProps } from "react-router";
import { RouteConfig } from "react-router-config";
import FirstLab from "../containers/FirstLab/FirstLab";
import { FourthLab } from "../containers/FourthLab/FourthLab";
import SecondLab from "../containers/SecondLab/SecondLab";
import { ThirdLab } from "../containers/ThirdLab/ThirdLab";
import withLazyLoader from "../hocs/withLazyLoader";
import { firstLabInKey, fourthLabInKey, secondLabInKey, thirdLabLabInKey } from "../utils/routes/keys";
import { firstLabInPath, fourthLabInPath, secondLabInPath, thirdLabInPath } from "../utils/routes/paths";

// const FirstLab = withLazyLoader(() => import("../containers/FirstLab/FirstLab"));
// const SecondLab = withLazyLoader(() => import("../containers/SecondLab/SecondLab"));

interface IRoutes extends Omit<RouteConfig, "routes"> {}

export const routes: IRoutes[] =  [
    {
        key: firstLabInKey,
        path: firstLabInPath,
        component: FirstLab,
        exact: true,
    },
    {
        key: secondLabInKey,
        path: secondLabInPath,
        component: SecondLab,
        exact: true,
    },
    {
        key: thirdLabLabInKey,
        path: thirdLabInPath,
        component: ThirdLab,
        exact: true,
    },
    {
        key: fourthLabInKey,
        path: fourthLabInPath,
        component: FourthLab,
        exact: true,
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
