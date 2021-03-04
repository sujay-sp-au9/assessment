import React, { useState } from "react";
import Axios from "axios";
import { List, Avatar } from "antd";

import SearchResultUser from "./SearchResultUser";
import SearchResultFriend from "./SearchResultFriend";
import SearchResultPendingFriend from "./SearchResultPendingFriend";

export default function Searchresult({ item }) {
  const [requestSent, setRequestSent] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isPendingFriend, setIsPendingFriend] = useState(false);
  const [connected, setConnected] = useState(isFriend || isPendingFriend);
  React.useEffect(() => {
    const axiosObj = {
      method: "POST",
      url: "http://localhost:3001/users/isFriend",
      data: {
        id: item._id,
      },
      withCredentials: true,
    };
    Axios(axiosObj)
      .then((res) => {
        setIsFriend(res.data.status);
        if (!res.data.status) {
          axiosObj.url = "http://localhost:3001/users/isPending";
          Axios(axiosObj)
            .then((res) => {
              setIsPendingFriend(res.data.status);
              setConnected(isFriend || res.data.status);
            })
            .catch((err) => window.alert(err.message));
        } else {
          setConnected(true);
        }
      })
      .catch((err) => window.alert(err.message));
  }, []);
  if (requestSent) {
    return null;
  }
  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={item.photo} />}
        title={<p>{item.name}</p>}
        description={item.email}
      />
      {isFriend ? (
        <SearchResultFriend id={item._id} setRequestSent={setRequestSent} />
      ) : null}
      {isPendingFriend ? <SearchResultPendingFriend /> : null}
      {!connected ? (
        <SearchResultUser id={item._id} setRequestSent={setRequestSent} />
      ) : null}
    </List.Item>
  );
}
