import express from 'express';
import bodyParser from 'body-parser';
import connection from '../../Connection.js';

const affiche_client_nbrRoute = express.Router();
affiche_client_nbrRoute.use(bodyParser.json());

affiche_client_nbrRoute.get('/fetch_clie', (req, res) => {
    // Fetch all clients from the database
    const query = 'SELECT * FROM User WHERE Role= "user"';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching clients:', err);
            return res.status(500).json( { message: 'Internal Server Error' });
        }

        // Return clients data as JSON array
        res.status(200).json(results);
    });
});

export { affiche_client_nbrRoute };
