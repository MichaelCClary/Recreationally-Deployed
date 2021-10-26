CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) NOT NULL,
  password TEXT NOT NULL,
  email TEXT 
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATE,
  avatar_img TEXT,
  bio TEXT
);

CREATE TABLE parks (
  "parkCode" TEXT PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  description TEXT NOT NULL,
  designation TEXT,
  states TEXT,
  latitude TEXT,
  longitude TEXT,
  "directionsInfo" TEXT,
  "weatherInfo" TEXT,
  cost TEXT,
  cost_description TEXT,
  phone TEXT,
  email TEXT
);

CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE parks_activities (
  "parkCode" TEXT
    REFERENCES parks ON DELETE CASCADE,
  activity_id TEXT
    REFERENCES activities ON DELETE CASCADE,
  PRIMARY KEY ("parkCode", activity_id)
);

CREATE TABLE topics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE parks_topics (
  "parkCode" TEXT
    REFERENCES parks ON DELETE CASCADE,
  topic_id TEXT
    REFERENCES topics ON DELETE CASCADE,
  PRIMARY KEY ("parkCode", topic_id)
);

CREATE TABLE comments (
  "parkCode" TEXT
    REFERENCES parks ON DELETE CASCADE,
  user_id INTEGER
    REFERENCES users ON DELETE CASCADE,
  PRIMARY KEY ("parkCode", user_id),
  comment TEXT
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  "parkCode" TEXT NOT NULL
    REFERENCES parks ON DELETE CASCADE,
  user_id INTEGER
    REFERENCES users ON DELETE CASCADE,
  comment TEXT,
  url TEXT NOT NULL,
  title TEXT,
  altText TEXT,
  caption TEXT,
  credit TEXT
);

CREATE TABLE collections (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_id INTEGER
    REFERENCES users ON DELETE CASCADE,
  created_at DATE
);


CREATE TABLE collections_parks (
  "parkCode" TEXT
    REFERENCES parks ON DELETE CASCADE,
  collection_id INTEGER
    REFERENCES collections ON DELETE CASCADE,
  PRIMARY KEY ("parkCode", collection_id)
);