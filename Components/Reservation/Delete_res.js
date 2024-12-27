import express from 'express';
import bodyParser from 'body-parser';
import connection from '../../Connection.js';

const delete_resRoute = express.Router();
delete_resRoute.use(bodyParser.json());

delete_resRoute.delete('/delete_res/:id', (req, res) => {
    const id = req.params.id;

    // SQL DELETE query
    const query = 'DELETE  FROM Reservation WHERE Id_res = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting res:', err);
            return res.status(500).json({ message: 'Error deleting res' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'res not found' });
        }
    });
});

export { delete_resRoute };
