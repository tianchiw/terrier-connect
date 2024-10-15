import "./App.css";
import Header from "./components/Header";
import MapView from "./components/Detail";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <div>
        <MapView />
      </div>
    </div>
  );
}

export default App;
