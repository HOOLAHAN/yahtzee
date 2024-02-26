// App.tsx

import './tailwind.css';
import Navbar from './components/Navbar';
import Game from './components/Game';
import config from './aws-exports';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(config);

const App = () => {

  return (
    <div className="App">
      <Navbar />
      <Game />
    </div>
  );
};

export default withAuthenticator(App);