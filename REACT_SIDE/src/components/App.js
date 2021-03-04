import "./App.css";
import Axios from "axios";
import React, { useState } from "react";
import { Layout } from "antd";

import LogIn from "./Auth/LogIn";
import SignUp from "./Auth/SignUp";
import LogOut from "./Auth/LogOut";
import Sider from "./Sider";
import UserInfo from "./left-pane/UserInfo";
import SuggestedFriends from "./left-pane/SuggestedFriends";
import SearchResultsComponent from "./main/SearchResults";
import Navbar from "./nav/Navbar";
import FriendSearch from "./nav/NavFriendsSearch";
import CreatePost from "./main/CreatePost";
import AllPostsComments from "./main/AllPostsComments";
import Footer from "./main/Footer";
import Requests from "./right-pane/Requests";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [SearchPage, setSearchPage] = useState(false);
  const [SearchResults, setSearchResults] = useState(null);

  React.useEffect(() => {
    Axios({
      method: "GET",
      url: "http://localhost:3001/users/login",
      withCredentials: true,
    })
      .then((res) => {
        setIsLoggedIn(res.data.status);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!isLoggedIn) {
    return (
      <React.Fragment>
        <Navbar />
        <div
          style={{
            height: "80vh",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <LogIn setLogIn={setIsLoggedIn} />
          <SignUp setLogIn={setIsLoggedIn} />
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <Layout>
        <Sider edge="0">
          <UserInfo />
          <SuggestedFriends />
        </Sider>
        <Layout
          className="site-layout"
          style={{ marginLeft: 250, marginRight: 250 }}
        >
          <Navbar />
          <FriendSearch
            setSearchPage={setSearchPage}
            setSearchResults={setSearchResults}
          />
          {!SearchPage ? (
            <React.Fragment>
              <CreatePost />
              <AllPostsComments />
            </React.Fragment>
          ) : (
            <SearchResultsComponent searchResults={SearchResults} />
          )}
          <Footer />
        </Layout>
        <Sider edge="1">
          <LogOut setSearchPage={setSearchPage} setLogIn={setIsLoggedIn} />
          <Requests setSearchPage={setSearchPage} />
        </Sider>
      </Layout>
    );
  }
}
