import React from "react";
import Axios from "axios";
import { Button } from "antd";

const performLogOut = async (setSearchPage, setLogIn) => {
  const result = await Axios({
    method: "GET",
    url: "http://localhost:3001/users/logout",
    withCredentials: true,
  });
  if (result.data.status === "success") {
    setSearchPage(false);
    setLogIn(false);
  } else {
    window.alert("Oops, something weent wrong");
  }
};

export default function LogOut({ setSearchPage, setLogIn }) {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", alignIems: "center" }}
    >
      <Button
        type="primary"
        shape="round"
        style={{ margin: "0.5vw" }}
        onClick={() => performLogOut(setSearchPage, setLogIn)}
      >
        Log OUT
      </Button>
    </div>
  );
}
