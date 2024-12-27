import express from 'express';
import bodyParser from 'body-parser';
import connection from '../../Connection.js';

const Update_flightRoute = express.Router();
Update_flightRoute.use(bodyParser.json());

Update_flightRoute.put('/update_fli/:id', (req, res) => {
    const { Departure_airport, Arrival_airport, Departure_time, Status, Total_seats, Price } = req.body;
    const id = req.params.id;


    const updateQuery = 'UPDATE Flight SET Departure_airport = ?, Arrival_airport = ?, Departure_time = ?, Status = ?, Total_seats = ?, Price = ? WHERE Id_fli = ?';
    const checkSeatsQuery = 'SELECT Total_seats FROM Flight WHERE Id_fli = ?';
    const updateStatusQuery = 'UPDATE Flight SET Status = ? WHERE Id_fli = ?';

    connection.query(updateQuery, [Departure_airport, Arrival_airport, Departure_time, Status, Total_seats, Price, id], (err, result) => {
        if (err) {
            console.error('Error updating flight:', err);
            return res.status(500).json({ message: 'Error updating flight' });
        }

        connection.query(checkSeatsQuery, [id], (err, results) => {
            if (err) {
                console.error('Error checking seats after update:', err);
                return res.status(500).json({ message: 'Error checking seats after update' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Flight not found' });
            }

            const updatedSeats = results[0].Total_seats;

            if (updatedSeats !== 0) {
                // Mettre à jour le statut en 'Available' si le nombre de sièges est différent de zéro
                connection.query(updateStatusQuery, ["Available", id], (err, result) => {
                    if (err) {
                        console.error('Error updating flight status:', err);
                        return res.status(500).json({ message: 'Error updating flight status' });
                    }
                });
            }

            return res.status(200).json({ message: 'Flight updated successfully' });
        });
    });
});

export { Update_flightRoute };
