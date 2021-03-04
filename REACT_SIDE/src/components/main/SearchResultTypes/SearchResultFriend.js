import React from "react";
import Axios from "axios";
import { Button } from "antd";

const removeFriend = async (id) => {
  const result = await Axios({
    method: "DELETE",
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
    <div>
      <Button
        shape="round"
        type="primary"
        danger
        onClick={() => {
          setRequestSent(true);
          removeFriend(id);
        }}
      >
        Remove Friend
      </Button>
    </div>
  );
}
