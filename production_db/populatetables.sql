LOAD DATA LOCAL INFILE 'data/Users.txt' INTO TABLE Users FIELDS TERMINATED BY ',';
LOAD DATA LOCAL INFILE 'data/Books.txt' INTO TABLE Books FIELDS TERMINATED BY ',';
LOAD DATA LOCAL INFILE 'data/Chapters.txt' INTO TABLE Chapters FIELDS TERMINATED BY ',';
LOAD DATA LOCAL INFILE 'data/Questions.txt' INTO TABLE Questions FIELDS TERMINATED BY ',' ENCLOSED BY '"';
LOAD DATA LOCAL INFILE 'data/Options.txt' INTO TABLE Options FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"';
LOAD DATA LOCAL INFILE 'data/Users_2_Books.txt' INTO TABLE Users_2_Books FIELDS TERMINATED BY ',';
LOAD DATA LOCAL INFILE 'data/Books_2_Chapters.txt' INTO TABLE Books_2_Chapters FIELDS TERMINATED BY ',';
LOAD DATA LOCAL INFILE 'data/Chapters_2_Questions.txt' INTO TABLE Chapters_2_Questions FIELDS TERMINATED BY ',';
LOAD DATA LOCAL INFILE 'data/Questions_2_Solutions.txt' INTO TABLE Questions_2_Solutions FIELDS TERMINATED BY ',';
LOAD DATA LOCAL INFILE 'data/Questions_2_Options.txt' INTO TABLE Questions_2_Options FIELDS TERMINATED BY ',';
