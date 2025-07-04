Play Store Application
Problem Statement:
You are developing a Play Store application where various apps will be available for users. The application will have two types of users
Owner
User
User Stories:
1.	As a user, I should be able to log in, log out, and register into the application.
2.	As a user, I should be able to search for an application by name and view the details of the app, including its name, description, release date, version, ratings, and genre.
3.	As a user, I should be able to view applications under different categories like games, beauty, fashion, women, and health.
4.	As a user, I should be able to filter applications based on ratings.
5.	As a user, I should be able to write reviews or comments for the applications.
6.	As a user, I should receive notifications about updates for the applications.
Owner Stories:
1.	As an owner, I should be able to register, log in, and log out of the application.
2.	As an owner, I should be able to perform CRUD operations on the applications I add.
3.	As an owner, I should be able to restrict the visibility of an application from users.
4.	As an owner, I should be able to see the count of users who have downloaded my application.
5.	As an owner, I should be able to view comments left by users on my applications.
6.	As an owner, I should receive notifications when my application is downloaded.
7.	As an owner, I should be able to announce updates to users.

Sprint Plan:
Sprint I Objectives:
1.	Create the database schema along with their relationships.
2.	Implement CRUD operations for User and Admin (register, login, logout) using Express/Node.js.
3.	Create the template using React.
Sprint II Objectives:
1.	Develop the search functionality based on different criteria.
2.	Implement the Owner update application module (change visibility, add/remove features).
3.	Create a comments/review module for users.
4.	Implement Spring Security and JWT.
5.	Perform component and end-to-end testing.

Sprint III Objectives:

1.	Create Data Transfer Objects (DTOs).
2.	Develop the Service Layer logic.
3.	Implement controllers to direct REST APIs.
4.	Create a notification service for update status.
5.	Integrate the Frontend with the Backend.
6.	Make the application responsive.
Instructions:
1.	Set Up MongoDB Database:
2.	Install MongoDB on your system if not already installed.
3.	Create a MongoDB database to store application data.
4.	Design appropriate collections to store user and application information.
