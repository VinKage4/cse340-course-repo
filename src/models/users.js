import db from './db.js';
import bcrypt from 'bcrypt';

const createUser = async (
  name,
  email,
  passwordHash
) => {
  const defaultRole = 'user';

  const query = `
    INSERT INTO users
    (
      name,
      email,
      password_hash,
      role_id
    )
    VALUES
    (
      $1,
      $2,
      $3,
      (
        SELECT role_id
        FROM roles
        WHERE role_name = $4
      )
    )
    RETURNING user_id;
  `;

  const result = await db.query(query, [
    name,
    email,
    passwordHash,
    defaultRole
  ]);

  return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
const query = `
    SELECT
        u.user_id,
        u.name,
        u.email,
        u.password_hash,
        r.role_name
    FROM users u
    JOIN roles r
        ON u.role_id = r.role_id
    WHERE u.email = $1;
`;

  const result = await db.query(query, [email]);

  return result.rows.length > 0
    ? result.rows[0]
    : null;
};

const verifyPassword = async (
  password,
  passwordHash
) => {
  return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (
  email,
  password
) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const passwordMatches =
    await verifyPassword(
      password,
      user.password_hash
    );

  if (!passwordMatches) {
    return null;
  }

  delete user.password_hash;

  return user;
};

export {
  createUser,
  authenticateUser
};