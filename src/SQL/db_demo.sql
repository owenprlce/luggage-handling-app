USE db;

-- Successful Login --
SELECT * FROM Staff_Login WHERE username = "ACarnline" AND user_password = "Password123";

-- Unsuccessful Login --
SELECT * FROM Staff_Login WHERE username = "ACarnline" AND user_password = "IncorrectPassword";

-- Add a Flight --
INSERT INTO Flight (flight_id, destination, gate_number, terminal, flight_status, airline_code)
VALUES ("AA2000", "Houston", "12", "D", "Not Departed", "AA");
SELECT * FROM Flight;

-- Retrive Flight Details using Flight ID --
SELECT * FROM Flight WHERE flight_id = "AA2000";

-- View all Passengers on a FLight --
SELECT * FROM Passenger WHERE flight_id = "AA1000";

-- Add a New Passenger --
INSERT INTO Passenger (ticket_number, firstname, lastname, identification, passenger_status, flight_id, airline_code)
VALUES ("4444444444", "Steve", "Smith", "456789", "Not-checked-in", "AA2000", "AA");
Select * FROM Passenger;

-- View all Passengers --
Select * FROM Passenger;

-- Removing a Passenger by Ticket Number --
DELETE FROM Passenger WHERE ticket_number = "4444444444";
Select * FROM Passenger;

-- Removing a Passenger by Identification --
DELETE FROM Passenger WHERE identification = "345678";
Select * FROM Passenger;

-- Retrieving Passenger Information with Ticket Number --
SELECT * FROM Passenger WHERE ticket_number = "1111111111";

-- Add a Bag --
INSERT INTO Bag (bag_id, location, ticket_number, flight_id, airline_code)
VALUES ("739273", "Check-in counter", "1111111111", "AA1000", "AA");
SELECT * FROM Bag;

-- Retrieving a Bag using Bag ID --
SELECT * FROM Bag WHERE bag_id = "739273";

-- Removing a Bag using Bag ID --
DELETE FROM Bag WHERE bag_id = "739273";
SELECT * FROM Bag;

-- Change Location of a Bag using Bag ID --
UPDATE Bag SET location = "Security check" WHERE bag_id = "569823";
SELECT * FROM Bag;

-- Change Status of a Passenger using Ticket Number --
UPDATE Passenger SET passenger_status = "Checked-in" WHERE ticket_number = "1111111111";
SELECT * FROM Passenger;

-- View Gate Information --
SELECT * FROM Flight where terminal = "A" AND gate_number = "23";

-- View all Bags at a Gate using Gate Number --
SELECT * FROM Bag WHERE flight_id IN (SELECT flight_id FROM Flight WHERE terminal = "A" AND gate_number = "23" );

-- View all Bags using Flight ID --
SELECT * FROM Bag WHERE flight_id = "AA1000";