import React from "react";
import Axios from "axios";
import { Button } from "antd";

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

export default function SearchResultFriend({ id, setRequestSent }) {
  return (
    <Button
      shape="round"
      type="primary"
      danger
      onClick={() => {
        setRequestSent(true);
        addFriend(id);
      }}
    >
      Add Friend
    </Button>
  );
}
