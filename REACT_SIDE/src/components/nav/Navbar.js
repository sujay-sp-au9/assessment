import React from "react";
import { Layout } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

export default function navbar() {
  return (
    <Header
      className="site-layout-background"
      style={{ padding: 0, display: "flex", justifyContent: "center" }}
    >
      <div
        className="logo"
        style={{ cursor: "pointer" }}
        onClick={() => (window.location.href = "/")}
      >
        <h1 style={{ fontSize: "4vw", color: "white" }}>
          SocialSouth {<UserOutlined />}
        </h1>
      </div>
    </Header>
  );
}
