import './App.css';
import Leaderboard from './components/Leaderboard/Leaderboard';

const container = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

function App() {
  return (
    <div style={container}>
      <Leaderboard />
    </div>
  );
}

export default App;
