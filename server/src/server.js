import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express server!' });
});

// Serve static files from Vite build in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(join(__dirname, '../../client/dist')));
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});