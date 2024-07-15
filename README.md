# @gitlab/api-tool

## Description

A tool to interact with the GitLab API to perform CRUD operations on repositories using OpenAI services.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Clone the repository](#clone-the-repository)
- [Backend Installation](#backend-installation)
- [Backend Configuration](#backend-configuration)
- [Usage](#usage)
- [Frontend Installation](#frontend-installation)
- [Frontend Configuration](#frontend-configuration)
- [Usage](#usage-1)

## Prerequisites

- Node.js installed on your system. You can download it from the [official Node.js website](https://nodejs.org/).

## Clone the repository:

```sh
git clone https://github.com/Adilevimalach/GitLabAI
```

## Backend Installation

**Navigate to the backend Directory**

```sh
cd backend
```

**Install the dependencies:**

```sh
npm install
```

## Backend Configuration

**Add configuration to `.env` file in the backend directory of your project and add the following variables:**

```sh
PORT=3000
CLIENT_ID=your_client_id
CLIENT_SECRET=your_secret_key
REDIRECT_URI=http://localhost:PORT/oauth/callback
AUTHORIZATION_URL= https://gitlab.com/oauth/authorize
TOKEN_URL=https://gitlab.com/oauth/token
BASIC_AUTH_USERNAME=
BASIC_AUTH_PASSWORD=
OPENAI_API_KEY=
```

Make sure to replace the values with your actual Gitlab API credentials.
More info: https://docs.gitlab.com/ee/api/oauth2.html

BASIC_AUTH_USERNAME and BASIC_AUTH_PASSWORD using to create basic auth to the server.

# Usage

To start the server, run:

```sh
npm start
```

## Frontend Installation

**Navigate to the fronted Directory**

```sh
cd ../frontend
```

**Install Dependencies**

```sh
npm install
```

## Frontend Configuration

**Add configuration to `.env` file in the frontend directory of your project and add the following variables:**

```sh
VUE_APP_USER_NAME=
VUE_APP_PASSWORD=

```

## Usage

To start the server, run:

```sh
npm run serve
```
