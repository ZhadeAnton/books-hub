import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';

const app: Application = express();

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
