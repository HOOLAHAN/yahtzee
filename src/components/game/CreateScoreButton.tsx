import React, { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { submitScore } from '../../graphql/mutations';
import { useAuth } from '../../context/AuthContext';
import { client } from '../../lib/amplifyClient';

interface CreateScoreButtonProps {
  score: number;
  isMobile: boolean;
  onClick?: () => void;
}

const CreateScoreButton: React.FC<CreateScoreButtonProps> = ({ score, isMobile, onClick }) => {
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmitScore = async () => {
    if (loading) return;

    setLoading(true);
    try {
      if (!userDetails?.userId || typeof score !== 'number') {
        console.error('Invalid input');
        return;
      }

      const session = await fetchAuthSession({ forceRefresh: true });
      if (!session.tokens?.idToken) {
        throw new Error('Your sign-in session has expired. Please sign in again.');
      }

      const result = await client.graphql({
        query: submitScore,
        authMode: 'userPool',
        authToken: session.tokens.idToken.toString(),
        variables: { id: `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`, score },
      });

      if ('errors' in result && result.errors?.length) {
        throw new Error(result.errors.map((error) => error.message).join(', '));
      }

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
