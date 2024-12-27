import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { loginRoute } from './Auth/Login.js';
import { userRoute } from './Auth/User.js';
import { affiche_clientRoute } from './Components/Client/Fetch_client.js';
import { getSelectRoute } from './Auth/Select_user.js';
import { getUserRoute } from './Auth/Get_user.js';
import { flightRoute } from './Components/Flight/Add_flight.js';
import { Update_flightRoute } from './Components/Flight/Update_flight.js';
import { delete_flightRoute } from './Components/Flight/Delete_flight.js';
import { Affiche_flightRoute } from './Components/Flight/Fetch_flight.js';
import { User_UpdateRoute } from './Auth/User_Update.js';
import { delete_userRoute } from './Auth/User_Delete.js';
import { Affiche_fliRoute } from './Components/Reservation/Fetch_fli_res.js';
import { reservationRoute } from './Components/Reservation/Add_res.js';
import { Affiche_reservationRoute } from './Components/Reservation/Fetch_res.js'
import { Affiche_lineRoute } from './Components/Reservation/Line.js';
import { Affiche_revRoute } from './Components/Reservation/Fecth_rev.js';
import { affiche_client_nbrRoute } from './Components/Client/Fetch_nbr_cli.js';
import { delete_resRoute } from './Components/Reservation/Delete_res.js';

const app = express();
const PORT = 8081;

app.use(bodyParser.json());

// Configure CORS to accept requests from all origins
app.use(cors());

// Serve static files from the 'public/images' directory
const publicImagesPath = path.join(__dirname, 'public', 'images');
app.use('/public/images', express.static(publicImagesPath));

app.use('/login', loginRoute);
app.use('/users', userRoute);
app.use('/users', getSelectRoute);

app.use('/fetch_cli', affiche_clientRoute);
app.use('/fetch_clie', affiche_client_nbrRoute);

app.use('/users', getUserRoute);

app.use('/add_fli', flightRoute);
app.use('/fetch_fli', Affiche_flightRoute);
app.use('/update_fli', Update_flightRoute);
app.use('/delete_fli', delete_flightRoute);

app.use('/update_user', User_UpdateRoute);
app.use('/delete_user', delete_userRoute);

app.use('/fetch_fl', Affiche_fliRoute);
app.use('/add_res', reservationRoute);
app.use('/fetch_res', Affiche_reservationRoute);
app.use('/fetch_month', Affiche_lineRoute);
app.use('/fetch_rev', Affiche_revRoute);
app.use('/delete_res', delete_resRoute);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
