/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import Axios from "axios";
import { Button, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const likeUnlike = (liked, setLiked, setNumberOfLikes, id) => {
  if (liked) {
    Axios({
      method: "PATCH",
      url: "http://localhost:3001/posts/likeUnlike",
      data: {
        id,
      },
      withCredentials: true,
    })
      .then((res) => {
        setNumberOfLikes((prev) => prev - 1);
        setLiked(res.data.status);
      })
      .catch((err) => window.alert(err.message));
  } else {
    Axios({
      method: "POST",
      url: "http://localhost:3001/posts/likeUnlike",
      data: {
        id,
      },
      withCredentials: true,
    })
      .then((res) => {
        setNumberOfLikes((prev) => prev + 1);
        setLiked(res.data.status);
      })
      .catch((err) => window.alert(err.message));
  }
};

const addComment = (id, comment) => {
  Axios({
    method: "PATCH",
    url: "http://localhost:3001/posts/comment",
    data: {
      post: id,
      body: comment,
    },
    withCredentials: true,
  })
    .then((res) => console.log(res))
    .catch((err) => window.alert(err.message));
};

const deletePost = (id, setActive) => {
  Axios({
    method: "PATCH",
    url: "http://localhost:3001/posts/delete",
    data: {
      id,
    },
    withCredentials: true,
  })
    .then((res) => {
      if (res.status === 204) {
        setActive(false);
      }
    })
    .catch((err) => window.alert(err.message));
};

export default function Post({ post, setActive }) {
  const [user, setUser] = useState("User");
  const [mine, setMine] = useState(false);
  const [liked, setLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(post.likes.length);
  const [comment, setComment] = useState("");
  const [numberOfComments, setNumberOfComments] = useState(
    post.comments.length
  );
  React.useEffect(() => {
    Axios({
      method: "POST",
      url: "http://localhost:3001/users/user",
      data: {
        id: post.author,
      },
      withCredentials: true,
    })
      .then((res) => setUser(res.data.data))
      .catch((err) => window.alert(err.message));
    Axios({
      method: "POST",
      url: "http://localhost:3001/posts/delete",
      data: {
        id: post.author,
      },
      withCredentials: true,
    })
      .then((res) => setMine(res.data.mine))
      .catch((err) => window.alert(err.message));
    Axios({
      method: "POST",
      url: "http://localhost:3001/posts/liked",
      data: {
        id: post._id,
      },
      withCredentials: true,
    })
      .then((res) => setLiked(res.data.liked))
      .catch((err) => window.alert(err.message));
  }, []);
  const date = new Date(post.date).toLocaleDateString();
  const time = new Date(post.date).toLocaleTimeString();
  return (
    <div className="ui card">
      <div className="content">
        <div className="right floated meta">{date + " " + time}</div>
        <img className="ui avatar image" src={user.photo} alt="" />
        {user.name}
      </div>
      <div className="image">
        <img src={post.photo} alt="" />
      </div>
      <div className="content">
        <span
          className="right floated"
          onClick={() => {
            likeUnlike(liked, setLiked, setNumberOfLikes, post._id);
          }}
        >
          {liked ? (
            <i style={{ color: "red" }} className="heart outline like icon" />
          ) : (
            <i className="heart outline like icon" />
          )}
          {numberOfLikes}
        </span>
        <i className="comment icon"></i>
        {`${numberOfComments} comments`}
      </div>
      <p>
        <b>{post.body}</b>
      </p>
      {mine ? (
        <Popconfirm
          title="Are you sure？"
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          onConfirm={() => deletePost(post._id, setActive)}
        >
          <Button type="primary" danger>
            Delete post
          </Button>
        </Popconfirm>
      ) : null}
      <div className="extra content">
        <div className="ui large transparent left icon input">
          <div
            onClick={() => {
              if (comment.length > 3) {
                addComment(post._id, comment);
                setNumberOfComments((prev) => prev + 1);
                setComment("");
              }
            }}
          >
            <i className="reply icon"></i>
          </div>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add Comment..."
          />
        </div>
      </div>
    </div>
  );
}
