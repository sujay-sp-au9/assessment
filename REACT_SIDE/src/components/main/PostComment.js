import React from "react";
import { Button } from "antd";

import Post from "./Post";
import Comments from "./Comments";

export default function PostComment({ post, comments }) {
  console.log(post);
  console.log(comments);
  const [side, setSide] = React.useState(false);
  const [active, setActive] = React.useState(true);
  if (!active) {
    return null;
  }
  return (
    <div
      className="site-layout-background"
      style={{
        padding: 24,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        type="primary"
        shape="circle"
        size="large"
        onClick={() => {
          setSide(!side);
        }}
      >
        {!side ? "Comments" : "Post"}
      </Button>
      {!side ? (
        <Post post={post} setActive={setActive} />
      ) : (
        <Comments id={post._id} />
      )}
    </div>
  );
}
