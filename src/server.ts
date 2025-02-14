import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import config from './config';
import router from './adapters/routes';
import { connectCache, connectDb } from './infrastructure/database';
import swaggerFile from '../swagger-output.json';

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(PORT, async () => {
	const isDbConnected = await connectDb();

	if (!isDbConnected) {
		console.error('Failed to connect to database');
		process.exit(0);
	}

	const isCacheConnected = await connectCache();

	if (!isCacheConnected) {
		console.error('Failed to connect to cache');
		process.exit(0);
	}

	console.log(`Server is running on port ${PORT}`);
});
