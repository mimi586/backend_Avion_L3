import express from 'express';
import bodyParser from 'body-parser';
import connection from '../../Connection.js';
import dayjs from 'dayjs';


const flightRoute = express.Router();

flightRoute.use(bodyParser.urlencoded({ extended: true }));
flightRoute.use(bodyParser.json());

flightRoute.post('/add_fli', (req, res) => {

    const { Id_fli, Departure_airport, Arrival_airport, Departure_time, Status, Total_seats, Price } = req.body;

    if (!Id_fli || !Departure_airport || !Arrival_airport || !Departure_time || !Status || !Total_seats || !Price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const formattedDepartureTime = dayjs(Departure_time).format('YYYY-MM-DD HH:mm:ss');




    const query= 'INSERT INTO Flight (Id_fli, Departure_airport, Arrival_airport, Departure_time, Status, Total_seats, Price) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [Id_fli, Departure_airport, Arrival_airport, formattedDepartureTime, Status, Total_seats, Price], (err, result) => {
        if (err) {
            console.error('Error while inserting flight:', err);
            return res.status(500).json({ message: 'Error while creating flight' });
        }
        return res.status(201).json({ message: 'Flight created successfully', flightId: result.insertId });
    });
});

export { flightRoute };
