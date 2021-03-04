import React from "react";
import Axios from "axios";
import { Input, Space, Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const updateUser = (userEmail, setUser) => {
  const data = new FormData();
  data.append("email", userEmail);
  data.append("photo", document.getElementById("user-photo").files[0]);
  Axios({
    method: "PATCH",
    url: "http://localhost:3001/users/me",
    data,
    withCredentials: true,
  })
    .then((res) => setUser(res.data.data.user))
    .catch((err) => window.alert(err.message));
  if (document.getElementById("old").value.length > 0) {
    Axios({
      method: "PATCH",
      url: "http://localhost:3001/users/updatePassword",
      data: {
        currentPassword: document.getElementById("old").value,
        password: document.getElementById("new").value,
        passwordConfirm: document.getElementById("confirm").value,
      },
      withCredentials: true,
    })
      .then((res) => console.log(res))
      .catch((err) => window.alert(err.message));
  }
};

export default function UserUpdate({ user, setUserWantsToUpdate, setUser }) {
  const [userEmail, setUserEmail] = React.useState(user.email);
  return (
    <React.Fragment>
      <Space style={{ margin: "0.5vw" }} direction="vertical">
        <Input
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <Input.Password id="old" placeholder="Old password" />
        <Input.Password id="new" placeholder="New password" />
        <Input.Password
          id="confirm"
          placeholder="Confirm password"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
        <label style={{ color: "white" }} htmlFor="photo">
          Update profile photo?
          <br />
        </label>
        <input
          style={{ color: "white" }}
          type="file"
          id="user-photo"
          name="photo"
          accept="image/*"
        />
      </Space>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          style={{ margin: "0.5vw" }}
          danger
          type="primary"
          onClick={() => {
            setUserWantsToUpdate(false);
            updateUser(userEmail, setUser);
          }}
        >
          Update profile
        </Button>
      </div>
    </React.Fragment>
  );
}
