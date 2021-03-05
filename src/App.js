import logo from './logo.svg';
import './App.css';
import Puzzle from './Puzzle'

function App() {
  return (
    <div className="App">
      <Puzzle
        puzzleData={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15]}
      />
    </div>
  );
}

export default App;
