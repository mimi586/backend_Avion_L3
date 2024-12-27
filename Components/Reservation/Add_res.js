import express from 'express';
import bodyParser from 'body-parser';
import connection from '../../Connection.js';
import nodemailer from 'nodemailer';

const reservationRoute = express.Router();

reservationRoute.use(bodyParser.urlencoded({ extended: true }));
reservationRoute.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'felixsarobidy@gmail.com',
        pass: 'bwwpwlgbpnletiwo'
    }
});

reservationRoute.post('/add_res', (req, res) => {
    const { Id_res, DepartureTime, PriceOnce, NumberOfSeats, TotalPrice } = req.body;

    if (!Id_res || !DepartureTime || !PriceOnce || !NumberOfSeats || !TotalPrice) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const checkSeatsQuery = 'SELECT Total_seats FROM Flight WHERE Id_fli = ?';
    const insertReservationQuery = 'INSERT INTO Reservation (Airport, DepartureTime, PriceOnce, NumberOfSeats, TotalPrice) VALUES (?, ?, ?, ?, ?)';
    const updateSeatsQuery = 'UPDATE Flight SET Total_seats = Total_seats - ? WHERE Id_fli = ?';
    const updateStatusQuery = 'UPDATE Flight SET Status = ? WHERE Id_fli = ?';

    // Récupération des aéroports de départ et d'arrivée à partir de la table Flight
    connection.query('SELECT Departure_airport, Arrival_airport FROM Flight WHERE Id_fli = ?', [Id_res], (err, flightResults) => {
        if (err) {
            console.error('Error fetching flight details:', err);
            return connection.rollback(() => {
                res.status(500).json({ message: 'Error while creating reservation' });
            });
        }

        if (flightResults.length === 0) {
            return connection.rollback(() => {
                res.status(404).json({ message: 'Flight not found' });
            });
        }

        const departureAirport = flightResults[0].Departure_airport;
        const arrivalAirport = flightResults[0].Arrival_airport;

        connection.beginTransaction((err) => {
            if (err) {
                console.error('Error starting transaction:', err);
                return res.status(500).json({ message: 'Error while creating reservation' });
            }

            connection.query(checkSeatsQuery, [Id_res], (err, results) => {
                if (err) {
                    console.error('Error while checking available seats:', err);
                    return connection.rollback(() => {
                        res.status(500).json({ message: 'Error while creating reservation' });
                    });
                }

                if (results.length === 0) {
                    return connection.rollback(() => {
                        res.status(404).json({ message: 'Flight not found' });
                    });
                }

                const availableSeats = results[0].Total_seats;

                if (NumberOfSeats > availableSeats) {
                    return connection.rollback(() => {
                        res.status(400).json({ message: 'Not enough seats available' });
                    });
                }

                // Utilisation des aéroports de départ et d'arrivée dans la requête d'insertion
                connection.query(insertReservationQuery, [`${departureAirport} to ${arrivalAirport}`, DepartureTime, PriceOnce, NumberOfSeats, TotalPrice], (err, result) => {
                    if (err) {
                        console.error('Error while inserting reservation:', err);
                        return connection.rollback(() => {
                            res.status(500).json({ message: 'Error while creating reservation' });
                        });
                    }

                    connection.query(updateSeatsQuery, [NumberOfSeats, Id_res], (err, result) => {
                        if (err) {
                            console.error('Error while updating seats:', err);
                            return connection.rollback(() => {
                                res.status(500).json({ message: 'Error while updating seats' });
                            });
                        }

                        // Vérifiez si le nombre total de sièges est désormais égal à 0 et mettez à jour le statut du vol en conséquence
                        if (availableSeats - NumberOfSeats === 0) {
                            connection.query(updateStatusQuery, ["Unavailable", Id_res], (err, result) => {
                                if (err) {
                                    console.error('Error while updating flight status:', err);
                                    return connection.rollback(() => {
                                        res.status(500).json({ message: 'Error while updating flight status' });
                                    });
                                }
                            });
                        }

                        connection.commit((err) => {
                            if (err) {
                                console.error('Error committing transaction:', err);
                                return connection.rollback(() => {
                                    res.status(500).json({ message: 'Error while creating reservation' });
                                });
                            }

                            return res.status(201).json({ message: 'Reservation created successfully' });
                        });
                        const mailOptions = {
                            from: 'mihajaremi@gmail.com', //expediteur
                            to: 'heritianajulien45@gmail.com', //destinateur
                            subject: 'info',
                            text: 'de mflight'
                        };
                        
                        transporter.sendMail(mailOptions, (error, info)=>{
                            if (error) {
                                console.error('erreur :', error);
                            }
                            else{
                                console.log('E-mail envoyer:', info.rsponse);
                            }
                        });
                    });
                });
            });
        });
    });
});

export { reservationRoute };

