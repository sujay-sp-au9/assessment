import React from "react";
import Axios from "axios";
import { Menu, Button } from "antd";

const respondReq = (setResponded, id, accepted) => {
  setResponded(true);
  Axios({
    method: "PATCH",
    url: "http://localhost:3001/users/friendreq",
    data: {
      id,
      accepted,
    },
    withCredentials: true,
  })
    .then((res) => console.log(res))
    .catch((err) => window.alert(err.message));
};

export default function Request({ request }) {
  const [responded, setResponded] = React.useState(false);
  if (responded) {
    return null;
  }
  return (
    <Menu.Item
      style={{
        display: "flex",
        textAlign: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
      key={request._id}
    >
      <h3 style={{ color: "white" }}>{request.name}</h3>
      <Button
        shape="round"
        type="primary"
        style={{ margin: "0.5vw" }}
        onClick={() => respondReq(setResponded, request._id, true)}
      >
        Confirm
      </Button>
      <Button
        shape="round"
        type="primary"
        danger
        style={{ margin: "0.5vw" }}
        onClick={() => respondReq(setResponded, request._id, false)}
      >
        Decline
      </Button>
    </Menu.Item>
  );
}
