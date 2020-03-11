# Add a new User
INSERT INTO Users (id, username, pw, email, reg_date)
VALUES (2, 'Skye', '123456', 'Skye@gmail.com', now());

# list all books for the current user 'Eve'
SELECT Books.* 
FROM Users, Books, Users_2_Books
WHERE Users.username = 'EVE'
AND Users.id = Users_2_Books.user_id
AND Books.id = Users_2_Books.book_id
ORDER BY Books.name ASC
LIMIT 10;

# Add a new Book 'Algorithm'
INSERT INTO Books (id, category, number, name, add_date)
VALUES (5, 'CS', 341, 'Algorithm', now());
INSERT INTO Users_2_Books (id, user_id, book_id, add_date)
VALUES (5, 1, 5, now());

# Display the new book list
SELECT Books.*
FROM Users, Books, Users_2_Books
WHERE Users.username = 'Eve'
AND Users.id = Users_2_Books.user_id
AND Books.id = Users_2_Books.book_id
ORDER BY Books.name ASC
LIMIT 10;

# List all the chapters under Book 'Principle of Marketing'
SELECT Chapters.*, Books.name AS book_name
FROM Books, Chapters, Books_2_Chapters
WHERE Books.name = 'Principle of Marketing'
AND Books.id = Books_2_Chapters.book_id
AND Chapters.id = Books_2_Chapters.chapter_id
ORDER BY Chapters.name ASC
LIMIT 10;

# List all the questions under 'Chapter1'
SELECT Questions.*, Chapters.name AS chapter_name
FROM Chapters, Questions, Chapters_2_Questions 
WHERE Chapters.name = 'Chapter1'
AND Chapters.id = Chapters_2_Questions.chapter_id
AND Questions.id = Chapters_2_Questions.question_id
ORDER BY Questions.context ASC
LIMIT 10;

# List all questions and solutions under 'Chapter1'
SELECT Questions.context AS question, Options.context AS solution
FROM Questions, Options, Questions_2_Solutions
WHERE Questions.id = Questions_2_Solutions.question_id
AND Options.id = Questions_2_Solutions.solution_id
LIMIT 10;
