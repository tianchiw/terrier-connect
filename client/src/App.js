import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Detail from "./components/Detail";
import Profile from "./components/Profile";
import Index from "./components/Index";
import Sidebar from "./components/Sidebar";

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
          <Route path="/home" element={<Home />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </HeaderWrapper>
    </Router>
  );
}

export default App;
