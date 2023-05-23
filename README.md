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
- DaisyUI [Tailwind Component Library] it should be changed!
- Capacitor [Mobile App Framework]
- Electron [Desktiop App Framework]

### Backend

- Python [Programming Language]
- FastApi [Backend Framework]
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

### Development

### Commands

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Docker

To create a full local environment, use the docker compose to create all services localy and the production application:

```bash
docker-compose up
```

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

### ChatGPT Plugin

To install the required packages for this plugin, run the following command:

```bash
pip install -r requirements.txt
```

To run the plugin, enter the following command:

```bash
python main.py
```

Once the local server is running:

1. Navigate to https://chat.openai.com.
2. In the Model drop down, select "Plugins" (note, if you don't see it there, you don't have access yet).
3. Select "Plugin store"
4. Select "Develop your own plugin"
5. Enter in `localhost:5003` since this is the URL the server is running on locally, then select "Find manifest file".
