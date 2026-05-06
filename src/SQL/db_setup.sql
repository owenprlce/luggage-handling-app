-- Database Setup --

CREATE DATABASE IF NOT EXISTS db;
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
    board_type VARCHAR(255) NOT NULL,
    sender_username VARCHAR(255) NOT NULL,
    sender_role VARCHAR(255) NOT NULL,
    airline_code VARCHAR(255),
    FOREIGN KEY (sender_username) REFERENCES Staff(username),
    FOREIGN KEY (airline_code) REFERENCES Airline(airline_code)
);

-- Add Account Data --

    -- Original --
-- INSERT INTO Staff_Login (username, user_password, user_role)
-- VALUES ("ACarnline", "$2b$12$r81uiDfySpitbOE1ZgkrBeCX9w7LkEZO0nZ8CV1V2AP7sa8BdK5mW", "Airline Staff");
-- INSERT INTO Staff_Login (username, user_password, user_role)
-- VALUES ("PMahomes", "$2b$12$.nIhjtNE0Km5AYqyV7.g0uCxTLaIA5UlHIake9fJbdYDVVt95Y9e6", "Gate Staff");
-- INSERT INTO Staff_Login (username, user_password, user_role)
-- VALUES ("JDoe", "$2b$12$TJwREb9UeuvlsciJgGjhLuxIwQ3K2SkcXfnSiZRFzBtE8e77vv22S", "Ground Staff");
-- INSERT INTO Staff_Login (username, user_password, user_role)
-- VALUES ("Admin", "$2b$12$bpTn0bunDZzS22LQGRnfHOx7kjCWG1q6BoPN7A0V22FxXK2JJ9MNe", "Admin");

    -- New --

INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('Admin', '$2a$12$.5ojRa4QxOYwtBIsxrWcNO1DLOO0SmeDzV3n3EoR99MFivSD56FBO', 'Admin');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('SMadhavan', '$2a$12$KS.wsKBAaqshLvWaLpQMfeHsf26b7ONaBbyVEmZtwDO0MlxO7rXrG', 'Airline Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('ARichardson', '$2a$12$IxUKnP6e6OBzCOmQ7/Wt.OsDM.4AXZgOLM5dtQddZZ.SurauLGysu', 'Airline Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('MHamsworth', '$2a$12$V8Mz349sFOfnu2hsEqM6iuZ86LpoMlPzx8/ico6L8nTuL/RVjkwv.', 'Airline Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('TCruise', '$2a$12$HE81K5G7aikanqFMbDv8mODSxDNXqP6u6EybySnug2YQuuBUkmexe', 'Airline Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('ABurgs', '$2a$12$wK769oFSKeXCJzv93Q02u./9VJ5lXLmERGOCQ5p6cFdWOhFTHS2hy', 'Airline Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('AFrank', '$2a$12$e1ctqIK5cJRBbYlErtrDYeacZaxJGUMk2Y6zr3i/dBMOEu2KSMntu', 'Airline Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('HJohnson', '$2a$12$JmYO/21euGqICZCo.KZbEuEvYGryZxo6z7GZ6HEE/LX8fwfkyU..e', 'Airline Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('CJameson', '$2a$12$y/cIyIYxWWQnganDaxIXjuZBXkoJ9AE70Rn40dJ61DvNEGfv93aKS', 'Airline Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('JPrescott', '$2a$12$m3oYYGxRrpigksT/nRFVoejXBGslIgOueTy.W3ZkN8S7XgtFTHhP2', 'Airline Staff');

INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('LMylopolus', '$2a$12$2tnHxLTRXsHj8wia0jDFKud0L/adWYS3btbKamWaXOJm2yfjUsuhC', 'Gate Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('SLouise', '$2a$12$8oMdjfeCLKyqO6c1pjyz7uyggq7kWnoL1rpTNrHyXHBkn5HxIHBfW', 'Gate Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('EReckon', '$2a$12$1ZT.GIGJf.JqELxNDwFhRuYmbBRafxh/RSMPF6Lo/X5S/SoczzveC', 'Gate Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('RGuelph', '$2a$12$1SgQmDIbYQT9ShMFYE40ku7zjsKT6JeVnGIYys1X0CcFWYTN32ubq', 'Gate Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('JKlein', '$2a$12$3BNx.UA5fufivSZOyWGEAe1qIWU6taEWHmb9NXsuQPTbOyjYsitZe', 'Gate Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('RMilner', '$2a$12$mSns45qps23Th5kPdVnjmONd2hZmghzm0UgYE4GPYg06Ofx4Mm1ky', 'Gate Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('SRangers', '$2a$12$iBnbF2jvEGjPoZUL/m4FaO915jt5eyD1JPqJBuPl6aoiOshCuPpIy', 'Gate Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('SAshford', '$2a$12$H7FtcVqzLgsL4pdP53YlWO8enwhk/H3rzBQ.vjuEbWmqh5o.3/99i', 'Gate Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('DWhitaker', '$2a$12$V4q64bQt2ojqJ6bhhINztOIkTokAXbWbipPWYlQruOtfnGkjmjEaq', 'Gate Staff');

INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('GRamos', '$2a$12$RMn4Tqz1NSG6ZUBGve5vjuZKVUo8WteFVCvE54QP52qOXV8YiQ0ni', 'Ground Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('RLanguire', '$2a$12$Gn2q2Nu36JVAs3MhYcK7h.GiSqb5lPHsYCK2jEFVMmgI/yM.Pcx9q', 'Ground Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('JWeiner', '$2a$12$ZPLzNIY4OtcQfen9pasGCepuQYUMmw2hSoXb26/PhoPKxSR1LOjdG', 'Ground Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('KDillon', '$2a$12$85floaSTmZS9VKQu/dkbFOtictBaPW9V7fjNsDNeZyDiPZD5AwA6W', 'Ground Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('RWhite', '$2a$12$KugSjU4PE1AlxmtbHuIYdO6lE/iU.E0YgER9KwzOyCxk.a/0gHoni', 'Ground Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('ASingh', '$2a$12$LN8Rb4jYLLONgYFPc9AKjug.doCPBAVWmPVEjG1DDwtQgkkYj752a', 'Ground Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('TCooper', '$2a$12$r6a6K/d2yEV4B.HxzxWmQ.sCJJRZDHaz2lq0njYFPZYlQ08sHpOL6', 'Ground Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('MSurshki', '$2a$12$cguglATnmYEIC9pJsXZCnOaUB0kc7MxX1Afj64GrzcrBVw8sDMsje', 'Ground Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('CWauker', '$2a$12$KFBpKHSihPrMBoAxThxVme8mmqkDwnn04TKw4ddrVOaUnCgX2Rd76', 'Ground Staff');
INSERT IGNORE INTO Staff_Login (username, user_password, user_role) VALUES ('YZhang', '$2a$12$JZbcu7sjKgrqFFwbUM1EkOBV5eB7hIeR3FaNbn2CWDyBRK/TJ1nU2', 'Ground Staff');


-- Add Airline Data --

    -- Original --
-- INSERT INTO Airline (airline_code, airline_name)
-- VALUES ("AA", "American Airlines");
-- INSERT INTO Airline (airline_code, airline_name)
-- VALUES ("DL", "Delta Airlines");
-- INSERT INTO Airline (airline_code, airline_name)
-- VALUES ("UA", "United Airlines");

    -- New --
INSERT IGNORE INTO Airline (airline_code, airline_name) VALUES ('AA', 'American Airlines');
INSERT IGNORE INTO Airline (airline_code, airline_name) VALUES ('DL', 'Delta Airlines');
INSERT IGNORE INTO Airline (airline_code, airline_name) VALUES ('UA', 'United Airlines');
INSERT IGNORE INTO Airline (airline_code, airline_name) VALUES ('FA', 'Frontier Airlines');
INSERT IGNORE INTO Airline (airline_code, airline_name) VALUES ('SW', 'Southwest Airlines');

-- Add Flight Data --

    -- Original
-- INSERT INTO Flight (flight_id, destination, gate_number,  terminal, flight_status, airline_code)
-- VALUES ("AA1000", "Dallas", "23", "A", "Not Departed", "AA");
-- INSERT INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code)
-- VALUES ("DL1000", "Orlando", "10", "B", "Not Departed", "DL");
-- INSERT INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code)
-- VALUES ("UA1000", "Chicago", "17", "C", "Not Departed", "UA");

    -- New --

INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('AA1360', 'New York', 'C24', 'C', 'Not Departed', 'AA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('AA3317', 'Los Angeles', 'A38', 'A', 'Not Departed', 'AA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('AA3290', 'Miami', 'A23', 'A', 'Not Departed', 'AA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('AA1476', 'Orlando', 'D01', 'D', 'Not Departed', 'AA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('AA1523', 'Denver', 'C19', 'C', 'Not Departed', 'AA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('AA1656', 'Chicago', 'A19', 'A', 'Not Departed', 'AA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('AA2385', 'Minneapolis', 'A20', 'A', 'Not Departed', 'AA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('AA1175', 'San Francisco', 'C22', 'C', 'Not Departed', 'AA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('DL2972', 'Minneapolis', 'E13', 'E', 'Not Departed', 'DL');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('DL0839', 'Atlanta', 'E14', 'E', 'Not Departed', 'DL');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('DL2746', 'Detroit', 'E17', 'E', 'Not Departed', 'DL');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('DL2798', 'Sal Lake City', 'E12', 'E', 'Not Departed', 'DL');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('DL0873', 'New York', 'E11', 'E', 'Not Departed', 'DL');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('UA1586', 'Washington D.C.', 'E08', 'E', 'Not Departed', 'UA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('UA1634', 'Chicago', 'E06', 'E', 'Not Departed', 'UA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('UA2049', 'Denver', 'E09', 'E', 'Not Departed', 'UA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('UA2454', 'Newark', 'E05', 'E', 'Not Departed', 'UA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('FA1270', 'Atlanta', 'E02', 'E', 'Not Departed', 'FA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('FA3330', 'Raleigh', 'E04', 'E', 'Not Departed', 'FA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('FA2147', 'Denver', 'E10', 'E', 'Not Departed', 'FA');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('SW2209', 'Phoenix', 'F18', 'F', 'Not Departed', 'SW');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('SW4326', 'Orlando', 'F12', 'F', 'Not Departed', 'SW');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('SW1511', 'Denver', 'F09', 'F', 'Not Departed', 'SW');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('SW1485', 'Nashville', 'F11', 'F', 'Not Departed', 'SW');
INSERT IGNORE INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code) VALUES ('SW1823', 'Los Angeles', 'F02', 'F', 'Not Departed', 'SW');


-- Add Passenger Data --

    -- Original --  
-- INSERT INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code)
-- VALUES ("1111111111", "Joe", "Montana", "123456", "Not-checked-in", "AA1000", "AA");
-- INSERT INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code)
-- VALUES ("2222222222", "Steve", "Johnson", "234567", "Not-checked-in", "DL1000", "DL");
-- INSERT INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code)
-- VALUES ("3333333333", "Jane", "Doe", "345678", "Not-checked-in", "UA1000", "UA");

    -- New --

INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025104332', 'Aram', 'Shankar', '654231', 'Checked-in', 'AA1360', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025181960', 'Malini', 'Shankar', '653955', 'Checked-in', 'AA1360', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025013389', 'Elaina', 'Peters', '674990', 'Not-checked-in', 'AA3317', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025083863', 'Martha', 'Washington', '359579', 'Checked-in', 'AA3290', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025794026', 'Raven', 'Clinch', '892740', 'Checked-in', 'AA3290', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025542351', 'Brian', 'Anderson', '477001', 'Boarded', 'AA1476', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025161559', 'Lucy', 'Anderson', '477725', 'Boarded', 'AA1476', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025407816', 'Samantha', 'Anderson', '477911', 'Boarded', 'AA1476', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025184959', 'Raj', 'Sinha', '725649', 'Boarded', 'AA1523', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025310341', 'Ramon', 'Swaggar', '528483', 'Not-checked-in', 'AA1656', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025316475', 'Chris', 'Swaggar', '520192', 'Not-checked-in', 'AA1656', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025255341', 'Akbar', 'Mohammad', '782094', 'Checked-in', 'AA2385', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025928327', 'Ayesha', 'Mohammad', '783331', 'Checked-in', 'AA2385', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025648350', 'William', 'Dean', '628846', 'Checked-in', 'AA1175', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025305641', 'Sean', 'Oxford', '856473', 'Boarded', 'AA1175', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025395376', 'Wen', 'Hu', '134967', 'Not-checked-in', 'AA1656', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025724238', 'Lisa', 'Hu', '134812', 'Not-checked-in', 'AA1656', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025849696', 'Chao', 'Hu', '134905', 'Not-checked-in', 'AA1656', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025532871', 'Reeta', 'Meyer', '367592', 'Not-checked-in', 'AA2385', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025012269', 'Fu', 'Wang', '289476', 'Checked-in', 'AA1476', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025166978', 'Cliff', 'Hans', '178944', 'Not-checked-in', 'AA3317', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025480184', 'Graham', 'Walter', '907467', 'Boarded', 'AA1523', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025514627', 'Lisa', 'Walter', '905173', 'Boarded', 'AA1523', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025048281', 'Corey', 'Hill', '666231', 'Checked-in', 'AA1360', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025489325', 'Shawn', 'Murray', '816733', 'Checked-in', 'AA1656', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025288095', 'Alex', 'Stoopper', '198583', 'Not-checked-in', 'AA3317', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025701543', 'Ryan', 'Garfield', '499282', 'Checked-in', 'AA3290', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025039117', 'Melissa', 'Garfield', '499153', 'Checked-in', 'AA3290', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025182278', 'Elisa', 'Garfield', '499006', 'Checked-in', 'AA3290', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025248963', 'Vicky', 'Garfield', '499377', 'Checked-in', 'AA3290', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025834657', 'Marcus', 'Shane', '725784', 'Checked-in', 'AA1175', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025871331', 'Amanda', 'Richard', '672668', 'Checked-in', 'AA2385', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025509839', 'Charles', 'Deckon', '726493', 'Not-checked-in', 'AA3290', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025301031', 'Francis', 'Cox', '825644', 'Boarded', 'AA1476', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025051834', 'Ruthford', 'Cox', '825490', 'Boarded', 'AA1476', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025738299', 'Mary', 'Cox', '825178', 'Boarded', 'AA1476', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025737631', 'Sarah', 'Mullard', '907943', 'Not-checked-in', 'AA1656', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025165667', 'Ma', 'Liang', '200194', 'Boarded', 'AA1175', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025010651', 'Lou', 'Liang', '204788', 'Boarded', 'AA1175', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025333872', 'Grace', 'Liang', '208897', 'Boarded', 'AA1175', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025624731', 'Anna', 'Swanson', '438845', 'Boarded', 'AA1523', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025781080', 'Mike', 'Ruth', '717273', 'Checked-in', 'AA1360', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025132677', 'Miley', 'Ruth', '712906', 'Checked-in', 'AA1360', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025360260', 'Akalya', 'Promod', '301486', 'Not-checked-in', 'AA3317', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025647468', 'Arya', 'Promod', '301857', 'Not-checked-in', 'AA3317', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025723430', 'Laksh', 'Promod', '301735', 'Not-checked-in', 'AA3317', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025980500', 'Shasha', 'Brunswick', '629453', 'Checked-in', 'AA1476', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025978820', 'Delores', 'Bensen', '103785', 'Checked-in', 'AA1476', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025812191', 'Shirley', 'Albert', '826648', 'Not-checked-in', 'AA3317', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025361939', 'Vikram', 'Albert', '826506', 'Not-checked-in', 'AA3317', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025909169', 'Ravi', 'Albert', '826005', 'Not-checked-in', 'AA3317', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025985435', 'Riku', 'Suzuki', '737493', 'Not-checked-in', 'AA1360', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025346247', 'Daniel', 'Wong', '656562', 'Checked-in', 'AA1175', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025510799', 'Chris', 'Wong', '650767', 'Checked-in', 'AA1175', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025118384', 'Isabella', 'Leonardo', '429991', 'Checked-in', 'AA2385', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025251354', 'Arjun', 'Mahajan', '295909', 'Checked-in', 'AA2385', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025278498', 'Lei', 'Huang', '639953', 'Boarded', 'AA1175', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025084124', 'Rajan', 'Kishore', '916744', 'Checked-in', 'AA1360', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025118244', 'Brian', 'Goldorf', '582664', 'Boarded', 'AA1523', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('1025935348', 'Melene', 'Thomson', '378596', 'Not-checked-in', 'AA3290', 'AA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373740164', 'Joanne', 'Adams', '667802', 'Checked-in', 'DL2972', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373005242', 'Johnny', 'Adams', '667036', 'Checked-in', 'DL2972', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373786801', 'James', 'Adams', '667132', 'Checked-in', 'DL2972', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373128059', 'James', 'Williamson', '725648', 'Not-checked-in', 'DL0839', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373826204', 'Kimberly', 'Briggs', '815848', 'Boarded', 'DL2746', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373505331', 'Rapston', 'Briggs', '815002', 'Boarded', 'DL2746', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373586923', 'Clement', 'Sanderson', '288769', 'Not-checked-in', 'DL0873', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373226025', 'Laura', 'Tangen', '936742', 'Checked-in', 'DL0873', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373634216', 'Richard', 'Tangen', '937768', 'Checked-in', 'DL0873', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373073375', 'Curie', 'Tangen', '931118', 'Checked-in', 'DL0873', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373433036', 'Alisa', 'Tangen', '930102', 'Checked-in', 'DL0873', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373541458', 'Megan', 'Thompson', '739574', 'Checked-in', 'DL2972', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373685014', 'Sue', 'Hanson', '202029', 'Boarded', 'DL2746', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373294019', 'Craig', 'Lumbord', '304586', 'Not-checked-in', 'DL0839', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373655698', 'Christopher', 'Walker', '668956', 'Not-checked-in', 'DL0873', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373169340', 'Kim', 'Dillon', '896734', 'Not-checked-in', 'DL2972', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373608835', 'Brandon', 'Richman', '190285', 'Boarded', 'DL2746', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373615951', 'Erica', 'Cobb', '724546', 'Not-checked-in', 'DL2798', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373484656', 'Rachel', 'Marcos', '494022', 'Not-checked-in', 'DL2798', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('2373482366', 'Lisbeth', 'Monroe', '423017', 'Not-checked-in', 'DL2798', 'DL');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('5784299468', 'Jacob', 'Weiner', '801774', 'Checked-in', 'UA1586', 'UA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('5784044369', 'Erica', 'Sanderson', '528473', 'Not-checked-in', 'UA1634', 'UA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('5784957773', 'Miley', 'Sanderson', '528092', 'Not-checked-in', 'UA1634', 'UA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('5784872148', 'Wayne', 'Armstrong', '825744', 'Not-checked-in', 'UA2049', 'UA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('5784951343', 'Amira', 'Sutherland', '712355', 'Not-checked-in', 'UA2454', 'UA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('5784320037', 'Dana', 'Sutherland', '712067', 'Not-checked-in', 'UA2454', 'UA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('5784917693', 'Eric', 'Sutherland', '712546', 'Not-checked-in', 'UA2454', 'UA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('5784676320', 'Andy', 'Klapper', '716767', 'Checked-in', 'UA1586', 'UA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('5784163287', 'Mark', 'Edison', '836566', 'Checked-in', 'UA2049', 'UA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('5784083172', 'Mike', 'Potulla', '555522', 'Checked-in', 'UA2049', 'UA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('6012788957', 'Samantha', 'Foley', '893775', 'Boarded', 'FA1270', 'FA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('6012986872', 'Sara', 'Olsen', '333585', 'Not-checked-in', 'FA3330', 'FA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('6012774348', 'Maria', 'Luther', '818886', 'Checked-in', 'FA3330', 'FA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('6012734714', 'Robert', 'Luther', '818752', 'Checked-in', 'FA3330', 'FA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('6012345581', 'Asim', 'Khan', '298374', 'Checked-in', 'FA2147', 'FA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('6012223623', 'Maira', 'Khan', '295876', 'Checked-in', 'FA2147', 'FA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('6012166587', 'Jackson', 'Burand', '104769', 'Boarded', 'FA1270', 'FA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('6012603669', 'Elizabeth', 'Burand', '104335', 'Boarded', 'FA1270', 'FA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('6012096705', 'Luke', 'Simmerson', '827364', 'Checked-in', 'FA1270', 'FA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('6012466889', 'Timothy', 'Cobalt', '907856', 'Checked-in', 'FA2147', 'FA');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9024785776', 'Richard', 'Bloggs', '284658', 'Not-checked-in', 'SW2209', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9029377578', 'Sun', 'Wong', '538859', 'Not-checked-in', 'SW2209', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9021102884', 'Ding', 'Wong', '538102', 'Not-checked-in', 'SW2209', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9027956745', 'Maya', 'Sterling', '725656', 'Checked-in', 'SW2209', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9028666623', 'Elias', 'Thorne', '836675', 'Checked-in', 'SW2209', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9028877593', 'Julian', 'Voss', '102775', 'Not-checked-in', 'SW4326', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9026477104', 'Hament', 'Voss', '102443', 'Not-checked-in', 'SW4326', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9020907345', 'Marcus', 'Holloway', '909012', 'Not-checked-in', 'SW1511', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9021728384', 'Elena', 'Holloway', '901544', 'Not-checked-in', 'SW1511', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9020192837', 'Simon', 'Beck', '777236', 'Not-checked-in', 'SW1511', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9021177883', 'Clara', 'Montgomery', '626368', 'Not-checked-in', 'SW1511', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9021582838', 'Avir', 'Jenkins', '535538', 'Not-checked-in', 'SW1511', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9020902647', 'Zara', 'Chen', '173564', 'Not-checked-in', 'SW1485', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9025453754', 'Farah', 'Quinn', '822845', 'Not-checked-in', 'SW1485', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9023333626', 'Leo', 'Grant', '866623', 'Not-checked-in', 'SW1485', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9021341568', 'Mia', 'Vance', '342627', 'Not-checked-in', 'SW1823', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9027675747', 'Desmond', 'Fitzgerald', '253664', 'Not-checked-in', 'SW1823', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9026655844', 'Beatrice', 'Fitzgerald', '253901', 'Not-checked-in', 'SW1823', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9026655285', 'Victoria', 'Fitzgerald', '253189', 'Not-checked-in', 'SW1823', 'SW');
INSERT IGNORE INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code) VALUES ('9021784611', 'Nathan', 'Brooks', '167746', 'Not-checked-in', 'SW1823', 'SW');


-- Add Bag Data --

    -- Original --
-- INSERT INTO Bag (bag_id, location, ticket_number, flight_id, airline_code)
-- VALUES ("569823", "Check-in counter", "1111111111", "AA1000", "AA");
-- INSERT INTO Bag (bag_id, location, ticket_number, flight_id, airline_code)
-- VALUES ("750862", "Check-in counter", "2222222222", "DL1000", "DL");
-- INSERT INTO Bag (bag_id, location, ticket_number, flight_id, airline_code)
-- VALUES ("294759", "Check-in counter", "3333333333", "UA1000", "UA");

    -- New --

INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100296', 'Check-in counter', '1025104332', 'AA1360', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100401', 'Check-in counter', '1025181960', 'AA1360', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100595', 'Security Check', '1025083863', 'AA3290', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100535', 'Security Check', '1025083863', 'AA3290', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100525', 'At-the-gate', '1025542351', 'AA1476', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100444', 'At-the-gate', '1025161559', 'AA1476', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100346', 'Security Check', '1025255341', 'AA2385', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100837', 'Security Check', '1025928327', 'AA2385', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100462', 'Loaded', '1025305641', 'AA1175', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100805', 'Loaded', '1025480184', 'AA1523', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100594', 'At-the-gate', '1025489325', 'AA1656', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100911', 'Security Check', '1025701543', 'AA3290', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100939', 'Security Check', '1025701543', 'AA3290', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100833', 'Security Check', '1025039117', 'AA3290', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100838', 'Security Check', '1025039117', 'AA3290', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100960', 'Security Check', '1025871331', 'AA2385', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100208', 'At-the-gate', '1025301031', 'AA1476', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100489', 'At-the-gate', '1025051834', 'AA1476', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100060', 'At-the-gate', '1025738299', 'AA1476', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100642', 'Loaded', '1025165667', 'AA1175', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100708', 'Loaded', '1025010651', 'AA1175', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100684', 'Loaded', '1025333872', 'AA1175', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100959', 'At-the-gate', '1025624731', 'AA1523', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100558', 'Security Check', '1025118384', 'AA2385', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100386', 'Security Check', '1025251354', 'AA2385', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100941', 'Loaded', '1025278498', 'AA1175', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('100786', 'Check-in counter', '1025084124', 'AA1360', 'AA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('200487', 'Security Check', '2373740164', 'DL2972', 'DL');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('200108', 'Security Check', '2373005242', 'DL2972', 'DL');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('200645', 'At-the-gate', '2373826204', 'DL2746', 'DL');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('200115', 'At-the-gate', '2373505331', 'DL2746', 'DL');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('200865', 'Security Check', '2373226025', 'DL0873', 'DL');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('200992', 'Security Check', '2373226025', 'DL0873', 'DL');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('200221', 'Security Check', '2373634216', 'DL0873', 'DL');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('200787', 'Security Check', '2373634216', 'DL0873', 'DL');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('500442', 'Check-in counter', '5784299468', 'UA1586', 'UA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('500729', 'Check-in counter', '5784676320', 'UA1586', 'UA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('600109', 'At-the-gate', '6012788957', 'FA1270', 'FA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('600113', 'At-the-gate', '6012774348', 'FA3330', 'FA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('600602', 'At-the-gate', '6012734714', 'FA3330', 'FA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('600836', 'At-the-gate', '6012166587', 'FA1270', 'FA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('600105', 'At-the-gate', '6012603669', 'FA1270', 'FA');
INSERT IGNORE INTO Bag (bag_id, location, ticket_number, flight_id, airline_code) VALUES ('836675', 'Security Check', '9028666623', 'SW2209', 'SW');

-- Add Staff Data --

    -- Original --
-- INSERT INTO Staff (username, firstname, lastname, email, phone, airline_code)
-- VALUES ("ACarnline", "Austin", "Carnline", "lcarnline@smu.edu", 4444444444, "AA");
-- INSERT INTO Staff (username, firstname, lastname, email, phone, airline_code)
-- VALUES ("PMahomes", "Patrick", "Mahomes", "pmahomes@gmail.com", 6666666666, "DL");
-- INSERT INTO Staff (username, firstname, lastname, email, phone, airline_code)
-- VALUES ("JDoe", "John", "Doe", "jdoe@gmail.com", 8888888888, NULL);

    -- New --

INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('SMadhavan', 'Sankar', 'Madhavan', 'staff@email.com', '972-674-3787', 'AA');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('ARichardson', 'Alice', 'Richardson', 'staff@email.com', '972-579-4785', 'AA');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('MHamsworth', 'Mike', 'Hamsworth', 'staff@email.com', '972-881-9003', 'AA');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('TCruise', 'Tom', 'Cruise', 'staff@email.com', '214-759-3675', 'DL');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('ABurgs', 'Amana', 'Burgs', 'staff@email.com', '214-893-3457', 'DL');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('AFrank', 'Adam', 'Frank', 'staff@email.com', '514-865-4783', 'UA');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('HJohnson', 'Harry', 'Johnson', 'staff@email.com', '609-378-2645', 'FA');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('CJameson', 'Cathy', 'Jameson', 'staff@email.com', '214-009-2178', 'SW');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('JPrescott', 'Julian', 'Prescott', 'staff@email.com', '972-178-2746', 'SW');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('LMylopolus', 'Liam', 'Mylopolus', 'staff@email.com', '972-023-1115', 'AA');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('SLouise', 'Scott', 'Louise', 'staff@email.com', '972-762-6363', 'AA');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('EReckon', 'Emily', 'Reckon', 'staff@email.com', '972-978-9789', 'AA');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('RGuelph', 'Rudy', 'Guelph', 'staff@email.com', '214-810-9203', 'DL');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('JKlein', 'Joe', 'Klein', 'staff@email.com', '214-933-6336', 'DL');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('RMilner', 'Robert', 'Milner', 'staff@email.com', '514-936-5786', 'UA');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('SRangers', 'Steve', 'Rangers', 'staff@email.com', '609-626-4775', 'FA');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('SAshford', 'Sabastian', 'Ashford', 'staff@email.com', '972-102-1029', 'SW');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('DWhitaker', 'Dominic', 'Whitaker', 'staff@email.com', '972-113-1872', 'SW');
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('GRamos', 'Galvin', 'Ramos', 'staff@email.com', '972-578-5964', NULL);
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('RLanguire', 'Robert', 'Languire', 'staff@email.com', '972-222-0967', NULL);
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('JWeiner', 'Jacob', 'Weiner', 'staff@email.com', '972-110-2834', NULL);
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('KDillon', 'Karson', 'Dillon', 'staff@email.com', '972-002-4783', NULL);
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('RWhite', 'Rocky', 'White', 'staff@email.com', '972-877-8749', NULL);
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('ASingh', 'Arjun', 'Singh', 'staff@email.com', '972-537-5678', NULL);
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('TCooper', 'Tom', 'Cooper', 'staff@email.com', '972-902-9090', NULL);
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('MSurshki', 'Minato', 'Surshki', 'staff@email.com', '972-577-5795', NULL);
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('CWauker', 'Claine', 'Wauker', 'staff@email.com', '972-512-5346', NULL);
INSERT IGNORE INTO Staff (username, firstname, lastname, email, phone, airline_code) VALUES ('YZhang', 'Yeng', 'Zhang', 'staff@email.com', '972-343-3435', NULL);



-- Add Message Data --
    
    -- Origina l--
-- INSERT INTO Message (content, category, created_at, board_type, sender_username, sender_role, airline_code)
-- VALUES ("Test123", "Security Violation", NOW(), "Airline", "ACarnline", "Airline Staff", "AA");

    -- New (None) --

-- Drop Database if needed --
-- WARNING: Do not run this before a demo unless you intentionally want to delete the database.
-- drop database db;
