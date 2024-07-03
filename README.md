# @gitlab/api-tool

## Description

A tool to interact with the GitLab API to perform CRUD operations on repositories using OpenAI services.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)

## Clone the repository:

```sh
git clone https://github.com/Adilevimalach/GitLabAI
```

## Backend Installation

1. **Navigate to the backend Directory**

```sh
cd backend
```

2. **Install the dependencies:**

```sh
npm install
```

## Configuration

3. **Create a `.env` file in the backend directory of your project and add the following variables:**

```sh
PORT=
CLIENT_ID=
CLIENT_SECRET=
REDIRECT_URI=
AUTHORIZATION_URL=
TOKEN_URL=
OPENAI_API_KEY=
```

4. **Create a `config.json` file in the backend directory of your project with the following content:**

```json
{
  "access_token": "",
  "refresh_token": "",
  "expires_in": ""
}
```

**Usage**
To start the server, run:

```sh
npm start
```

## Frontend Installation

1. **Navigate to the fronted Directory**

```sh
cd ../frontend
```

4. **Install Dependencies**

```sh
npm install
```

##Usage
To start the server, run:

```sh
npm run serve
```
