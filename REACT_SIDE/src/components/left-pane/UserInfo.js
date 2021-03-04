import React from "react";
import Axios from "axios";
import { Card, Button } from "antd";

import UserUpdate from "./UserUpdate";

const { Meta } = Card;

export default function Userinfo() {
  const defaultUser = {
    name: "User",
    email: "placeholder@client.domain",
    photo: "/imgs/default.jpg",
  };
  const [user, setUser] = React.useState(defaultUser);
  const [userWantsToUpdate, setUserWantsToUpdate] = React.useState(false);
  React.useEffect(() => {
    Axios({
      method: "GET",
      url: "http://localhost:3001/users/me",
      withCredentials: true,
    })
      .then((res) => setUser(res.data.data))
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <React.Fragment>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt="User" src={user.photo} />}
      >
        <Meta title={user.name} description={user.email} />
      </Card>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {userWantsToUpdate ? (
          <Button
            style={{ margin: "0.5vw" }}
            type="primary"
            onClick={() => setUserWantsToUpdate((prev) => !prev)}
          >
            Maybe next time
          </Button>
        ) : (
          <Button
            style={{ margin: "0.5vw" }}
            danger
            type="primary"
            onClick={() => setUserWantsToUpdate((prev) => !prev)}
          >
            Update profile
          </Button>
        )}
      </div>
      {userWantsToUpdate ? (
        <UserUpdate
          setUserWantsToUpdate={setUserWantsToUpdate}
          setUser={setUser}
          user={user}
        />
      ) : null}
    </React.Fragment>
  );
}
