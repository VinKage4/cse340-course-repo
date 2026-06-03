import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  showEditOrganizationForm,
  processNewOrganizationForm,
  processEditOrganizationForm,
  organizationValidation
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
} from './controllers/projects.js';

import { showCategoriesPage } from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);

router.get(
    '/organization/:id',
    showOrganizationDetailsPage
);

// Route to display edit organization form
router.get(
  '/edit-organization/:id',
  showEditOrganizationForm
);

router.get('/projects', showProjectsPage);

router.get(
    '/project/:id',
    showProjectDetailsPage
);

router.get('/new-project', showNewProjectForm);

router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

router.get('/categories', showCategoriesPage);

// Test route for 500 errors
router.get('/test-error', testErrorPage);

// Route to process edit organization form
router.get(
  '/new-organization',
  showNewOrganizationForm
);

router.post(
  '/new-organization',
  organizationValidation,
  processNewOrganizationForm
);

router.post(
  '/edit-organization/:id',
  organizationValidation,
  processEditOrganizationForm
);

export default router;