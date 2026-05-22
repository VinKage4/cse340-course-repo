import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    year: new Date().getFullYear()
  });
});

app.get('/organizations', (req, res) => {
  res.render('organizations', {
    title: 'Organizations',
    year: new Date().getFullYear()
  });
});

app.get('/projects', (req, res) => {
  res.render('projects', {
    title: 'Projects',
    year: new Date().getFullYear()
  });
});

app.get('/categories', (req, res) => {
  res.render('categories', {
    title: 'Categories',
    year: new Date().getFullYear()
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});