import express from 'express';
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/status', (_req, res) => {
	res.send({
		status: 'OK',
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
