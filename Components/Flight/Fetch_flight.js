import express from 'express';
import bodyParser from 'body-parser';
import connection from '../../Connection.js';

const Affiche_flightRoute = express.Router();
Affiche_flightRoute.use(bodyParser.json());


Affiche_flightRoute.get('/fetch_fli', (req, res) => {
    const query = 'SELECT * FROM Flight';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching flights:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json(results);
    });
});

export { Affiche_flightRoute };
