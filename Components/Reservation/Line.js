import express from 'express';
import bodyParser from 'body-parser';
import connection from '../../Connection.js';

const Affiche_lineRoute = express.Router();
Affiche_lineRoute.use(bodyParser.json());

// Route pour récupérer les réservations par mois
Affiche_lineRoute.get('/fetch_month', (req, res) => {
    const query = "SELECT MONTH(STR_TO_DATE(DepartureTime, '%d-%m-%Y %H:%i:%s')) AS month, COUNT(*) AS Reservation FROM Reservation GROUP BY MONTH(STR_TO_DATE(DepartureTime, '%d-%m-%Y %H:%i:%s'))";

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching month:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json(results);
    });
});

export { Affiche_lineRoute };
