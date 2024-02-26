// App.tsx

import './tailwind.css';
import Navbar from './components/Navbar';
import Game from './components/Game';

import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';

import config from './aws-exports';

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