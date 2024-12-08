import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/Home";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import Index from "./components/Index";
import UserMessages from "./pages/follower";
import PostSearch from "./pages/search";
import PostWithID from "./pages/forumPost/post";

// Wrapper component to conditionally render Header
const HeaderWrapper = ({ children }) => {
  const location = useLocation();

  // Don't show header on index page
  const showHeader = location.pathname !== "/";

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <HeaderWrapper>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile/me" element={<Profile />} />
          <Route path="/profile/me/edit" element={<EditProfile />} />
          <Route
            path="/profile/me/change-password"
            element={<ChangePassword />}
          />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/post/:id" element={<PostWithID />} />
          <Route path="/follower" element={<UserMessages />} />
          <Route path="/search" element={<PostSearch />} />
        </Routes>
      </HeaderWrapper>
    </Router>
  );
}

export default App;
