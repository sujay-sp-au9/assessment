import React from "react";
import Axios from "axios";
import { Input } from "antd";

const { TextArea } = Input;

const createPost = (postText, setPostText) => {
  const data = new FormData();
  data.append("body", postText);
  data.append("photo", document.getElementById("post-photo").files[0]);
  Axios({
    method: "POST",
    url: "http://localhost:3001/posts",
    data,
    withCredentials: true,
  })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
  setPostText("");
  document.getElementById("post-photo").value = document.getElementById(
    "post-photo"
  ).defaultValue;
};

export default function CreatePost() {
  const [postText, setPostText] = React.useState("");
  return (
    <div style={{ margin: "1vw" }}>
      <TextArea
        allowClear={true}
        placeholder="What's on your mind?"
        rows={4}
        maxLength={200}
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        onPressEnter={() => createPost(postText, setPostText)}
      />
      <label htmlFor="photo">
        Choose a photo:
        <br />
      </label>
      <input type="file" id="post-photo" name="photo" accept="image/*" />
    </div>
  );
}
