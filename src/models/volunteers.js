import pool from './db.js';

export async function addVolunteer(userId, projectId) {
  const sql = `
    INSERT INTO project_volunteer (user_id, project_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, project_id) DO NOTHING
    RETURNING *;
  `;

  const result = await pool.query(sql, [userId, projectId]);
  return result.rows[0];
}

export async function removeVolunteer(userId, projectId) {
  const sql = `
    DELETE FROM project_volunteer
    WHERE user_id = $1 AND project_id = $2
    RETURNING *;
  `;

  const result = await pool.query(sql, [userId, projectId]);
  return result.rows[0];
}

export async function getVolunteerProjectsByUserId(userId) {
  const sql = `
    SELECT 
      sp.project_id,
      sp.title,
      sp.description,
      sp.location,
      sp.project_date,
      o.name AS organization_name
    FROM project_volunteer pv
    JOIN service_project sp ON pv.project_id = sp.project_id
    JOIN organization o ON sp.organization_id = o.organization_id
    WHERE pv.user_id = $1
    ORDER BY sp.project_date;
  `;

  const result = await pool.query(sql, [userId]);
  return result.rows;
}

export async function isUserVolunteering(userId, projectId) {
  const sql = `
    SELECT * 
    FROM project_volunteer
    WHERE user_id = $1 AND project_id = $2;
  `;

  const result = await pool.query(sql, [userId, projectId]);
  return result.rows.length > 0;
}