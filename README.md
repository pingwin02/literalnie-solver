# Literalnie Solver

Literalnie Solver is a web application designed to help users solve puzzles from the game [Literalnie](https://literalnie.fun/). The application provides a user-friendly, interactive grid interface to input your guesses and find possible solutions based on a comprehensive dictionary.

## Features

- **Interactive Grid**: A Wordle-like grid where you can type your guesses and click on cells to cycle through colors (Gray, Yellow, Green) to match the game's feedback.
- **Auto-Filtering**: The app automatically filters and displays possible words based on the current state of the grid.
- **Copy & Paste Support**: Easily paste your game results (both text and JSON format) directly into the grid.
- **Language Support**: Toggle between Polish and English for both the interface and the dictionary.
- **Dictionary Mode**: A separate mode that allows you to manually search through the dictionary using text input.
- **Keyboard Navigation**: Full support for navigating the grid using arrow keys, typing, and quick selection shortcuts.
- **Responsive Design**: Works seamlessly and looks great on both desktop and mobile devices.

## How to Use

1. **Enter Your Guesses**: Type the words you have already guessed in the game into the grid.
2. **Set the Colors**: Click on individual letter cells to cycle their colors (Gray -> Yellow -> Green) so they match the feedback from the game.
   - **Gray**: Letter is not in the word.
   - **Yellow**: Letter is in the word but in the wrong spot.
   - **Green**: Letter is in the correct spot.
3. **View Results**: Scroll down to see the list of possible passwords that match your constraints. The list updates automatically.
4. **Dictionary Mode**: Toggle "Dictionary Mode" to simply search the dictionary for specific sequences of letters instead of using the grid.
5. **Switch Language**: Use the language toggle to switch between the Polish (`slownik.txt`) and English (`dictionary.txt`) database.

## Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd literalnie-solver
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Deployment to GitHub Pages

To deploy the project to GitHub Pages, follow these steps:

1. **Update the `package.json` file**:
   Add the following fields:

   ```json
   "homepage": "https://<your-username>.github.io/<repository-name>",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

2. **Deploy the application**:

   ```bash
   npm run deploy
   ```

3. **Access your application**:
   Visit `https://<your-username>.github.io/<repository-name>` to see your deployed application.

## Project Structure

- `src/`: Contains the source code for the application.
- `public/`: Static files and assets.
- `dictionary.txt`: English dictionary file (sourced from [here](https://github.com/dwyl/english-words/blob/master/words_alpha.txt)).
- `slownik.txt`: Polish dictionary file (sourced from [here](https://sjp.pl/sl/odmiany/)).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the game [Literalnie](https://literalnie.fun/).
