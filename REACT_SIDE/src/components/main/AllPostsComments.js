import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Layout, Button } from "antd";

import PostComment from "./PostComment";

const { Content } = Layout;

export default function AllPostsComments() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    Axios({
      method: "GET",
      url: `http://localhost:3001/posts?limit=10&page=${page}`,
      withCredentials: true,
    })
      .then((res) => setPosts(res.data.data))
      .catch((err) => window.alert(err.message));
  }, [page]);
  const renderedPosts = posts.map((post) => (
    <PostComment key={post._id} post={post} comments={post.comments} />
  ));
  return (
    <React.Fragment>
      <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
        {renderedPosts}
      </Content>
      {posts.length === 10 ? (
        <Button
          type="primary"
          danger
          onClick={() => setPage((prev) => prev + 1)}
        >
          Load more
        </Button>
      ) : null}
      {page > 1 ? (
        <Button
          type="primary"
          danger
          onClick={() => setPage((prev) => prev + 1)}
        >
          Load prev
        </Button>
      ) : null}
    </React.Fragment>
  );
}
