import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage
} from './controllers/projects.js';

import { showCategoriesPage } from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';
import {
  showNewOrganizationForm,
  processNewOrganizationForm
} from './controllers/organizations.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);

router.get(
    '/organization/:id',
    showOrganizationDetailsPage
);

router.get('/projects', showProjectsPage);

router.get(
    '/project/:id',
    showProjectDetailsPage
);

router.get('/categories', showCategoriesPage);

// Test route for 500 errors
router.get('/test-error', testErrorPage);

router.get(
  '/new-organization',
  showNewOrganizationForm
);

router.post(
  '/new-organization',
  processNewOrganizationForm
);

export default router;