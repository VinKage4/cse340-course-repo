import { getAllOrganizations, getOrganizationDetails} from '../models/organizations.js';
import { body, validationResult } from 'express-validator';
import { createOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const organizationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Organization name is required')
    .isLength({ min: 3, max: 150 })
    .withMessage(
      'Organization name must be between 3 and 150 characters'
    ),

  body('description')
    .trim()
    .notEmpty()
    .withMessage(
      'Organization description is required'
    )
    .isLength({ max: 500 })
    .withMessage(
      'Organization description cannot exceed 500 characters'
    ),

  body('contactEmail')
    .normalizeEmail()
    .notEmpty()
    .withMessage(
      'Contact email is required'
    )
    .isEmail()
    .withMessage(
      'Please provide a valid email address'
    )
];

const showOrganizationsPage = async (req, res) => {
    const organizations =
        await getAllOrganizations();

    const title =
        'Our Partner Organizations';

    res.render('organizations', {
        title,
        organizations,
        year: new Date().getFullYear()
    });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId =
        req.params.id;

    const organizationDetails =
        await getOrganizationDetails(organizationId);

    const projects =
        await getProjectsByOrganizationId(organizationId);

    res.render('organization', {
        title: 'Organization Details',
        organizationDetails,
        projects,
        year: new Date().getFullYear()
    });
};

const showNewOrganizationForm = async (req, res) => {
  const title = 'Add New Organization';

  res.render('new-organization', {
    title
  });
};

const processNewOrganizationForm = async (req, res) => {
  const { name, description, contactEmail } = req.body;

  const logoFilename = 'placeholder-logo.png';

  const organizationId = await createOrganization(
    name,
    description,
    contactEmail,
    logoFilename
  );

const processNewOrganizationForm = async (
  req,
  res
) => {

  const results = validationResult(req);

  if (!results.isEmpty()) {

    results.array().forEach(error => {
      req.flash('error', error.msg);
    });

    return res.redirect(
      '/new-organization'
    );
  }

  const {
    name,
    description,
    contactEmail
  } = req.body;

  const logoFilename =
    'placeholder-logo.png';

  const organizationId =
    await createOrganization(
      name,
      description,
      contactEmail,
      logoFilename
    );

  req.flash(
    'success',
    'Organization added successfully!'
  );

  res.redirect(
    `/organization/${organizationId}`
  );
};
    
  res.redirect(`/organization/${organizationId}`);
};

export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation
};