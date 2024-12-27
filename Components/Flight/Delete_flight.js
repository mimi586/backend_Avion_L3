import express from 'express';
import bodyParser from 'body-parser';
import connection from '../../Connection.js';

const delete_flightRoute = express.Router();
delete_flightRoute.use(bodyParser.json());

delete_flightRoute.delete('/delete_fli/:id', (req, res) => {
    const id = req.params.id;

    // SQL DELETE query
    const query = 'DELETE FROM Flight WHERE Id_fli = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting flight:', err);
            return res.status(500).json({ message: 'Error deleting flight' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Flight not found' });
        }
    });
});

export { delete_flightRoute };
