import express from 'express';
import bodyParser from 'body-parser';
import connection from '../../Connection.js';

const affiche_clientRoute = express.Router();
affiche_clientRoute.use(bodyParser.json());

affiche_clientRoute.get('/fetch_cli', (req, res) => {
    // Fetch all clients from the database
    const query = 'SELECT * FROM User';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching clients:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Return clients data as JSON array
        res.status(200).json(results);
    });
});

export { affiche_clientRoute };
