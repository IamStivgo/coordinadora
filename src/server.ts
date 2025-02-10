import express from 'express';
import cors from 'cors';
import config from './config';
import router from './adapters/routes';

const PORT = config.PORT;
const CLIENT_URL = config.CLIENT_URL;

const app = express();

app.use(express.json());
app.use(cors({ origin: CLIENT_URL }));
app.use(router);


app.get('/status', (_req, res) => {
	res.send({
		status: 'OK',
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
