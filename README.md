# ADM - Auto Document Manager

This is the Repository for the unified backend and frontend for the ADM Project.

## Conventions

Branch naming convention: `kn-<feature-name>` with author name initials at the beginning.

Branch Example: `kn-feature-name-example`

## Tech-Stack

### General

- Git [Version Control]
- Docker [Containerization]
- GitHub [Code Hosting]
- GitHub Actions [CI/CD] - Work In Progress

### Frontend

- Typescript [Programming Language]
- NodeJs [Javascript runtime]
- SvelteKit [Full-Stack Framework]
- Svelte [Frontend Framework]
- PocketBase [SaaS - Database/File-Storage/Authentication]
- TailwindCSS [CSS Framework]
- DaisyUI [Tailwind Component Library]
- Text Editor - Monaco [Code Editor] or CodeMirror [Code Editor] or Ace [Code Editor]

### Backend

- Python [Programming Language]
- FastApi [Backend Framework]
- LangChain [Language Processing]
- GPT4All [Language Processing]
- ChatGPT Plugin Files [Chatbot Plugin Files]

### PocketBase

- SQLite [Database]
- Authentification
- File Storage

## Getting Started

### Prerequisites

- Nodejs
- Python
- NPM
- Git
- Docker Engine
- pkg-config
- cairo
- wkhtmltopdf

### Development

### [Frontend](frontend/README.md)

#### Running the project

```bash
npm install
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

#### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Pocketbase

Use docker compose to create Pocketbase Service:

```bash
docker-compose up
```

### [Backend](backend/README.md)

To install the required packages for this plugin and run the service locally, run the following commands:

```bash
pip install -r requirements.txt

uvicorn main:app --reload --port 5003
```
