# Frontend

## Setup

### Environment variables

Create a `.env` file in the root of the frontend directory with the following variables:

```
PUBLIC_POCKETBASE_URL=http://ee-pocketbase:8090
PUBLIC_BACKEND_URL=http://ee-backend:5003
PUBLIC_SECURE=true // if testing on safari or firefox, set to false
PUBLIC_HTTPONLY=false
PUBLIC_SAMESITE=None
BODY_SIZE_LIMIT=0
```

### Running the frontend

```
npm install

npm run dev
```

http://localhost:3000/ or http://localhost:5173/

### Building the project

To create a production version of your app:

```
npm run build
```

You can preview the production build with `npm run preview`.
