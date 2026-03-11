-- Database Setup --

CREATE DATABASE db;
USE db;

CREATE USER 'cs5336'@'localhost' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON db.* TO 'cs5336'@'localhost';

-- Create Tables --
CREATE TABLE IF NOT EXISTS Accounts (
	username VARCHAR(255) PRIMARY KEY,
	user_password VARCHAR(255) NOT NULL,
	user_role VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Airline (
	airline_code VARCHAR(255) PRIMARY KEY,
    airline_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Flight (
	flight_id INT PRIMARY KEY,
    destination VARCHAR(255) NOT NULL,
    terminal VARCHAR(255) NOT NULL,
    gate_number VARCHAR(255) NOT NULL,
    airline_name VARCHAR(255) NOT NULL,
    airline_code VARCHAR(255) NOT NULL,
    FOREIGN KEY (airline_code) REFERENCES Airline(airline_code)
);

CREATE TABLE IF NOT EXISTS Passenger (
	ticket_number VARCHAR(255) PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    identification VARCHAR(255) NOT NULL,
    passenger_status VARCHAR(255) NOT NULL,
    flight_id INT NOT NULL,
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Bag (
	bag_id INT PRIMARY KEY AUTO_INCREMENT, 
    location VARCHAR(255) NOT NULL,
	ticket_number VARCHAR(255) NOT NULL,
    flight_id INT NOT NULL,
    FOREIGN KEY (ticket_number) REFERENCES Passenger(ticket_number) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id)
);

CREATE TABLE IF NOT EXISTS Staff (
	username VARCHAR(255) PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    airline_code VARCHAR(255) NOT NULL,
    FOREIGN KEY (username) REFERENCES Accounts(username),
    FOREIGN KEY (airline_code) REFERENCES Airline(airline_code)
);

CREATE TABLE IF NOT EXISTS Message (
	msg_id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    username VARCHAR(255) NOT NULL,
    FOREIGN KEY (username) REFERENCES Staff(username)
);