export function requireLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'You must be logged in to do that.');
    return res.redirect('/login');
  }

  next();
}