// CreateScoreButton.tsx

import React from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from '../amplifyconfiguration.json';
import { createScore } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

Amplify.configure(config);
const client = generateClient();

interface CreateScoreButtonProps {
  score: number;
}
function generateUniqueId(): string {
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

const CreateScoreButton: React.FC<CreateScoreButtonProps> = ({ score }) => {
  const { userDetails } = useAuth();
 
  const handleSubmitScore = async () => {
    try {
      const userId = userDetails?.userId;
      const username = userDetails?.email;
      const scoreValue = score;
      const timestamp = new Date().toISOString();
      const id = generateUniqueId();
  
      if (!userId || !username || typeof scoreValue !== 'number') {
        console.error('Invalid input');
        return;
      }
  
      const input = { id, userId, username, score: scoreValue, timestamp };
  
      const result = await client.graphql({
        query: createScore,
        variables: { input },
      });
  
      console.log(result);
      alert('Score submitted successfully!');
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Failed to submit score');
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

export default CreateScoreButton;
