To run this application locally on your PC, you should have the following installed:

1. Node.js Version: Make sure you have Node.js version greater than 11 installed on your system.
2. Fork the Repository.
3. Clone the Repository: git clone https://github.com/golova1337/Rent-a-car.git
4. Install Dependencies: npm install
5. Configure Environment Variables: The project utilizes environment variables for configuration. Create a .env file in the root directory of the project and fill it with the content from the .env.example file.
6. Run MySQL server on your computer. If you don't have MySQL installed, you need to install it from the official website.
7. Create DB name "test":  CREATE DATABASE IF NOT EXISTS test;
8. Execute the command: npm run migrate.
9. Execute the command: npm run seed. This will populate the database with initial data.
10. Using nodemon if you have nodemon installed on your system you can make use of the command: npm run nodemon
11. Using node: npm run start
12. Follow the link: http://localhost:5500/api-docs and read the explanation to start using the API.

## Documentation API

The documentation API is available at the following link:

[Swagger UI](http://localhost:5500/api-docs)

Run it using Docker in the root directory.

1. Fork my app to your repository.
2. Execute: git clone https://github.com/golova1337/Rent-a-car.git
3. Install all dependencies: npm install
4. Create Environment Variables: Create a .env file in the root directory. Ensure that the password in the .env file for DB_PASSWORD matches the MYSQL_ROOT_PASSWORD.
5. Run Docker: Open a terminal or command prompt and run the following command in the root directory to start Docker: docker-compose up -d
6. Run Migrations: Once Docker is running, execute the following command to run migrations: npm run migrate
7. Seed the Database: After migrations, seed the database with initial data by running: npm run seed
8. Test the Application: You can test the application by navigating to http://localhost:5500/api-docs in your web browser.

Note: Ensure that you perform each step in the order specified.

Stop docker:

1. docker-compose down
