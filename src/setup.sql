DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS service_project;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS organization;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    logo_filename VARCHAR(255)
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'Helps improve local communities through construction, cleanup, and repair projects.', 'contact@brightfuture.org', 'brightfuture.png'),
('GreenHarvest Growers', 'Supports food access, gardening, and local agriculture service projects.', 'info@greenharvest.org', 'greenharvest.png'),
('UnityServe Volunteers', 'Connects volunteers with community, education, and service opportunities.', 'hello@unityserve.org', 'unityserve.png');
-- ========================================
-- Service Project Table
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_service_project_organization FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);
-- ========================================
-- Insert Service Project Data
-- 5 projects for each organization
-- ========================================
INSERT INTO service_project (
        organization_id,
        title,
        description,
        location,
        project_date
    )
VALUES -- BrightFuture Builders projects
    (
        1,
        'Park Cleanup',
        'Clean local parks and walking trails.',
        'Provo, UT',
        '2026-06-01'
    ),
    (
        1,
        'Tree Planting',
        'Plant new trees in community areas.',
        'Orem, UT',
        '2026-06-05'
    ),
    (
        1,
        'Neighborhood Repair Day',
        'Help repair and improve community spaces.',
        'Salt Lake City, UT',
        '2026-06-10'
    ),
    (
        1,
        'Community Garden Build',
        'Build raised garden beds for residents.',
        'Lehi, UT',
        '2026-06-15'
    ),
    (
        1,
        'Playground Improvement',
        'Paint and repair playground equipment.',
        'Spanish Fork, UT',
        '2026-06-20'
    ),
    -- GreenHarvest Growers projects
    (
        2,
        'Food Drive',
        'Collect food donations for local families.',
        'Provo, UT',
        '2026-07-01'
    ),
    (
        2,
        'Urban Farming Workshop',
        'Teach families how to grow food at home.',
        'Orem, UT',
        '2026-07-05'
    ),
    (
        2,
        'Farmers Market Support',
        'Help organize a community farmers market.',
        'Lehi, UT',
        '2026-07-10'
    ),
    (
        2,
        'School Garden Help',
        'Support garden projects at local schools.',
        'Salt Lake City, UT',
        '2026-07-15'
    ),
    (
        2,
        'Fresh Produce Delivery',
        'Deliver fresh produce to families in need.',
        'Spanish Fork, UT',
        '2026-07-20'
    ),
    -- UnityServe Volunteers projects
    (
        3,
        'Community Tutoring',
        'Tutor students in different school subjects.',
        'Provo, UT',
        '2026-08-01'
    ),
    (
        3,
        'Charity Supply Sorting',
        'Sort donated supplies for local charities.',
        'Orem, UT',
        '2026-08-05'
    ),
    (
        3,
        'Senior Center Visit',
        'Visit and help at a senior center.',
        'Lehi, UT',
        '2026-08-10'
    ),
    (
        3,
        'Volunteer Training Night',
        'Train new volunteers for service events.',
        'Salt Lake City, UT',
        '2026-08-15'
    ),
    (
        3,
        'Backpack Donation Event',
        'Prepare backpacks and supplies for students.',
        'Spanish Fork, UT',
        '2026-08-20'
    );
-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);
INSERT INTO category (name)
VALUES ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness');
-- ========================================
-- Project Category Junction Table
-- ========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project_category_project FOREIGN KEY (project_id) REFERENCES service_project(project_id),
    CONSTRAINT fk_project_category_category FOREIGN KEY (category_id) REFERENCES category(category_id)
);
-- Associate each project with at least one category
INSERT INTO project_category (project_id, category_id)
VALUES (1, 1),
    (2, 1),
    (3, 3),
    (4, 1),
    (5, 3),
    (6, 3),
    (7, 2),
    (8, 3),
    (9, 2),
    (10, 4),
    (11, 2),
    (12, 3),
    (13, 4),
    (14, 3),
    (15, 2);

    -- ========================================
-- Roles Table
-- ========================================

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (
    role_name,
    role_description
)
VALUES
(
    'user',
    'Standard user with basic access'
),
(
    'admin',
    'Administrator with full system access'
);

-- ========================================
-- Users Table
-- ========================================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Project Volunteer Junction Table 
-- ========================================

CREATE TABLE IF NOT EXISTS project_volunteer (
  volunteer_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES service_project(project_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, project_id)
);