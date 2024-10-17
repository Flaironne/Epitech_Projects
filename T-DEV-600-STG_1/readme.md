# Welcome to TrellQuest :rocket:

Our project is a collaborative effort among a team of three individuals to create an application that serves as a clone of Trello. The primary goal of this project is to learn how to utilize the Trello API while gaining practical experience in developing mobile applications using React Native.

Trello is an online project management platform that employs a virtual board system to organize tasks. By replicating a simplified version of Trello, we aim to comprehend the underlying mechanics of this popular application while honing our programming and user interface design skills.

By selecting React Native as our development framework, we benefit from its ease of use and ability to create cross-platform mobile applications. This technology enables us to rapidly develop features while providing users with a smooth and responsive experience.

Our development team works closely together to divide tasks, share knowledge, and address any challenges encountered during the development process. Each member contributes their unique skills, whether in programming, design, or project management, to ensure the success of our application.

Beyond simply reproducing the basic functionalities of Trello, we also aspire to incorporate unique and innovative features into our application. This will deepen our understanding of key app development concepts while adding value to our project.

In summary, our project represents a collaborative learning opportunity that allows us to delve deeply into mobile app development with React Native, familiarize ourselves with the Trello API, and develop a useful and innovative product.

## Table of contents

- [Welcome to TrellQuest :rocket:](#welcome-to-trellquest-rocket)
  - [Table of contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Setup and configuration](#setup-and-configuration)
    - [Clone the repository](#clone-the-repository)
    - [Configure the environment variables](#configure-the-environment-variables)
    - [Install the dependencies](#install-the-dependencies)
    - [Run the tests](#run-the-tests)
  - [Launch the application](#launch-the-application)
  - [Technical guide](#technical-guide)
    - [Components](#components)
    - [Pages](#pages)
    - [Tests E2E](#tests-e2e)
  - [User guide](#user-guide)
  - [Application diagrams](#application-diagrams)
  - [Contributing](#contributing)
  - [Bonus](#bonus)
  - [Technologies](#technologies)
  - [Authors](#authors)

## Prerequisites

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [Expo](https://expo.dev/)
- [Cypress](https://www.cypress.io/)

## Setup and configuration

### Clone the repository

```bash
$ git clone git@github.com:EpitechMscProPromo2026/T-DEV-600-STG_1.git
```

### Configure the environment variables

```bash
$ cp .env.example .env
```

Change the values of the environment variables in the `.env` file.

### Install the dependencies

```bash
$ npm install
```

### Run the tests

```bash
$ npm run cypress:open
```

## Launch the application

```bash
$ npm run start # npx expo start
```

## Technical guide

Our project is built using React Native, a popular framework for developing mobile applications. React Native allows us to create cross-platform applications that run on both iOS and Android devices, providing a consistent user experience across different platforms. The project leverages various libraries and tools to enhance the development process and deliver a high-quality application.

The project is structured in a way that makes it easy to navigate and understand the codebase. Here are some key aspects of the project's architecture:

### Components

We create the components in the `src/components` directory. The components are reusable and can be used across multiple pages in the application. The only things you need to do is to import the component inside the `src/components/index.ts` file and use it elsewhere in the application.

### Pages

The project use the `expo-router` library to manage the navigation between pages. The pages are organized in the `src/pages` directory.

### Tests E2E

We use the `Cypress` library to write end-to-end tests for our application. The tests are located in the `cypress/integration` directory.

The tests are focused on the following areas:

- User authentication
- Board CRUD operations
- Navigation between pages

## User guide

The first page of the application is the sign-in page. Here you can enter your API token to access the application.

![image](/assets/docs/sign-in.png)

Here, the  of the application are displayed. You can navigate between the different tabs by clicking on the tab icon:

- Workspaces

![image](/assets/docs/workspaces.png)

- Account

Allow you to view your account information or log out.

![image](/assets/docs/account.png)

- Wordle

It's a bonus feature that allows you to play the Wordle game.

![image](/assets/docs/wordle.png)

- My Cards

See all the cards you have created, or on which you are assigned.

![image](/assets/docs/my_cards.png)

The main page of the application is the workspace page. Here you can create a new workspace, rename a workspace, delete a workspace, and view all the boards in your workspace.

To rename a workspace, make a signle tap on the workspace name.

![image](/assets/docs/rename_workspace.png)

To delete a workspace, make a long press on the workspace name.

![image](/assets/docs/delete_workspace.png)

To create a new workspace, click on the "+" button at the top right corner of the screen.

![image](/assets/docs/create_workspace.png)

Once you have created a workspace, it will appear on the workspace page.

By clicking on the "Boards >" link, you can view all the boards in your workspace.

![image](/assets/docs/workspace_boards_link.png)

Here is the page where you can view all the boards in your workspace, on this page you will be able to create, rename or delete a board.

![image](/assets/docs/workspace_boards.png)

To rename a board, make a single tap on the board name.

![image](/assets/docs/rename_board.png)

To delete a board, make a long press on the board name.

![image](/assets/docs/delete_board.png)

You can create a new board by clicking on the "+" button at the top right corner of the screen.

![image](/assets/docs/create_board_selection.png)

You have the choice between creating a normal board or a board from a template. To create a board from a template, click on the "Create from template" button.

![image](/assets/docs/create_board_template.png)

![image](/assets/docs/create_normal_board.png)

The board appears on the workspace page once it has been created.

![image](/assets/docs/board_created.png)

You can navigate to a board by returning to the workspace page and clicking on the board card.

![image](/assets/docs/going_to_board.png)

You have access to a view of the board, where you can view all the lists and cards in the board.

![image](/assets/docs/board_view.png)

In the board view you can create a new list, view all the cards in a list, and delete a list, by using the same gestures as for the workspace and board pages.

![image](/assets/docs/delete_list.png)
![image](/assets/docs/create_list.png)

## Application diagrams

![image](https://github.com/EpitechMscProPromo2026/T-DEV-600-STG_1/assets/91117127/7a3c2299-7234-42cf-9b3e-593ba3d03afb)

## Contributing

We work collaboratively on our project, following a set of guidelines to ensure consistency and quality in our development process. Here are some key aspects of our contribution workflow:

Branching Strategy: We use a branching strategy to manage our codebase, creating feature branches for new features or bug fixes and merging them into the main branch upon completion.

Code Reviews: We conduct code reviews to ensure that our code meets the project's standards and best practices. This process helps us identify and address issues early in the development cycle.

Pull Requests: We submit pull requests to propose changes to the codebase, providing a clear description of the modifications and any relevant context. This allows team members to review the changes and provide feedback before merging them into the main branch.

Commit Messages:

We adhere to a standardized commit convention to maintain consistency and clarity in our version control history. Our commit messages follow the format of:

```bash
$ git commit -m "type(scope?): message"
```

The commit message structure consists of the following elements:

Type: The type of commit, such as feat, fix, docs, style, refactor, test, or chore.

Scope: The scope of the commit, indicating the section of the codebase affected by the changes.

Message: A concise description of the commit, providing context and details about the modifications.

Here are some examples of commit messages:

```bash
$ git commit -m "feat(components): add music player component"
$ git commit -m "fix(pages): resolve issue with login page"
$ git commit -m "docs(readme): update user guide section"
$ git commit -m "style(styles): refactor button styles"
```

## Bonus

- Wordle

## Technologies

![](https://img.shields.io/badge/TypeScript-ED8B00?style=for-the-badge&logo=typescript&color=20232a)

## Authors

- [@AlxisHenry](https://github.com/AlxisHenry)
- [@Flaironne](https://github.com/Flaironne)
- [@Leily67](https://github.com/Leily67)
