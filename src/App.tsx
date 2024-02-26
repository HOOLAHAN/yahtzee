// App.tsx

import './tailwind.css';
import Navbar from './components/Navbar';
import Game from './components/Game';
import { AuthProvider } from './context/AuthContext'

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <Game />
      </div>
    </AuthProvider>
  );
};

export default App;
