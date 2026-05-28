import 'dotenv/config';
import { Pool } from 'pg';

/**
 * Connection pool for PostgreSQL database.
 *
 * We coerce and validate the incoming `DB_URL` environment variable to ensure
 * the password (and other parts) are proper strings before passing the
 * connection string to the `pg` Pool. In production we enable basic SSL so
 * services like Render/Postgres work correctly.
 */
const rawDbUrl = process.env.DB_URL || '';
const connectionString = typeof rawDbUrl === 'string' ? rawDbUrl.trim() : '';

let sslConfig = false;
if (process.env.NODE_ENV === 'production') {
    // Many managed Postgres providers require TLS; allow self-signed certs.
    sslConfig = { rejectUnauthorized: false };
}

// Basic validation: try to parse the URL and warn if password is missing or not a string.
if (connectionString) {
    try {
        const parsed = new URL(connectionString);
        if (typeof parsed.password !== 'string' || parsed.password === '') {
            console.warn('DB_URL password is missing or empty; check your environment variables');
        }
    } catch (err) {
        console.warn('DB_URL appears to be invalid:', err.message);
    }
}

const pool = new Pool({
    connectionString: connectionString || undefined,
    ssl: sslConfig,
});

/**
 * Common SSL Issue:
 *
 * You may encounter SSL connection errors depending on your operating system, Node.js
 * version, or PostgreSQL server settings. If you have confirmed your credentials are
 * correct but still see SSL errors, try updating the 'ssl' property in the Pool
 * configuration above to:
 *
 * ssl: {
 *     rejectUnauthorized: false
 * }
 */

/**
 * Since we will modify the normal pool object in development mode, we need to create and
 * export a reference to the pool object. This allows us to use the same name for the
 * export regardless of whether we are in development or production mode.
 */
let db = null;

if (process.env.NODE_ENV === 'development' && process.env.ENABLE_SQL_LOGGING === 'true') {
    /**
     * In development mode, we wrap the pool to provide query logging.
     * This helps with debugging by showing all executed queries in the console.
     * 
     * The wrapper also adds timing information to help identify slow queries
     * and tracks the number of rows affected by each query.
     */
    db = {
        async query(text, params) {
            try {
                const start = Date.now();
                const res = await pool.query(text, params);
                const duration = Date.now() - start;
                console.log('Executed query:', { 
                    text: text.replace(/\s+/g, ' ').trim(), 
                    duration: `${duration}ms`, 
                    rows: res.rowCount 
                });
                return res;
            } catch (error) {
                console.error('Error in query:', { 
                    text: text.replace(/\s+/g, ' ').trim(), 
                    error: error.message 
                });
                throw error;
            }
        },

        async close() {
            await pool.end();
        }
    };
} else {
    // In production, export the pool directly without logging overhead
    db = pool;
}

/**
 * Tests the database connection by executing a simple query.
 */
const testConnection = async() => {
    try {
        const result = await db.query('SELECT NOW() as current_time');
        console.log('Database connection successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        // Re-throw the original Error so calling code keeps the stack trace
        throw error;
    }
};

export { db as default, testConnection };