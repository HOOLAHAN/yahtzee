# Yahtzee! Game in React with AWS Integration

## Description

This project is an interactive Yahtzee! game web application developed with React and TypeScript. This digital version of the classic dice game includes features like holding dice, rerolling, and automated score calculations following the official Yahtzee rules. The app integrates AWS Amplify for hosting, AWS Cognito for user authentication, and AWS DynamoDB for persistent storage of leaderboard scores.

## Deployed Page

Access the live application [here](http://yahtzeehub.s3-website.eu-west-2.amazonaws.com/).

## Features

- Interactive dice rolling experience with 5 virtual dice
- Option to 'hold' dice between rolls
- Score tabulation following Yahtzee's scoring categories:
  - Three of a Kind
  - Four of a Kind
  - Full House
  - Small Straight
  - Large Straight
  - Yahtzee
  - Chance
- Functional game reset
- User authentication for secure access
- Leaderboard feature to track high scores

## Architecture

The application's frontend is built using React and TypeScript, with state management handled via React's Context API. AWS Amplify facilitates the frontend deployment and hosting, AWS Cognito provides user authentication services, and AWS DynamoDB is used for storing and retrieving leaderboard data.

## Project Structure

The Yahtzee! game project is structured as follows:

- `amplify` - AWS Amplify configuration files and backend resources.
- `src` - Source code for the application:
  - `components` - React components for the UI:
    - `Game.tsx` - **The parent component that encapsulates all game-related child components.**
    - `Navbar.tsx` - Navigation bar for the app.
    - `AuthenticationManager.tsx` - Manages user authentication logic.
    - `CategoryButtons.tsx` - Renders category buttons for the game.
    - `DiceControl.tsx` - Controls for rolling and holding dice.
    - `Leaderboard.tsx` - Displays the game's leaderboard.
    - ... etc.
  - `context` - Contains React context for state management.
  - `functions` - Utility functions, including game logic and score calculations.
  - `graphql` - GraphQL queries, mutations, and subscriptions.
  - `hooks` - Custom React hooks.
  - `tests` - Test files for the components and functions.
  - `App.tsx` - The main React component that renders the app.
  - `index.tsx` - The entry point for the React application.
- `tailwind.css` - Tailwind CSS framework configuration.

This structure is designed to separate concerns and enhance maintainability. The `src` directory is further modularised to reflect different aspects of the application, such as UI components (`components`), application logic (`context`, `functions`), and API interactions (`graphql`).

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- AWS Account
- Amplify CLI

## Setup

### Cloning the Repository

Clone the repository using the following command:

```bash
git clone https://github.com/yourusername/yahtzee.git
cd yahtzee
```

### Installing Dependencies

Install the required npm packages using:

```bash
npm install
```

### AWS Configuration

In order to interact with the leaderboard, you need to set up AWS Amplify, Cognito, and DynamoDB. Follow the instructions provided in the `aws-setup-instructions.md` to configure your AWS resources.

### Environment Variables

Create a `.env` file in the root directory and add the necessary environment variables:

```plaintext
REACT_APP_USER_POOL_ID=your_cognito_user_pool_id
REACT_APP_CLIENT_ID=your_cognito_app_client_id
REACT_APP_AWS_REGION=your_aws_region
REACT_APP_APPSYNC_APIKEY=your_appsync_api_key
REACT_APP_AWS_SYNC_GRAPHQLENDPOINT=your_appsync_graphql_endpoint
REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID=your_cognito_identity_pool_id
REACT_APP_AWS_USER_POOLS_ID=your_cognito_user_pools_id
REACT_APP_AWS_POOLS_WEB_CLIENT_ID=your_cognito_user_pools_web_client_id
```

Replace the placeholders with your actual AWS resource information.

## Running the Game Locally

Start the development server with:

```bash
npm start
```

Navigate to [http://localhost:3000/](http://localhost:3000/) in your browser to view the app.

## Running Tests

Execute the test suites with:

```bash
npm test
```

## Contributing

We welcome contributions to enhance the application's functionality and user experience. If you have improvements or bug fixes, please fork the repository, make your changes, and submit a pull request.

---

We hope you enjoy rolling for that elusive Yahtzee!