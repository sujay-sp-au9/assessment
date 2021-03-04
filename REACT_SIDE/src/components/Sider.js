import React from "react";
import { Layout } from "antd";

const { Sider } = Layout;

export default function sider(props) {
  const styleObj = {
    overflow: "auto",
    height: "100vh",
    position: "fixed",
  };
  if (props.edge === "0") {
    styleObj.left = "0";
  } else if (props.edge === "1") {
    styleObj.right = "0";
  }
  return <Sider style={styleObj}>{props.children}</Sider>;
}
