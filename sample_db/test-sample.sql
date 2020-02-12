# Add a new User
INSERT INTO Users (id, username, pw, email, reg_date)
VALUES (4, 'David', '123456', 'david@gmail.com', now());

# list all books for the current user 'Alice'
SELECT Books.* 
FROM Users, Books, Users_2_Books
WHERE Users.username = 'Alice'
AND Users.id = Users_2_Books.user_id
AND Books.id = Users_2_Books.book_id
ORDER BY Books.name ASC;

# Add a new Book 'Algorithm'
INSERT INTO Books (id, category, number, name, add_date)
VALUES (3, 'CS', 341, 'Algorithm', now());
INSERT INTO Users_2_Books (id, user_id, book_id, add_date)
VALUES (103, 1, 3, now());

# Display the new book list
SELECT Books.*
FROM Users, Books, Users_2_Books
WHERE Users.username = 'Alice'
AND Users.id = Users_2_Books.user_id
AND Books.id = Users_2_Books.book_id
ORDER BY Books.name ASC;

# Select Book 'Database', list all the chapters
SELECT Chapters.*, Books.name AS book_name
FROM Books, Chapters, Books_2_Chapters
WHERE Books.name = 'Database'
AND Books.id = Books_2_Chapters.book_id
AND Chapters.id = Books_2_Chapters.chapter_id
ORDER BY Chapters.name ASC;

# Select 'Chapter1', list all the questions in this chapter
SELECT Questions.*, Chapters.name AS chapter_name
FROM Chapters, Questions, Chapters_2_Questions 
WHERE Chapters.name = 'Chapter1'
AND Chapters.id = Chapters_2_Questions.chapter_id
AND Questions.id = Chapters_2_Questions.question_id
ORDER BY Questions.context ASC;

# Select Question '1+1=?', display the solution
SELECT Questions.context AS question, Solutions.context AS solution
FROM Questions, Solutions, Questions_2_Solutions
WHERE Questions.context = '1+1=?'
AND Questions.id = Questions_2_Solutions.question_id
AND Solutions.id = Questions_2_Solutions.solution_id;

# Update Question Solution
UPDATE Solutions, Questions, Questions_2_Solutions
SET Solutions.context = '2'
WHERE Questions.context = '1+1=?'
AND Questions.id = Questions_2_Solutions.question_id
AND Solutions.id = Questions_2_Solutions.solution_id;

# Display the updated solution
SELECT Questions.context AS questions, Solutions.context AS solution
FROM Questions, Solutions, Questions_2_Solutions
WHERE Questions.context = '1+1=?'
AND Questions.id = Questions_2_Solutions.question_id
AND Solutions.id = Questions_2_Solutions.solution_id;
