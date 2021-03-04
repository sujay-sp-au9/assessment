/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Axios from "axios";

export default function Comment({ comment }) {
  const [user, setUser] = React.useState("");
  React.useEffect(() => {
    Axios({
      method: "POST",
      url: "http://localhost:3001/users/user",
      data: {
        id: comment.author,
      },
      withCredentials: true,
    })
      .then((res) => setUser(res.data.data))
      .catch((err) => window.alert(err.message));
  }, []);
  const date = new Date(comment.date).toLocaleDateString();
  const time = new Date(comment.date).toLocaleTimeString();
  return (
    <div className="item">
      <img className="ui avatar image" src={user.photo} alt="" />
      <div className="content">
        <p className="header">
          <b>{user.name}</b>
        </p>
        <div className="description">{comment.body}</div>
      </div>
      <p>{date + " " + time}</p>
    </div>
  );
}
