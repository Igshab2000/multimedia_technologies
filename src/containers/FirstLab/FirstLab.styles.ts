import React from "react";

export const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
};

export const colorpickerContentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
};

export const wheelStyle: React.CSSProperties = {
    marginLeft: "20px",
};

export const saturationStyle: React.CSSProperties = {
    marginLeft: "30px",
};

export const tableContainer: React.CSSProperties = {
    marginTop: "40px",
    width: "650px",
};

export const colorBlockStyle = (color: string) => ({
    width: "40px",
    height: "40px",
    backgroundColor: color,
} as const)