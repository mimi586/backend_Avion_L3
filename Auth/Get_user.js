// Importer les modules nécessaires
import express from 'express';
import connection from '../Connection.js';

const getUserRoute = express.Router();

getUserRoute.get('/:userId', async (req, res) => {
    const userId = req.params.userId; 
    try {
        const query = 'SELECT * FROM User WHERE Id = ?';
        connection.query(query, [userId], (err, result) => {
            if (err) {
                console.error('Error fetching user data:', err);
                return res.status(500).json({ message: 'Error fetching user data' });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(result[0]);
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ message: 'Error fetching user data' });
    }
});

// Exporter le routeur pour une utilisation dans d'autres fichiers
export { getUserRoute };
