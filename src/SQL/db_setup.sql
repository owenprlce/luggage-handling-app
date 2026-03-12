-- Database Setup --

CREATE DATABASE db;
USE db;

CREATE USER 'cs5336'@'localhost' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON db.* TO 'cs5336'@'localhost';

-- Create Tables --
CREATE TABLE IF NOT EXISTS Staff_Login (
	username VARCHAR(255) PRIMARY KEY,
	user_password VARCHAR(255) NOT NULL,
	user_role VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Airline (
	airline_code VARCHAR(255) PRIMARY KEY,
    airline_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Flight (
	flight_id VARCHAR(255) PRIMARY KEY,
    destination VARCHAR(255) NOT NULL,
    gate_number VARCHAR(255) NOT NULL,
    terminal VARCHAR(255) NOT NULL,
    flight_status VARCHAR(255) NOT  NULL,
    airline_code VARCHAR(255) NOT NULL,
    FOREIGN KEY (airline_code) REFERENCES Airline(airline_code)
);

CREATE TABLE IF NOT EXISTS Passenger (
	ticket_number VARCHAR(255) PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    identification VARCHAR(255) UNIQUE NOT NULL,
    passenger_status VARCHAR(255) NOT NULL,
    flight_id VARCHAR(255) NOT NULL,
    airline_code VARCHAR(255) NOT NULL,
	FOREIGN KEY (flight_id) REFERENCES Flight(flight_id) ON DELETE CASCADE,
    FOREIGN KEY (airline_code) REFERENCES Airline(airline_code)
);

CREATE TABLE IF NOT EXISTS Bag (
	bag_id VARCHAR(255) PRIMARY KEY, 
    location VARCHAR(255) NOT NULL,
	ticket_number VARCHAR(255) NOT NULL,
    flight_id VARCHAR(255) NOT NULL,
    airline_code VARCHAR(255) NOT NULL,
    FOREIGN KEY (ticket_number) REFERENCES Passenger(ticket_number) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id),
    FOREIGN KEY (airline_code) REFERENCES Airline(airline_code)
);

CREATE TABLE IF NOT EXISTS Staff (
	username VARCHAR(255) PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    airline_code VARCHAR(255),
    FOREIGN KEY (username) REFERENCES Staff_Login(username) ON DELETE CASCADE,
    FOREIGN KEY (airline_code) REFERENCES Airline(airline_code)
);

CREATE TABLE IF NOT EXISTS Message (
	msg_id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    username VARCHAR(255) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    FOREIGN KEY (username) REFERENCES Staff(username),
    FOREIGN KEY (recipient) REFERENCES Staff(username)
);

-- Add Account Data --
INSERT INTO Staff_Login (username, user_password, user_role)
VALUES ("ACarnline", "Password123", "Airline Staff");
INSERT INTO Staff_Login (username, user_password, user_role)
VALUES ("PMahomes", "Password456", "Gate Staff");
INSERT INTO Staff_Login (username, user_password, user_role)
VALUES ("JDoe", "Password789", "Ground Staff");
INSERT INTO Staff_Login (username, user_password, user_role)
VALUES ("Admin", "Password000", "Admin");

-- Add Airline Data --
INSERT INTO Airline (airline_code, airline_name)
VALUES ("AA", "American Airlines");
INSERT INTO Airline (airline_code, airline_name)
VALUES ("DL", "Delta Airlines");
INSERT INTO Airline (airline_code, airline_name)
VALUES ("UA", "United Airlines");

-- Add Flight Data --
INSERT INTO Flight (flight_id, destination, gate_number,  terminal, flight_status, airline_code)
VALUES ("AA1000", "Dallas", "23", "A", "Not Departed", "AA");
INSERT INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code)
VALUES ("DL1000", "Orlando", "10", "B", "Not Departed", "DL");
INSERT INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code)
VALUES ("UA1000", "Chicago", "17", "C", "Not departed", "UA");

-- Add Passenger Data --
INSERT INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code)
VALUES ("1111111111", "Joe", "Montana", "123456", "Not-checked-in", "AA1000", "AA");
INSERT INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code)
VALUES ("2222222222", "Steve", "Johnson", "234567", "Not-checked-in", "DL1000", "DL");
INSERT INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code)
VALUES ("3333333333", "Jane", "Doe", "345678", "Not-checked-in", "UA1000", "UA");

-- Add Bag Data --
INSERT INTO Bag (bag_id, location, ticket_number, flight_id, airline_code)
VALUES ("569823", "Check-in counter", "1111111111", "AA1000", "AA");
INSERT INTO Bag (bag_id, location, ticket_number, flight_id, airline_code)
VALUES ("750862", "Check-in counter", "2222222222", "DL1000", "DL");
INSERT INTO Bag (bag_id, location, ticket_number, flight_id, airline_code)
VALUES ("294759", "Check-in counter", "3333333333", "UA1000", "UA");

-- Add Staff Data --
INSERT INTO Staff (username, firstname, lastname, email, phone, airline_code)
VALUES ("ACarnline", "Austin", "Carnline", "lcarnline@smu.edu", 4444444444, "AA");
INSERT INTO Staff (username, firstname, lastname, email, phone, airline_code)
VALUES ("PMahomes", "Patrick", "Mahomes", "pmahomes@gmail.com", 6666666666, "DL");
INSERT INTO Staff (username, firstname, lastname, email, phone, airline_code)
VALUES ("JDoe", "John", "Doe", "jdoe@gmail.com", 8888888888, NULL);

-- Add Message Data --
INSERT INTO Message (content, category, created_at, username, recipient)
VALUES ("Test123", "Security Violation", NOW(), "ACarnline", "JDoe"); 

-- Drop Database if needed --
drop database db;
