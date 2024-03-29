# EE - Epistle Engine

![Banner Image](cover-open-source-epistle-engine.webp)

This is the Repository for the unified services for the Epistle Engine with Github actions and Docker support.

## Important!

You should be using the Chrome/Edge Browser for testing and using the application.

Because in the frontend env file: PUBLIC_SECURE=true to test it. Only if you are need to test it on safari change it to false.

Also On the Cluster it is set to TRUE. So you can only test it with Chrome/Edge.

for init-pocketbase.sh to run, you need the file to be in LF line endings, so please do not edit the file or open it. If you have the error: init-pocketbase.sh not found, edit the file to have LF line endings and not CRLF!

## About the Project

Our goal is to revolutionize how people interact with documents. We understand the frustrations of traditional document processing methods, where finding information can be time-consuming. That's why we developed a system that allows users to extract valuable insights, ask questions, and receive instant answers from PDF documents.

Our application, combined with the OpenAIs GPT model, transforms the way you engage with PDFs. It's easy to ask specific questions or understand complex concepts without flipping through countless pages. We built a plugin that simplifies document navigation, question answering, and comprehension.

But we didn't stop there. We also recognize the need for efficient document creation. That's why we added a feature that generates content based on your prompts. Whether you need an essay or a research report, our application not only drafts your document but also provides a beautifully formatted PDF ready for use.

Our journey is guided by the belief that technology should make our lives easier, not more complicated. Our application, powered by the OpenAIs GPT Model, reflects this belief. We aim to make document processing a breeze and transform how you create, read, and engage with your content.

Thank you for joining us on this journey. We are confident that our product will redefine your document experience, making it more efficient, interactive, and meaningful.

Welcome to the future of document processing.

## Conventions

Branch naming convention: `<name-initials>-<feature-name>` with author name initials at the beginning.

Branch Example: `kn-feature-name-example`

## Tech-Stack

### General

- [Git](https://git-scm.com) [Version Control]
- [Docker](https://www.docker.com/get-started) [Containerization]
- [GitHub](https://github.com/) [Code Hosting]
- [GitHub Actions](https://github.com/features/actions) [CI/CD]

### Frontend

- [Typescript](https://www.typescriptlang.org/) [Programming Language]
- [NodeJs](https://nodejs.org) [Javascript runtime]
- [SvelteKit](https://kit.svelte.dev/) [Full-Stack Framework]
- [Svelte](https://svelte.dev/) [Frontend Framework]
- [PocketBase](https://www.pocketbase.io/) [SaaS - Database/File-Storage/Authentication]
- [TailwindCSS](https://tailwindcss.com/) [CSS Framework]
- [DaisyUI](https://daisyui.com/) [Tailwind Component Library]

### Backend

- [Python](https://www.python.org/downloads/) [Programming Language]
- [FastApi](https://fastapi.tiangolo.com/) [Backend Framework]
- [LangChain](https://langchain.io/) [Language Processing]
- [OpenAI GPT](https://openai.com/) [Language Processing]

### PocketBase

- [SQLite](https://www.sqlite.org/index.html) [Database]
- Authentification
- File Storage

### Qdrant

- [Qdrant](https://qdrant.io/) [Vector Search Engine]

### Prometheus

- [Prometheus](https://prometheus.io/) [Obeservation Tool]

### Grafana

- [Grafana](https://grafana.com/) [Dashboard Tool]

## Getting Started

Install all the prerequisites and follow the instructions in the README.md files of the services.

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/get-started)
- [NPM](https://www.npmjs.com/)
- [Nodejs](https://nodejs.org)
- [Python](https://www.python.org/downloads/)

#### PDF Generation

These all also have to be installed on the system in order to generate PDFs.

- [texlive-full](https://www.tug.org/texlive/acquire-netinstall.html) (latex)
- [pkg-config](https://www.freedesktop.org/wiki/Software/pkg-config/)
- [cairo](https://cairographics.org/download/)
- [wkhtmltopdf](https://wkhtmltopdf.org/downloads.html) (HTML to PDF converter)

## Development

Please create the services after another in order and follow the instructions in the README.md files.

When you run them individually you have to use localhost to access and connect them to each other.

Or Use Docker Compose to create all of it and connect them together.

```bash
docker-compose up --build
```

Please setup in the following order:

### 1. Setup [Pocketbase](pocketbase/README.md)

### 2. Setup [Qdrant](qdrant/README.md)

### 3. Setup [Backend](backend/README.md)

### 4. Setup [Frontend](frontend/README.md)

### 5. Setup [Prometheus](prometheus/README.md)

### 6. Setup [Grafana](grafana/README.md)
