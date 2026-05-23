import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllProjects }
  from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';
import { testConnection }
  from './src/models/db.js';

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

app.get('/categories', async (req, res) => {
    const categories = await getAllCategories();

    const title = 'Service Project Categories';

    res.render('categories', {
        title,
        categories,
        year: new Date().getFullYear()
    });
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});