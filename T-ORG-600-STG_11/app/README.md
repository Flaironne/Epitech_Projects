# Organizational charts web application

This is a web application that allows users to create organizational charts. The application is built using React and Node.js. The charts are situated in a json file and are rendered using own implementation of a tree data structure.

## Installation

To install the application, clone the repository and run the following commands:

```bash
cd app
pnpm i
```

## Usage

To start the application, run the following command:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`.

## Create a new chart

To create a new chart, open the `charts.json` file in the app directory and add a new object with the following structure:

Tips:

- The `isTop` property should be set to `true` for the top-level person(s) in the chart.
- The `subordinates` property should be an array of the `id` of the subordinates of the person. (if the person has no subordinates, the array should be empty)

**Warning**: The `subordinates` does not handle duplicate `id` values in the same or different person objects.

```json
{
    "persons": [
      {
        "id": 1,
        "name": "John Doe",
        "service": "Direction",
        "fonction": "CEO",
        "image": "https://randomuser.me/api/portraits/men/1.jpg",
        "subordinates": [2],
        "isTop": true
      },
      {
        "id": 2,
        "name": "Jane Doe",
        "service": "Human Resources",
        "fonction": "HR Manager",
        "image": "https://randomuser.me/api/portraits/women/1.jpg",
        "subordinates": [],
        "isTop": false
      },
    ...
    ]
}
```
