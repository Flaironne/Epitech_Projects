<img src="https://i.ibb.co/vqxXhH6/logo.png" alt="CATQUEST_LOGO" width="300" height=300 align="right"/>

# Welcome to E-Quest :rocket:

This E-Commerce project was carried out by 3 students from Epitech Strasbourg, using the PHP & Javascript stack (Docker, Symfony, React, Stripe).

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Setup and configuration](#setup-and-configuration)
3. [Run the project](#running-the-project)
4. [Technologies](#technologies)
5. [Authors](#authors)

## Prerequisites

- Docker

## Setup and configuration

### Clone the repository

```bash
$ git clone git@github.com:EpitechMscProPromo2026/T-WEB-600-STG_11.git
```

### Manual setup

In the two folders (backend and frontend), you will need to configure the environments variables

#### Configure the environment variables

In the two folders configure the environments variables

```bash
$ cp .env.example .env
```

Change the values of the environment variables in the `.env` file.

In the `app` folder, you will need to configure the following environment variables:

```env
APP_SECRET=<GENERATE_A_SECRET>
STRIPE_SECRET=<YOUR_STRIPE_SECRET>
```

In the `frontend` folder, you will need to configure the following environment variables:

```env
VITE_REACT_APP_SERVICE_ID = "service_inicpgc"
VITE_REACT_APP_TEMPLATE_ID = "<YOUR_MAILJS_TEMPLATE_ID>"
VITE_REACT_APP_PUBLIC_KEY = "<YOUR_MAILJS_PUBLIC_KEY>"
```

## Running the project

### Start the Project

```bash
$ cd app
$ composer i
$ php bin/console lexik:jwt:generate-keypair
$ docker compose up -d
$ bash reset.sh
$ symfony server:start
```

Open a new terminal

```bash
$ cd frontend
$ npm install
$ npm run dev
```

### Access documentation

```bash
$ http://localhost:8000/api/doc
```

## Technologies

![](https://img.shields.io/badge/docker-ED8B00?style=for-the-badge&logo=docker&color=20232a)
![](https://img.shields.io/badge/symfony-ED8B00?style=for-the-badge&logo=symfony&color=20232a)
![](https://img.shields.io/badge/TypeScript-ED8B00?style=for-the-badge&logo=typescript&color=20232a)
![](https://img.shields.io/badge/react-ED8B00?style=for-the-badge&logo=react&color=20232a)
![](https://img.shields.io/badge/npm-ED8B00?style=for-the-badge&logo=npm&color=20232a)

## Authors

- [@AlxisHenry](https://github.com/AlxisHenry)
- [@Flaironne](https://github.com/Flaironne)
- [@Leily67](https://github.com/Leily67)
