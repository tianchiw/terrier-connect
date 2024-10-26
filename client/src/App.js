import "./App.css";
import Header from "./components/Header";
import Index from "./components/Index";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <div>
        <header className="App-header">{isLoggedIn ? <Header /> : null}</header>
      </div>
      <div>
        <Index />
      </div>
    </div>
  );
}

export default App;
