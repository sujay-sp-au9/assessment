import React from "react";
import Axios from "axios";
import { Menu } from "antd";

import SuggestedFriend from "./SuggestedFriend";

export default function Suggestedfriends() {
  const [suggestedFriends, setSuggestedFriends] = React.useState([]);
  const [update, setUpdate] = React.useState(false);
  React.useEffect(() => {
    Axios({
      method: "GET",
      url: "http://localhost:3001/users/suggestedfriends",
      withCredentials: true,
    })
      .then((res) => {
        setSuggestedFriends(res.data.data);
      })
      .catch((err) => window.alert(err.messsage));
    const updateInterval = setInterval(() => {
      setUpdate(!update);
    }, 10000);
    return () => {
      clearInterval(updateInterval);
    };
  }, [update]);
  const renderedFriends = suggestedFriends.map((suggestedFriend) => {
    return (
      <SuggestedFriend
        key={suggestedFriend._id}
        suggestedFriend={suggestedFriend}
      />
    );
  });
  return (
    <React.Fragment>
      <h1 style={{ padding: "1vw", color: "white" }}>Suggested friends</h1>
      <Menu theme="dark" mode="inline" selectable={false}>
        {renderedFriends}
      </Menu>
    </React.Fragment>
  );
}
