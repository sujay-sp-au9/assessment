import React from "react";
import Axios from "axios";
import { Menu, Button } from "antd";

const addFriend = async (id) => {
  const result = await Axios({
    method: "POST",
    url: "http://localhost:3001/users/friendreq",
    data: {
      id,
    },
    withCredentials: true,
  });
  console.log(result);
};

export default function SuggestedFriend({ suggestedFriend, props }) {
  const [responded, setResponded] = React.useState(false);
  if (responded) {
    return null;
  }
  return (
    <Menu.Item
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
      key="1"
      {...props}
    >
      {suggestedFriend.name}
      <Button
        shape="round"
        type="primary"
        danger
        style={{ margin: "0 0 0.5vw 0.5vw" }}
        onClick={() => {
          setResponded(true);
          addFriend(suggestedFriend._id);
        }}
      >
        Add friend
      </Button>
    </Menu.Item>
  );
}
