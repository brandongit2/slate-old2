ALTER TABLE subjects ADD COLUMN display_name text AFTER name;
ALTER TABLE subjects ADD COLUMN `order` int AFTER id;

ALTER TABLE courses MODIFY `order` int;
ALTER TABLE courses MODIFY name varchar(64) UNIQUE NOT NULL;
ALTER TABLE courses DROP INDEX name_2;
ALTER TABLE courses ADD COLUMN display_name text AFTER name;

ALTER TABLE units MODIFY `order` int;
ALTER TABLE units MODIFY name varchar(64) UNIQUE NOT NULL;
ALTER TABLE units DROP INDEX name_2;
ALTER TABLE units ADD COLUMN display_name text AFTER name;

ALTER TABLE articles MODIFY `order` int;
ALTER TABLE articles MODIFY title varchar(128) UNIQUE NOT NULL;
ALTER TABLE articles ADD COLUMN display_title text AFTER title;
ALTER TABLE articles MODIFY publish_date timestamp NOT NULL DEFAULT NOW();
