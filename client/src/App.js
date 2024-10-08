import "./App.css";
import Header from "./components/Header";
import Intro from "./components/Detail";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <div>
        <Intro />
      </div>
    </div>
  );
}

export default App;
