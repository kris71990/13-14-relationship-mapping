![CF](https://camo.githubusercontent.com/70edab54bba80edb7493cad3135e9606781cbb6b/687474703a2f2f692e696d6775722e636f6d2f377635415363382e706e67) 13: Single Resource Mongo and Express API
===

## Submission Instructions
* Read this document entirely and estimate how long this assignment will take.
* Work in a fork of this repository
* Work in a branch on your fork
* Protect your repository's `master` branch by activating `continuous-integration/travis-ci` status checks
* Create a pull request from your `lab` + `<your name>` branch to your `master` branch
* Open a pull request to this repository
* Submit on canvas a question and observation,your original estimate, how long you spent, and a link to your pull request

## Learning Objectives
* students will be able to work with the MongoDB database management system
* students will understand the primary concepts of working with a NoSQL database management system
* students will be able to create custom data models *(schemas)* through the use of mongoose.js
* students will be able to use mongoose.js helper methods for interacting with their database persistence layer

## Requirements
### Configuration
Configure the root of your repository with the following files and directories. Thoughtfully name and organize any additional configuration or module files.
* **README.md** - contains documentation
* **.env** - contains env variables **(should be git ignored)**
* **.gitignore** - contains a [robust](http://gitignore.io) `.gitignore` file
* **.eslintrc.json** - contains the course linter configuration
* **.eslintignore** - contains the course linter ignore configuration
* **.travis.yml** -
* **package.json** - contains npm package config
  * create a `test` script for running tests
  * create `dbon` and `dboff` scripts for managing the mongo daemon
* **db/** - contains mongodb files **(should be git ignored)**
* **index.js** - entry-point of the application
* **src/** - contains the remaining code
  * **src/lib/** - contains module definitions
  * **src/model/** - contains module definitions
  * **src/route/** - contains module definitions
  * **src/\_\_test\_\_/** - contains test modules
  * **main.js** - starts the server

## Feature Tasks
For this assignment you will be building a RESTful HTTP server using express.

### Model
In the model/ directory create a Model for a resource using Mongoose (that is different from the class lecture resource). The model must include 4 properties, two of which should be required. Design your model so that it can have a relationship to a second model you will create tomorrow. It should be the `One` in a `One to Many` model relationship.

### Server Endpoints
Create the following routes for performing CRUD operations on your resource
* `POST /api/<resource-name>`
  * pass data as stringifed JSON in the body of a **POST** request to create a new resource
  * on success respond with a 200 status code and the created resource
  * on failure due to a bad request send a 400 status code
* `GET /api/<resource-name>/:id`
  * should respond with the resource and a 200 on success
    * if the id is not found respond with a 404
* `PUT /api/<resource-name>/:id`
  * should respond with the updated resource and a 200 on success
    * if the id is not found respond with a 404
    * if the request is invalid it should respond with a 400
* `DELETE /api/<resource-name>/:id`
  * the route should delete a resource with the given id
  * on success this should return a 204 status code with no content in the body
  * on failure due to a resource with that id not existing respond with a 404 status code

### Tests
* create a test that will ensure that your API returns a status code of 404 for routes that have not been registered
* create a series of tests to ensure that your `/api/resource-name` endpoint responds as expected. A minimum set of tests suite must contain the following tests:
  * POST should test for 200, 400, and 409 (if any keys are unique)
  * GET should test for 200 and 404
  * PUT should test for 200, 400, 404, and 409 (if any keys are unique)
  * DELETE should test for 204 and 404

### Documentation
In the README.md write documention for starting your server and making requests to each endpoint it provides. The documentation should describe how the server would respond to valid and invalid requests.

## Stretch Goal
* Create and test a GET route with pagination for returning an array of your resource.
