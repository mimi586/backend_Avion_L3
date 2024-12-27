import express from 'express';
import bodyParser from 'body-parser';
import connection from '../../Connection.js';

const Affiche_reservationRoute = express.Router();
Affiche_reservationRoute.use(bodyParser.json());


Affiche_reservationRoute.get('/fetch_res', (req, res) => {
    const query = 'SELECT * FROM Reservation';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching reservations:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json(results);
    });
});

export { Affiche_reservationRoute };
