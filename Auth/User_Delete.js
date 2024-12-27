import express from 'express';
import bodyParser from 'body-parser';
import connection from '../Connection.js';

const delete_userRoute = express.Router();
delete_userRoute.use(bodyParser.json());

delete_userRoute.delete('/delete_user/:id', (req, res) => {
    const id = req.params.id;

    // SQL DELETE query
    const query = 'DELETE  FROM User WHERE Id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ message: 'Error deleting user' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
    });
});

export { delete_userRoute };
