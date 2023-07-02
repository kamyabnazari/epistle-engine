# EE - Epistle Engine

This is the Repository for the unified services for the Epistle Engine with Github actions and Docker support.
## About the Project
Our goal is to revolutionize how people interact with documents. We understand the frustrations of traditional document processing methods, where finding information can be time-consuming. That's why we developed a system that allows users to extract valuable insights, ask questions, and receive instant answers from PDF documents.

Our application, combined with the ChatGPT plugin, transforms the way you engage with PDFs. It's easy to ask specific questions or understand complex concepts without flipping through countless pages. We built a plugin that simplifies document navigation, question answering, and comprehension.

But we didn't stop there. We also recognize the need for efficient document creation. That's why we added a feature that generates content based on your prompts. Whether you need an essay or a research report, our application not only drafts your document but also provides a beautifully formatted PDF ready for use.

Our journey is guided by the belief that technology should make our lives easier, not more complicated. Our application, powered by the ChatGPT plugin, reflects this belief. We aim to make document processing a breeze and transform how you create, read, and engage with your content.

Thank you for joining us on this journey. We are confident that our product will redefine your document experience, making it more efficient, interactive, and meaningful.

Welcome to the future of document processing.

## Conventions

Branch naming convention: `kn-<feature-name>` with author name initials at the beginning.

Branch Example: `kn-feature-name-example`

## Tech-Stack

### General

- [Git](https://git-scm.com)  [Version Control] 
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

## Getting Started

Install all the prerequisites and follow the instructions in the README.md files of the services.

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/get-started)
- [NPM](https://www.npmjs.com/)
- [Nodejs](https://nodejs.org)
- [Python](https://www.python.org/downloads/)


#### PDF Generation

- [texlive-full](https://www.tug.org/texlive/acquire-netinstall.html) (latex)
- [pkg-config](https://www.freedesktop.org/wiki/Software/pkg-config/)
- [cairo](https://cairographics.org/download/)
- [wkhtmltopdf](https://wkhtmltopdf.org/downloads.html) (HTML to PDF converter)

## Development

Please create the services after another in order and follow the instructions in the README.md files.

### 1. Setup [Pocketbase](pocketbase/README.md)

### 2. Setup [Qdrant](qdrant/README.md)

### 3. Setup [Backend](backend/README.md)

### 4. Setup [Frontend](frontend/README.md)


## Installation

Download the application from our official website. You will receive a .zip file.
Unzip the downloaded file and locate the setup.exe file.
Double-click on the setup.exe file to start the installation process. Follow the on-screen instructions. Once the installation is complete, open the application.

## Working with PDFs

### Step 1: Importing a PDF

Go to "File" > "Open," locate the PDF document you want to work with and click "Open."

### Step 2: Asking Questions

Once you've opened your PDF, you can ask questions about its content. Simply type your question into the "Ask a question" box on the right side of the screen and hit "Enter." The ChatGPT plugin will process your question and provide a response based on the content of the PDF.

### Step 3: Highlighting and Note-Taking

You can also highlight text and add notes to your PDF. To do so, select the text you wish to highlight, right-click, and choose "Highlight." To add a note, right-click on the highlighted text and select "Add Note."

## Creating a PDF

### Step 1: Drafting the Document

Click on "File" > "New Document." In the prompt box, enter your topic or the instructions for your essay/report. Click "Create" and the AI will generate the document based on your prompt.

### Step 2: Formatting and Saving as a PDF

Once the document is created, you can format it according to your requirements. You can adjust the font type, size, and color, add headers and footers, and more. After formatting, click on "File" > "Save as PDF." Choose the location where you want to save the file and click "Save."

This is just a brief overview of the many features our application and the ChatGPT plugin offer. For a more detailed guide, please refer to the User Manual included in the application.
