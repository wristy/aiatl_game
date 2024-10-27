# AgentArena

AgentArena simulates a game between AI agents using a Flask backend and a React frontend. The game logic is abstracted for various types of games, with the current implementation focusing on a Prisoner's Dilemma scenario.

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Backend Overview](#backend-overview)
   - [Key Files](#key-files)
   - [Running the Backend](#running-the-backend)
3. [Frontend Overview](#frontend-overview)
   - [Key Files](#key-files-1)
   - [Running the Frontend](#running-the-frontend)
4. [Available Scripts](#available-scripts)
5. [Learn More](#learn-more)
6. [License](#license)

---

## Project Structure

```plaintext
.
├── backend/
│   ├── app.py
│   ├── Data/
│   ├── models/
│   │   ├── agents.py
│   │   ├── game.py
│   │   ├── prisoners_dilemma.py
│   │   └── models.py
│   ├── requirements.txt
│   ├── routes/
│   │   └── game_routes.py
│   ├── services/
│   │   └── game_service.py
│   ├── utils/
│   └── venv/
├── demo.py
├── package.json
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── README.md
├── README2.md
├── src/
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── AppContext.js
│   ├── HomePage.js
│   ├── index.css
│   ├── index.js
│   ├── reportWebVitals.js
│   ├── ResultsPage.js
│   └── setupTests.js
```

Backend Overview

The backend is built with Flask, containing the core game logic and API routes.

Key Files

	•	backend/app.py: Entry point for the Flask app.
	•	backend/models/game.py: Contains the Game and GameState classes.
	•	backend/models/prisoners_dilemma.py: Implements the PrisonersDilemmaGame class.
	•	backend/routes/game_routes.py: Defines the API endpoints for game interaction.
	•	backend/services/game_service.py: Centralizes the game logic.

Running the Backend

	1.	Navigate to the backend directory:

cd backend


	2.	Install dependencies:

pip install -r requirements.txt


	3.	Run the Flask server:

flask run



Frontend Overview

The frontend is built with React and offers an interface for interacting with the game.

Key Files

	•	src/App.js: Main React application file.
	•	src/AppContext.js: Manages global state with context.
	•	src/HomePage.js: Home page component.
	•	src/ResultsPage.js: Results page component.

Running the Frontend

	1.	Install dependencies:

npm install


	2.	Start the React development server:

npm start



Available Scripts

In the project directory, the following scripts are available:

	•	npm start: Runs the app in development mode. Open http://localhost:3000 to view it in your browser.
	•	npm test: Launches the test runner in interactive watch mode.
	•	npm run build: Builds the app for production to the build folder.
	•	npm run eject: Ejects the configuration files and dependencies for full customization.

Learn More

	•	Create React App: Explore the Create React App documentation.
	•	React: Visit the React documentation for in-depth information on React.

License

This project is licensed under the MIT License.

This improved README includes a clear Table of Contents, structured sections, and more concise explanations, enhancing readability and organization. Let me know if you need any additional sections or details!