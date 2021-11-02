
DROP DATABASE recreationally;
CREATE DATABASE recreationally;
\connect recreationally

\i recreationally-schema.sql

DROP DATABASE recreationally_test;
CREATE DATABASE recreationally_test;
\connect recreationally_test

\i recreationally-schema.sql
