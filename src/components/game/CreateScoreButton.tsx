import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from '../../amplifyconfiguration.json';
import { createScore } from '../../graphql/mutations';
import { useAuth } from '../../context/AuthContext';

Amplify.configure(config);
const client = generateClient();

interface CreateScoreButtonProps {
  score: number;
  isMobile: boolean;
  onClick?: () => void;
}

function generateUniqueId(): string {
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

const CreateScoreButton: React.FC<CreateScoreButtonProps> = ({ score, isMobile, onClick }) => {
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmitScore = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const userId = userDetails?.userId;
      const username = userDetails?.preferred_username;
      const timestamp = new Date().toISOString();
      const id = generateUniqueId();

      if (!userId || !username || typeof score !== 'number') {
        console.error('Invalid input');
        return;
      }

      const input = { id, userId, username, score, timestamp };

      const result = await client.graphql({
        query: createScore,
        variables: { input },
      });

      console.log('Submitted score:', result);
      onClick?.();
      alert('Score submitted successfully!');
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Failed to submit score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubmitScore}
      disabled={loading}
      className={`w-full md:w-auto ${isMobile ? 'py-1 px-3 text-sm' : 'py-2 px-4 text-base'} 
        rounded-xl font-bold shadow-md transition duration-300 ease-in-out transform 
        ${loading
          ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
          : 'bg-neonCyan text-deepBlack hover:bg-electricPink hover:text-white hover:scale-105 focus:ring focus:ring-electricPink'
        }`}
    >
      {loading ? 'Submitting...' : isMobile ? 'Submit' : 'Submit Score'}
    </button>
  );
};

export default CreateScoreButton;
