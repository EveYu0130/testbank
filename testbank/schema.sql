CREATE TABLE IF NOT EXISTS Users (id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE,
username VARCHAR(30) NOT NULL UNIQUE,
pw VARCHAR(30) NOT NULL,
email VARCHAR(50) UNIQUE,
reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS Books (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE,
category VARCHAR(30) NOT NULL,
number int(10) NOT NULL,
name VARCHAR(50),
add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
UNIQUE KEY (category, number, name));

CREATE TABLE IF NOT EXISTS Chapters (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE,
name VARCHAR(50),
add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS Questions (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE,
context VARCHAR(3000) NOT NULL,
add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS Options (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE,
context VARCHAR(3000) NOT NULL,
add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS Users_2_Books (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE,
user_id INT(10) UNSIGNED NOT NULL,
book_id INT(10) UNSIGNED NOT NULL,
add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
UNIQUE KEY (user_id, book_id),
FOREIGN KEY (book_id) REFERENCES Books(id),
FOREIGN KEY (user_id) REFERENCES Users(id));

CREATE TABLE IF NOT EXISTS Books_2_Chapters (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE,
book_id INT(10) UNSIGNED NOT NULL,
chapter_id INT(10) UNSIGNED NOT NULL,
add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
UNIQUE KEY (book_id, chapter_id),
FOREIGN KEY (book_id) REFERENCES Books(id),
FOREIGN KEY (chapter_id) REFERENCES Chapters(id));

CREATE TABLE IF NOT EXISTS Chapters_2_Questions (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE,
chapter_id INT(10) UNSIGNED NOT NULL,
question_id INT(10) UNSIGNED NOT NULL,
add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
UNIQUE KEY (chapter_id, question_id),
FOREIGN KEY (question_id) REFERENCES Questions(id),
FOREIGN KEY (chapter_id) REFERENCES Chapters(id));

CREATE TABLE IF NOT EXISTS Questions_2_Options (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE,
question_id INT(10) UNSIGNED NOT NULL,
option_id INT(10) UNSIGNED NOT NULL,
add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
UNIQUE KEY (question_id, option_id),
FOREIGN KEY (question_id) REFERENCES Questions(id),
FOREIGN KEY (option_id) REFERENCES Options(id));

CREATE TABLE IF NOT EXISTS Questions_2_Solutions (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE,
question_id INT(10) UNSIGNED NOT NULL,
solution_id INT(10) UNSIGNED NOT NULL,
add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
UNIQUE KEY (question_id, solution_id),
FOREIGN KEY (question_id) REFERENCES Questions(id),
FOREIGN KEY (solution_id) REFERENCES Options(id));

CREATE TABLE IF NOT EXISTS Chapters_2_Errors (
id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE,
chapter_id INT(10) UNSIGNED NOT NULL,
error_id INT(10) UNSIGNED NOT NULL,
add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
UNIQUE KEY (chapter_id, error_id),
FOREIGN KEY (error_id) REFERENCES Questions(id),
FOREIGN KEY (chapter_id) REFERENCES Chapters(id));

