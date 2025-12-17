# Literalnie Solver

Literalnie Solver is a web application designed to help users solve puzzles from the game [Literalnie](https://literalnie.fun/). The application provides a user-friendly interface to input puzzle constraints and find possible solutions based on a dictionary.

## Features

- **Language Support**: Toggle between Polish and English for the interface and dictionary.
- **Dictionary Mode**: Solve puzzles without specifying the exact length of the word.
- **Custom Constraints**: Specify banned letters and required letters to refine your search.
- **Responsive Design**: Works seamlessly on both desktop and mobile devices.

## How to Use

1. **Enter the Puzzle**: Input the word you want to solve. Use `?` for unknown letters.
2. **Set Constraints**:
   - Enter letters to ban.
   - Enter letters that must be included.
3. **Choose Dictionary Mode**: Enable dictionary mode if the word length is unknown.
4. **Search**: Click the "Search" button to find possible solutions.
5. **Switch Language**: Use the language toggle to switch between Polish and English.

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
- `dictionary.txt`: English dictionary file.
- `slownik.txt`: Polish dictionary file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the game [Literalnie](https://literalnie.fun/).
