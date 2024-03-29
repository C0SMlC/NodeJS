# NodeJS

## Technologies Used
Node.js
Express.js
MongoDB (or any other database technology mentioned in the project)

## Prerequisites
Before running this project locally, make sure you have the following prerequisites installed on your machine:

Node.js: Download and install Node.js.
MongoDB: Download and install MongoDB (if applicable).

## Installation
Follow these steps to get the project up and running on your local machine:

Clone this repository to your local machine using the following command:
git clone https://github.com/your-username/your-repo.git

Navigate to the project's directory:
cd your-repo

Install the project dependencies by running the following command:
npm install

Start the application:
npm start
This command will start the Node.js server and make your application accessible at http://localhost:3000/. Adjust the port number if necessary.

Open your web browser and visit http://localhost:3000/ to see the running application.

## About 
The repo contains the code and explanation in form of commands of NodeJS, this is part of course i am currently doing, I will try to make everything clear in comments.
Thank You :)

Thd folder basics contains following things :
1. Use of modules
2. How to import modules
3. NPM
4. Use case(NPM CSV-PARSER)
5. Endpoints
6. Parameterised Endpoint

The folder Module-1 contains following things:
1. Reading and Writing files(synchronously)
2. Reading and Writing files(asynchronously)2. 
3. Creating server using http module
4. Routing in NodeJS
5. Node-Farm Project - Involves basic file retriving and dynamic changes in the website, key concept and module is fs mmodule
6. How Event loop works(not explained yet)
7. Stremas and Pipe method

The Folder Natours Project Is REST API implementation, As I will be working on same folder for couple of moneths, I will update the main concepts here
1. As on 15 March 2023, The key concepts that I learned while working on this project are, GET, POST, PATCH requests, I have tried my best to explain things in comments of the project file(app.js)
2. Another key concept is Middleware, which is basically the intermediate of request and response


## MongoDB
The problems I faced while installing MongoDB
1. Starting from version 6, the command to start Mongo server is 'mongod' and not 'mongo'.
2. Need to install MongoShell separately, no longer included with MongoDB.
3. To start mongoShell use command 'mongosh'

Concepts :

### Schema and Model

1. const tourSchema = new mongoose.Schema(), this statement will create a blueprint just like classes.
2. Now we can create model based on the above schema
3. To create a model const name = mongoose.model('modelname', blueprintName);
4. Now we can create instances based on the above model, just like we create instances of classes in JS.
5. To create instance, const name = new modelName(data);

## MVC Architecture

The goal of the architecture is to spilt a big application into specific sections which have their own purpose.

The three main sections are:
1. Controller
2. Model
3. View

-> The Controller handles request flow, and never worries about data flow (or database).
-> The Model handles data flow, and never worries about request flow.
-> The View handles data presentation, and send dynamically rendered presentation(HTML) to controller.

[Refer this video on YouTube that helped me in understanding the concept](https://youtu.be/DUg2SWWK18I)
