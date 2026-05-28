import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllProjects }
  from './src/models/projects.js';
import { getAllCategories }
  from './src/models/categories.js';
import { testConnection }
  from './src/models/db.js';
import { getAllOrganizations }
  from './src/models/organizations.js';


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

app.get('/organizations', async (req, res) => {

    const organizations =
        await getAllOrganizations();

    const title =
        'Our Partner Organizations';

    res.render('organizations', {
        title,
        organizations,
        year: new Date().getFullYear()
    });
});

app.get('/projects', async (req, res) => {
  try {
    const projects = await getAllProjects();

    res.render('projects', {
      title: 'Projects',
      projects,
      year: new Date().getFullYear()
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).send('Server error');
  }
});

app.get('/categories', async (req, res) => {
    const categories = await getAllCategories();

    res.render('categories', {
        title: 'Service Project Categories',
        categories,
        year: new Date().getFullYear()
    });
});

app.listen(PORT, async () => {
  console.log(`Server is starting at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  const dbUrl = process.env.DB_URL || '';
  const isPlaceholder = !dbUrl || /(?:\.{3}|<|>)/.test(dbUrl);

  if (isPlaceholder) {
    console.warn('DB_URL is not set or looks like a placeholder; skipping database connection test.');
    return;
  }

  try {
    await testConnection();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});