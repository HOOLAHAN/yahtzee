// SubmitScoreButton.tsx

import React from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from '../amplifyconfiguration.json';
import { submitScore } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

Amplify.configure(config);
const client = generateClient();

interface SubmitScoreButtonProps {
  score: number;
}

const SubmitScoreButton: React.FC<SubmitScoreButtonProps> = ({ score }) => {
  const { userDetails } = useAuth();
 
  const handleSubmitScore = async () => {
    try {
      const userId = userDetails?.userId;
      const username = userDetails?.email;

      if (!userId || !username || typeof score !== 'number') {
        console.error('Invalid input');
        return;
      }


      const variables = { userId, username, score };
      console.log('Submitting score with details:', variables);
  
      const result = await client.graphql({
        query: submitScore,
        variables: { userId, username, score },
      });     

      console.log(result);
      alert('Score submitted successfully!');
    } catch (error) {
      const graphqlError = error as { errors: [{ message: string }] };
      console.error('Error submitting score:', graphqlError.errors[0].message);
      alert(`Failed to submit score. Error: ${graphqlError.errors[0].message}`);
    }
    
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleSubmitScore}
    >
      Submit Score
    </button>
  );
};

export default SubmitScoreButton;
