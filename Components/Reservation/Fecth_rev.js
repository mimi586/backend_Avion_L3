import express from 'express';
import bodyParser from 'body-parser';
import connection from '../../Connection.js';

const Affiche_revRoute = express.Router();
Affiche_revRoute.use(bodyParser.json());

// Route pour récupérer les réservations par mois
Affiche_revRoute.get('/fetch_rev', (req, res) => {
    const query = "SELECT SUM(TotalPrice) AS totalRevenue FROM Reservation";

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching month:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json(results);
    });
});

export { Affiche_revRoute };
