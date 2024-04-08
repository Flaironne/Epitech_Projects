<img src="https://github.com/EpitechMscProPromo2026/T-WEB-501-STG_11/assets/145432284/693e42cb-1a77-4891-8803-54ce251a94b0=100x100" alt="JQLOGO" width="300" height=300 align="right"/>

# Welcome to JobQuest :rocket:

This is a project that aims to make an application to help people searching jobs.

[Here](https://prezi.com/view/B5b9v9mKcMRFJYgwKnu8/) is a french support presentation.

The project is **online** ! You can access it by clicking [here](https://jobquest.alexishenry.eu).

## Table of contents
1. [Prerequisites](#prerequisites)
2. [Setup and configuration](#setup-and-configuration)
3. [Run the project](#running-the-project)
4. [Steps](#steps)
5. [Bonus](#bonus)
6. [Technologies](#technologies)
7. [Authors](#authors)

## Prerequisites

- PHP >= 8.1
- MariaDB >= 10.3 
- NPM >= 9.6.7
- Node >= 18.17.1
  
## Setup and configuration

### Clone the repository

```bash
$ git clone git@github.com:EpitechMscProPromo2026/T-WEB-501-STG_11.git
$ cd T-WEB-501-STG_11/
```
### Backend

Create an account mysql. If you already have skip to [here](#database-configuration).

```bash
$ sudo mysql
...
mysql> CREATE USER '<username>'@'localhost' IDENTIFIED BY '<password>';
mysql> GRANT ALL PRIVILEGES ON *.* TO '<username>'@'localhost';
mysql> exit;

```
#### Database configuration
```bash
$ mysql -u <username> -p<password>
...
mysql> CREATE DATABASE <name>;
mysql> exit;
```
The script will ask your database credentials.

```bash
$ cd backend
$ chmod +x setup.sh && bash setup.sh
```

If the migration failed check your database credentials.

In the `.env` file, you will have by default the differents variables :

```bash
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000
FRONT_URL=http://localhost:3000
```

> If you want to disabled the debug of the application turn the `APP_DEBUG` to `false` and the `APP_ENV` to `production`.

#### Tests

You can run the tests (features and unit tests) of the application by running the following command.

```bash
$ php artisan test --profile
```

### Frontend

First you will need to install the javascript dependencies.

```bash
$ cd ../frontend
$ npm install
```

#### Configuration

To run this project, you will need to configure the following environment variables to your .env file.

```bash
$ cp .env.example .env
```

By default `NEXT_PUBLIC_API_URL` is "http://127.0.0.1:8000/api".

Then you need to build the project.

```bash
$ npm run build
```

## Running the project

Now you need to start first the API server.

```bash
$ cd ../backend
$ php artisan serve
```

**Open a new terminal**

Go to the repository to start the project.

```bash
$ cd frontend
$ npm run start
```

The application will be running on http://localhost:3000 by default.

## Steps

First, we will explain the choice of technologies.

We used Next.js for the frontend because it allows rapid and efficient implementation, thanks to its effective page system introduced in Next.js 13, as well as its advanced component system. This makes communication with the API easy.

We chose Laravel as our backend technology for several reasons:

- Elegant Syntax and MVC Architecture: Laravel offers a clean and elegant syntax that makes coding enjoyable. It follows the Model-View-Controller (MVC) architectural pattern, which separates the application logic into three interconnected components. This separation enhances code organization and maintainability.
- Rich Set of Features: Laravel provides a rich set of features out of the box, such as authentication, routing, caching, and task scheduling. These built-in functionalities save development time and effort, allowing developers to focus on building specific application features rather than reinventing the wheel.
- Eloquent ORM: Laravel's Eloquent ORM (Object-Relational Mapping) simplifies database interactions by allowing developers to work with databases using intuitive, expressive syntax instead of writing complex SQL queries. This makes database management more developer-friendly and efficient.
- Security: Laravel takes security seriously and includes built-in features like CSRF (Cross-Site Request Forgery) protection, SQL injection prevention, and XSS (Cross-Site Scripting) protection. Laravel's security features help developers build secure applications by default, reducing the risk of common web vulnerabilities.
- RESTful API Development: Laravel provides excellent support for building RESTful APIs, making it well-suited for modern web and mobile application development. Its flexibility and ease of use in handling API requests and responses simplify the process of creating robust API endpoints.

Overall, Laravel's combination of simplicity, robust features, and a supportive community makes it a popular choice for backend development, especially when building scalable and maintainable web applications.
      
### Step 1

The first step consists to create the database and the differents needed tables.

- [x] table to store advertissements
- [x] table to store companies
- [x] table to store people
- [x] table to keep information about a job application

You can see below the structure of the database :

![DB Diagram](https://github.com/EpitechMscProPromo2026/T-WEB-501-STG_11/assets/91117127/18a6a94d-3f0c-4b59-9f1a-5734d3e03fed)

### Step 2

Creating a home page with :
- [x] navbar (logo, name project and other page links)
- [x] main 
- [x] div : container all jobs card
- [x] div : job's cards (title, description, learn more button not active)

### Step 3

- [x] interactive learn more button
- [x] div : container of job's description
- [x] div : description card (full description, wages, place, working time,...)

### Step 4

Step 4 involves creating an API that adheres to the principles of RESTful API (including HTTP terms and routing rules).

- [x] RESTful API made with [Laravel](https://laravel.com/)
- [x] CRUD operations on tables (create, read, update, delete)
- [x] HTTP verbs and API routing rules respected
- [x] Learn more button made dynamic, by making request to the API to fetch job details

#### Users CRUD following the RESTful API rules

<details>
 <summary><code>GET</code> <code><b>/</b></code> <code>users</code></summary>

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`       | `A collection of resource of all users`                                |

</details>

<details>
 <summary><code>GET</code> <code><b>/</b></code> <code>users</code> <code><b>/</b></code> <code>[id]</code></summary>

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`       | `A resource of the user specified in the url`                                |

</details>


<details>
 <summary><code>POST</code> <code><b>/</b></code> <code>users</code></summary>

##### Parameters

> | name       | type      | data type              | description                                      |
> |------------|-----------|------------------------|--------------------------------------------------|
> | email      | required  | string (max:255)       | User's unique email address (maximum 255 characters) |
> | firstname  | required  | string (max:255)       | User's first name (maximum 255 characters)        |
> | lastname   | required  | string (max:255)       | User's last name (maximum 255 characters)         |
> | password   | optional  | string (min:8)         | User's password (minimum 8 characters)           |
> | phone      | required  | numeric (digits:10)    | User's phone number (10 digits)                   |
> | region_id  | sometimes | exists:regions, id     | ID of the user's associated region (if provided) |
> | is_admin   | required  | boolean                | Indicates if the user is an admin (true or false) |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `application/json`      | (No content in the response body)                                   |

</details>

<details>
 <summary><code>PUT</code> <code><b>/</b></code> <code>users</code> <code><b>/</b></code> <code>[id]</code></summary>

##### Parameters

> | name       | type      | data type              | description                                      |
> |------------|-----------|------------------------|--------------------------------------------------|
> | email      | optional    | string (max:255)      | User's email address                             |
> | firstname  | optional    | string (max:255)      | User's first name                                |
> | lastname   | optional    | string (max:255)      | User's last name                                 |
> | password   | optional    | string (min:8)        | User's password (minimum 8 characters)          |
> | phone      | optional   | numeric (digits:10)   | User's phone number (10 digits)                 |
> | region_id  | optional    | regions, id            | ID of the user's associated region              |
> | is_admin   | optional   | boolean                | Indicates if the user is an admin (true or false) |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`       | `A resource of the updated user`                                |

</details>

<details>
 <summary><code>DELETE</code> <code><b>/</b></code> <code>users</code> <code><b>/</b></code> <code>[id]</code></summary>

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `204`         | <no content>        | null                                                                |

</details>

### Step 5

- [x] interactive apply button on the job's cards
- [x] form opened onClick of the apply button
- [x] form functionnal (name,email,phone,...) saved in database
- [x] send a message to the owner of the ad (email + notification on the profile)

### Step 6

- [x] login page
- [x] register page (create account)
- [x] account page (modify account)
- [x] apply button dynamic if logged

### Step 7

- [x] creating a user-friendly table
- [x] controling the admin access only by admin
- [x] redirecting the non-admin users to the home page
- [x] user-friendly pagination
- [x] listing all the tables from the backend
- [x] adding data on on the table and in the backend
- [x] deleting data on the table and in the backend
- [x] updating data on the table and in the backend
- [x] monitoring database from front

### Step 8

- [x] refactoring 
- [x] card design
- [x] library (Swal)
- [x] responsive


## Bonus

- Light/dark mode
- Page for list all companies and for each their count of jobs
- Page to see the jobs saved by the user 
- Page to see the user job applications
- Page to see the notification (when someone apply to one of your job)
- Infinite scroll on the jobs components
- Filter (with search and selects) on the homepage
- Unit testing
- Online hosting

## Technologies

![](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&color=20232a)
![](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&color=20232a)
![](https://img.shields.io/badge/laravel-%23FF2D20.svg?style=for-the-badge&logo=laravel&color=20232a)
![](https://img.shields.io/badge/bash-%23121011.svg?style=for-the-badge&logo=gnu-bash&color=20232a)
![](https://img.shields.io/badge/Insomnia-black?style=for-the-badge&logo=insomnia&logoColor=5849BE&color=20232a)
![](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&color=20232a)
![](https://img.shields.io/badge/mysql-000000?style=for-the-badge&logo=mysql&logoColor=white)

## Authors

- [@AlxisHenry](https://github.com/AlxisHenry)
- [@Flaironne](https://github.com/Flaironne)
