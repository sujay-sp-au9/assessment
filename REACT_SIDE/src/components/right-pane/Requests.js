import React from "react";
import Axios from "axios";
import { Menu, Button } from "antd";

import Request from "./Request";

export default function Requests({ setSearchPage }) {
  const [requests, setRequests] = React.useState([]);
  React.useEffect(() => {
    Axios({
      method: "GET",
      url: "http://localhost:3001/users/friendreq",
      withCredentials: true,
    })
      .then((res) => {
        setRequests(res.data.data);
      })
      .catch((err) => window.alert(err.message));
  }, []);

  const renderedRequests = requests.map((request) => {
    return <Request key={request._id} request={request} />;
  });
  return (
    <React.Fragment>
      <h1 style={{ padding: "1vw", color: "white" }}>Requests</h1>
      <Menu theme="dark" mode="inline" selectable={false}>
        <Menu.Item
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
          key="1"
        >
          Home
          <Button
            shape="round"
            type="primary"
            danger
            style={{ margin: "0 0 0.5vw 0.5vw" }}
            onClick={() => setSearchPage(false)}
          >
            Go
          </Button>
        </Menu.Item>
        {renderedRequests}
      </Menu>
    </React.Fragment>
  );
}
