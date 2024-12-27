import express from 'express';
import bodyParser from 'body-parser';
import connection from '../../Connection.js';

const Affiche_fliRoute = express.Router();
Affiche_fliRoute.use(bodyParser.json());

Affiche_fliRoute.get('/fetch_fl', (req, res) => {
   
    const query1 = 'SELECT `Id_fli`,`Departure_airport`,`Arrival_airport`,`Departure_time`,`Status`,`Total_seats`,`Price` FROM Flight Where `Status`="Available" ';

    connection.query(query1, (err, results) => {
        if (err) {
            console.error('Error fetching flights:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json(results);
    });
});

export { Affiche_fliRoute };
