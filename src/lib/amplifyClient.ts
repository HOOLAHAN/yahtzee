import { generateClient } from 'aws-amplify/api';

// Amplify is configured once at app startup in src/index.tsx.
export const client = generateClient();
