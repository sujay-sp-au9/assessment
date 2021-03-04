import React from "react";
import Axios from "axios";
import { Button } from "antd";

import Comment from "./Comment";

export default function Comments({ id }) {
  const [comments, setComments] = React.useState([]);
  const [page, setPage] = React.useState(1);
  React.useEffect(() => {
    Axios({
      method: "POST",
      url: `http://localhost:3001/posts/comment?limit=6&page=${page}`,
      data: {
        id,
      },
      withCredentials: true,
    })
      .then((res) => setComments(res.data.data))
      .catch((err) => window.alert(err.message));
  }, [page, id]);
  const renderedComments = comments.map((comment) => (
    <Comment comment={comment} />
  ));
  return (
    <div class="ui list">
      {renderedComments}
      {comments.length === 6 ? (
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
          onClick={() => setPage((prev) => prev - 1)}
        >
          Load prev
        </Button>
      ) : null}
    </div>
  );
}
