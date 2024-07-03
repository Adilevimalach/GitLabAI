# @gitlab/api-tool

## Description

A tool to interact with the GitLab API to perform CRUD operations on repositories using OpenAI services.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)

## Prerequisites

- Node.js installed on your system. You can download it from the [official Node.js website](https://nodejs.org/).

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

3. **Add configuration to `.env` file in the backend directory of your project and add the following variables:**

```sh
PORT=3000
CLIENT_ID=your_client_id
CLIENT_SECRET=your_secret_key
REDIRECT_URI=http://localhost:PORT/oauth/callback
AUTHORIZATION_URL= https://gitlab.com/oauth/authorize
TOKEN_URL=https://gitlab.com/oauth/token
OPENAI_API_KEY=
```

Make sure to replace the values with your actual Gitlab API credentials.
More info: https://docs.gitlab.com/ee/api/oauth2.html

# Usage

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

## Usage

To start the server, run:

```sh
npm run serve
```
