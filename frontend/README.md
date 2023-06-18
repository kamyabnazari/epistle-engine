# Frontend

## Setup

### Environment variables

Create a `.env` file in the root of the frontend directory with the following variables:

```
PUBLIC_POCKETBASE_URL=http://localhost:8090
PUBLIC_BACKEND_URL=http://127.0.0.1:5003
PUBLIC_SECURE=false
PUBLIC_HTTPONLY=false
PUBLIC_SAMESITE=None
BODY_SIZE_LIMIT=0
```

### Running the frontend

```bash
npm install
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building the project

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
