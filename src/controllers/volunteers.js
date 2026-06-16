import {
  addVolunteer,
  removeVolunteer,
  getVolunteerProjectsByUserId
} from '../models/volunteers.js';

export async function processAddVolunteer(req, res, next) {
  try {
    const userId = req.session.user.user_id;
    const projectId = req.params.projectId;

    await addVolunteer(userId, projectId);

    req.flash('success', 'You are now volunteering for this project.');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
}

export async function processRemoveVolunteer(req, res, next) {
  try {
    const userId = req.session.user.user_id;
    const projectId = req.params.projectId;

    await removeVolunteer(userId, projectId);

    req.flash('success', 'You have been removed from this project.');
    res.redirect(req.get('Referrer') || '/dashboard');
  } catch (error) {
    next(error);
  }
}

export async function showDashboard(req, res, next) {
  try {
    const userId = req.session.user.user_id;

    const volunteerProjects =
      await getVolunteerProjectsByUserId(userId);

    res.render('dashboard', {
      title: 'Dashboard',
      volunteerProjects
    });
  } catch (error) {
    next(error);
  }
}