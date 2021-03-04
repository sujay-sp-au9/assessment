import React from "react";
import { List } from "antd";

import SearchResult from "./SearchResultTypes/SearchResult";

export default function SearchResults({ searchResults }) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={searchResults}
      renderItem={(item) => <SearchResult key={item._id} item={item} />}
    />
  );
}
