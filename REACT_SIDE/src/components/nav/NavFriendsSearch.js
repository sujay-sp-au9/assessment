import React from "react";
import Axios from "axios";
import { Input } from "antd";
import { useState } from "react/cjs/react.development";

const { Search } = Input;

const searchUsers = async (e, setSearchPage, setSearchResults, setLoading) => {
  const results = await Axios({
    method: "POST",
    url: "http://localhost:3001/users/friends",
    data: {
      input: e.target.value,
    },
    withCredentials: true,
  });
  await setSearchResults(results.data.data);
  setLoading(false);
  setSearchPage(true);
};

export default function SearchUsers({ setSearchPage, setSearchResults }) {
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = React.useState("");
  return (
    <Search
      placeholder="Search members"
      value={searchInput}
      enterButton="Search"
      size="large"
      loading={loading}
      onChange={(e) => {
        setSearchInput(e.target.value);
      }}
      onPressEnter={(e) => {
        setLoading(true);
        setSearchInput("");
        searchUsers(e, setSearchPage, setSearchResults, setLoading);
      }}
    />
  );
}
