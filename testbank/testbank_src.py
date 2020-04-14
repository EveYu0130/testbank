import csv
import os
import logging
import urllib.request

from io import TextIOWrapper
from random import shuffle
from pathlib import Path
from flask_cors import CORS
from flask_caching import Cache
from flask_mysqldb import MySQL
from flask import Flask, request, render_template, url_for, redirect, flash, Response, json
from werkzeug.utils import secure_filename


class TestBank:    

    def __init__(self, app):
        # Define variables for usage within TestBank objects.
        self.ALLOWED_EXTENSIONS = {'csv'}
        self.UPLOAD_FOLDER = app.config['UPLOAD_FOLDER']

        self.cur_user_id = None
        self.cur_book_id = 0
        self.cur_chapter_id = 0
        self.cur_qid_list_tmp = 0
        self.cur_qid_list = []
        self.cur_qid = None
        self.table = []

        self.app = app
        self.mysql = MySQL(self.app)

    def success(self):
        return render_template('login.html')

    def fail(self):
        return render_template('index.html', data='Please try again')

    def create_account(self):
        return render_template('create_account.html', data='')

    def create_account_fail(self, err='Required field missing'):
        return render_template('create_account.html', data=err)

    def creating_account(self):
        print('Creating account')
        usrname = request.form.get("username")
        pwd = request.form.get("password")
        email = request.form.get("email")
        if '' in [usrname, pwd, email]:
            print('Creating account failed.')
            return redirect(url_for('create_account_fail'))

        db = self.mysql.connection
        cursor = db.cursor()
        sql_insert = """insert into Users (username, pw, email) values (%s,%s,%s)"""
        try:
            cursor.execute(sql_insert, (usrname, pwd, email))
            db.commit()
        except db.IntegrityError:
            logging.warn("failed to insert values %s, %s", "%s", usrname, pwd, email)
            return self.create_account_fail(err='username and email should be unique')
        else:
            return self.welcome(data='Created acoount successfully. Please login now.')
        finally:
            cursor.close()

    def welcome(self, data=''):
        if not Path(self.UPLOAD_FOLDER).is_dir(): os.mkdir(self.UPLOAD_FOLDER)
        db = self.mysql.connection
        cursor = db.cursor()
        cursor.execute('CREATE TABLE IF NOT EXISTS '
                            'Users ( '
                            'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                            'username VARCHAR(30) NOT NULL UNIQUE, '
                            'pw VARCHAR(30) NOT NULL, '
                            'email VARCHAR(50) UNIQUE, '
                            'reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);')
        cursor.execute('CREATE TABLE IF NOT EXISTS '
                            'Books ( '
                            'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                            'category VARCHAR(30) NOT NULL, '
                            'number int(10) NOT NULL, '
                            'name VARCHAR(50), '
                            'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, '
                    'UNIQUE KEY (category, number, name));')
        cursor.execute('CREATE TABLE IF NOT EXISTS '
                            'Chapters ( '
                            'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                            'name VARCHAR(50), '
                            'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);')
        cursor.execute('CREATE TABLE IF NOT EXISTS '
                            'Questions ( '
                            'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                            'context VARCHAR(3000) NOT NULL, '
                            'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);')
        cursor.execute('CREATE TABLE IF NOT EXISTS '
                            'Options ( '
                            'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                            'context VARCHAR(3000) NOT NULL, '
                            'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);')

        cursor.execute('CREATE TABLE IF NOT EXISTS '
                            'Users_2_Books ( '
                            'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                            'user_id INT(10) UNSIGNED NOT NULL, '
                            'book_id INT(10) UNSIGNED NOT NULL, '
                            'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, '
                            'UNIQUE KEY (user_id, book_id), '
                            'FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE CASCADE, '
                            'FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE);')
        cursor.execute('CREATE TABLE IF NOT EXISTS '
                            'Books_2_Chapters ( '
                            'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                            'book_id INT(10) UNSIGNED NOT NULL, '
                            'chapter_id INT(10) UNSIGNED NOT NULL, '
                            'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, '
                            'UNIQUE KEY (book_id, chapter_id), '
                            'FOREIGN KEY (book_id) REFERENCES Books(id) ON DELETE CASCADE, '
                            'FOREIGN KEY (chapter_id) REFERENCES Chapters(id) ON DELETE CASCADE);')
        cursor.execute('CREATE TABLE IF NOT EXISTS '
                            'Chapters_2_Questions ( '
                            'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                            'chapter_id INT(10) UNSIGNED NOT NULL, '
                            'question_id INT(10) UNSIGNED NOT NULL, '
                            'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, '
                            'UNIQUE KEY (chapter_id, question_id), '
                            'FOREIGN KEY (question_id) REFERENCES Questions(id) ON DELETE CASCADE, '
                            'FOREIGN KEY (chapter_id) REFERENCES Chapters(id) ON DELETE CASCADE);')
        cursor.execute('CREATE TABLE IF NOT EXISTS '
                            'Questions_2_Options ( '
                            'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                            'question_id INT(10) UNSIGNED NOT NULL, '
                            'option_id INT(10) UNSIGNED NOT NULL, '
                            'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, '
                            'UNIQUE KEY (question_id, option_id), '
                            'FOREIGN KEY (question_id) REFERENCES Questions(id) ON DELETE CASCADE, '
                            'FOREIGN KEY (option_id) REFERENCES Options(id) ON DELETE CASCADE);')
        cursor.execute('CREATE TABLE IF NOT EXISTS '
                            'Questions_2_Solutions ( '
                            'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                            'question_id INT(10) UNSIGNED NOT NULL, '
                            'solution_id INT(10) UNSIGNED NOT NULL, '
                            'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, '
                            'UNIQUE KEY (question_id, solution_id), '
                            'FOREIGN KEY (question_id) REFERENCES Questions(id) ON DELETE CASCADE, '
                            'FOREIGN KEY (solution_id) REFERENCES Options(id) ON DELETE CASCADE);')
        cursor.execute('CREATE TABLE IF NOT EXISTS '
                            'Chapters_2_Errors ( '
                            'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                            'chapter_id INT(10) UNSIGNED NOT NULL, '
                            'error_id INT(10) UNSIGNED NOT NULL, '
                            'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, '
                            'UNIQUE KEY (chapter_id, error_id), '
                            'FOREIGN KEY (error_id) REFERENCES Questions(id) ON DELETE CASCADE, '
                            'FOREIGN KEY (chapter_id) REFERENCES Chapters(id) ON DELETE CASCADE);')

        cursor.close()
        return render_template('index.html', data=data)

    def hello_world(self):
        usrname = request.form.get("username")
        pwd = request.form.get("password")
        if usrname is None or pwd is None:
            response = Response(status=301)

        db = self.mysql.connection
        cursor = db.cursor()
        request_str = "SELECT id FROM Users where username=\'" + usrname + '\' and pw=\'' + pwd + '\''
        cursor.execute(request_str)
        print('cursor.rowcount:', cursor.rowcount)
        if cursor.rowcount != 1: return Response(status=301)

        self.cur_user_id = cursor.fetchall()[0]
        print(self.cur_user_id)
        return Response(status=200)

    def list_books(self, data=''):
        db = self.mysql.connection
        cursor = db.cursor()
        sql_select = """SELECT book_id FROM Users_2_Books where user_id=%s"""
        cursor.execute(sql_select, (self.cur_user_id))
        save = cursor.fetchall()
        cursor.close()

        book_table = []
        for s in save:
            s = s[0]
            db = self.mysql.connection
            cursor = db.cursor()
            sql_select = "SELECT * FROM Books where id=" + str(s) + ';'
            cursor.execute(sql_select)
            book_info = cursor.fetchall()[0]
            id, category, number, name = book_info
            cursor.close()
            book_dict = {'category': category, 'number': number, 'name': name, 'id': id}
            book_table.append(book_dict)
        
        response = self.app.response_class(
            response=json.dumps(book_table),
            status=200,
            mimetype='application/json'
        )
        return response

    def add_book(self, data=''):
        return render_template('add_book.html', data=data)

    def add_chapter(self, data=''):
        return render_template('add_chapter.html', data=data)

    def add_question(self, data=''):
        return render_template('add_question.html', data=data)

    def upload_form(self):
        return render_template('upload.html')

    def upload_file(self):
        if request.method != 'POST': return
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            print('No file part')
            return redirect(request.url)

        file = request.files['file']
        if file.filename == '':
            print('No file selected for uploading')
            flash('No file selected for uploading')
            return redirect(request.url)

        if file and allowed_file(file.filename):
            print(file.filename)
            filename = file.filename
            tmp_path = os.path.join(self.app.config['UPLOAD_FOLDER'], filename)
            file.save(tmp_path)
            print(self.cur_chapter_id)

            with open(tmp_path) as csvfile:
                readCSV = csv.reader(csvfile, delimiter=',')
                for row in readCSV:
                    self.add_a_question(question=row[0], a=row[2], b=row[3], c=row[4], d=row[5], solution=row[1])
                    print(row)

            print('File successfully uploaded')
            flash('File successfully uploaded')
            return redirect('/upload_file')
        else:
            print('Allowed file types are txt, pdf, png, jpg, jpeg, gif')
            flash('Allowed file types are txt, pdf, png, jpg, jpeg, gif')
            return redirect(request.url)

    def adding_chapter(self):
        name = request.form.get("name")
        db = self.mysql.connection
        cursor = db.cursor()

        try:
            cursor.execute("""insert into Chapters (name) values (%s)""", (name,))
            db.commit()
        except db.IntegrityError:
            logging.warn("failed to insert values %s", name)

        cursor.execute("SELECT id FROM Chapters ORDER BY id DESC LIMIT 1")

        chapter_id = cursor.fetchall()[0][0]
        sql_insert = """insert into Books_2_Chapters (book_id, chapter_id) values (%s,%s)"""
        try:
            cursor.execute(sql_insert, (self.cur_book_id, chapter_id))
            db.commit()
        except db.IntegrityError:
            logging.warn("failed to insert values %s, %s", self.cur_book_id, chapter_id)

        return self.list_chapters(data='Successfully Adding a Book!')

    def insert_Questions(self, question):
        db = self.mysql.connection
        cursor = db.cursor()
        try:
            cursor.execute("""insert into Questions (context) values (%s)""", (question,))
            db.commit()
        except db.IntegrityError:
            logging.warn("failed to insert values %s", question)
        cursor.execute("SELECT id FROM Questions ORDER BY id DESC LIMIT 1")
        question_id = cur.fetchall()[0][0]
        print(question_id)
        cursor.close()
        return question_id

    def insert_Options(self, option):
        db = self.mysql.connection
        cursor = db.cursor()
        try:
            cursor.execute("""insert into Options (context) values (%s)""", (option,))
            db.commit()
        except db.IntegrityError:
            logging.warn("failed to insert values %s", option)
        cursor.execute("SELECT id FROM Options ORDER BY id DESC LIMIT 1")
        option_id = cursor.fetchall()[0][0]
        print(option_id)
        cursor.close()
        return option_id

    def insert_solution(self, solution):
        return self.insert_Options(solution)

    def insert_Questions_2_Options(self, question_id, option_id):
        db = self.mysql.connection
        cursor = db.cursor()
        sql_insert = """insert into Questions_2_Options (question_id, option_id) values (%s,%s)"""
        try:
            cursor.execute(sql_insert, (question_id, option_id))
            db.commit()
        except db.IntegrityError:
            logging.warn("failed to insert values %s, %s", question_id, option_id)
        cursor.close()

    def insert_Questions_2_Solutions(self, question_id, solution_id):
        db = self.mysql.connection
        cursor = db.cursor()
        sql_insert = """insert into Questions_2_Solutions (question_id, solution_id) values (%s,%s)"""
        try:
            cursor.execute(sql_insert, (question_id, solution_id))
            db.commit()
        except db.IntegrityError:
            logging.warn("failed to insert values %s, %s", question_id, solution_id)
        cursor.close()

    def insert_Chapters_2_Questions(self, question_id):
        cursor = db.cursor()
        sql_insert = """insert into Chapters_2_Questions (chapter_id, question_id) values (%s,%s)"""
        try:
            cursor.execute(sql_insert, (self.cur_chapter_id, question_id))
            db.commit()
        except db.IntegrityError:
            logging.warn("failed to insert values %s, %s", self.cur_chapter_id, question_id)
        cursor.close()

    def add_a_question(question, a, b, c, d, solution):
        question_id = self.insert_Questions(question)
        self.insert_Chapters_2_Questions(question_id)

        for option in [a, b, c, d]:
            option_id = self.insert_Options(option)
            self.insert_Questions_2_Options(question_id, option_id)

        solution_id = self.insert_solution(solution)
        self.insert_Questions_2_Solutions(question_id, solution_id)
        
        response = Response(status=200)
        return response

    def adding_question(self):
        question = request.form.get("question")
        a = request.form.get("a")
        b = request.form.get("b")
        c = request.form.get("c")
        d = request.form.get("d")
        solution = request.form.get("solution")

        self.add_a_question(question, a, b, c, d, solution)

        return self.list_all_questions(data='Successfully Adding a Question!')

    def list_chapters(self, data=''):
        chapter_table = []
        self.cur_book_id = int(request.args.get('book_id', self.cur_book_id))
        print("received book id is " + str(request.args.get('book_id', self.cur_book_id)))
        db = self.mysql.connection
        cursor = db.cursor()
        sql_select = "SELECT chapter_id FROM Books_2_Chapters where book_id=" + str(self.cur_book_id) + ';'
        cursor.execute(sql_select)
        save = cursor.fetchall()
        cursor.close()
        for s in save:
            s = s[0]
            print("fetched chapter id is " + str(s))
            db = self.mysql.connection
            cursor = db.cursor()
            cursor.execute("SELECT * FROM Chapters where id=" + str(s) + ';')
            chapter_info = cur.fetchall()[0]
            id, name = chapter_info
            cursor.close()
            chapter_table.append({'name': name, 'id': id})
        cursor.close()
        print(chapter_table)
        response = self.app.response_class(
            response=json.dumps(chapter_table),
            status=200,
            mimetype='application/json'
        )
        return response

    def list_questions(self, data=''):
        self.cur_chapter_id = int(request.args.get('chapter_id', self.cur_chapter_id))
        print("received book id is " + str(request.args.get('chapter_id', self.cur_chapter_id)))
        db = self.mysql.connection
        cursor = db.cursor()
        cursor.execute("SELECT question_id FROM Chapters_2_Questions where chapter_id=" + str(self.cur_chapter_id) + ';')
        save = [x[0] for x in list(cur.fetchall())]
        shuffle(save)
        cursor.close()
        self.cur_qid_list = self.cur_qid_list_tmp = save
        response = self.app.response_class(
            response=json.dumps(self.cur_qid_list),
            status=200,
            mimetype='application/json'
        )
        return response

    def list_all_questions(self, data='', methods=['GET', 'POST']):
        self.cur_chapter_id = int(request.args.get('chapter_id', self.cur_chapter_id))
        print("received book id is " + str(request.args.get('chapter_id', self.cur_chapter_id)))
        db = self.mysql.connection
        cursor = db.cursor()
        cursor.execute("SELECT question_id FROM Chapters_2_Questions where chapter_id=" + str(self.cur_chapter_id) + ';')
        qids = [x[0] for x in list(cur.fetchall())]
        table = []
        for qid in qids:
            cursor.execute("SELECT context FROM Questions where id=" + str(qid) + ';')
            question = cursor.fetchall()[0][0]

            cursor.execute("SELECT solution_id FROM Questions_2_Solutions where question_id=" + str(qid) + ';')
            sid = cursor.fetchall()[0][0]
            cursor.execute("SELECT context FROM Options where id=" + str(sid) + ';')
            solution = cursor.fetchall()[0][0]
            table.append({'qid': qid, 'question': question, 'solution': solution})
        shuffle(qids)
        self.cur_qid_list = self.cur_qid_list_tmp = qids
        cursor.close()
        response = self.app.response_class(
            response=json.dumps(table),
            status=200,
            mimetype='application/json'
        )
        return response

    def list_all_questions_after_delete(data='', methods=['GET', 'POST']):
        db = self.mysql.connection
        cursor = db.cursor()
        self.cur_chapter_id = int(request.args.get('chapter_id', self.cur_chapter_id))
        print("received book id is " + str(request.args.get('chapter_id', self.cur_chapter_id)))
        qid = int(request.args.get('question_id', None))

        sql_delete = """delete from Chapters_2_Questions where (chapter_id, question_id) = (%s,%s)"""
        try:
            cursor.execute(sql_delete, (self.cur_chapter_id, qid))
            db.commit()
        except db.IntegrityError:
            response = Response(status=400)
            logging.warn("failed to delete values %s, %s", self.cur_chapter_id, qid)

        sql_delete = """delete from Chapters_2_Errors where (chapter_id, error_id) = (%s,%s)"""
        try:
            cursor.execute(sql_delete, (self.cur_chapter_id, qid))
            db.commit()
        except db.IntegrityError:
            response = Response(status=400)
            logging.warn("failed to delete values %s, %s", self.cur_chapter_id, qid)
        response = Response(status=200)
        cursor.close()
        return response

    def modify_question(self, methods=['GET', 'POST']):
        table = []
        qid = int(request.args.get('question_id', 0))
        db = self.mysql.connection
        cursor = db.cursor()

        cursor.execute("SELECT context FROM Questions where id=" + str(qid) + ';')
        question = cursor.fetchall()[0][0]
        print(question)
        table.append(question)

        cursor.execute("SELECT solution_id FROM Questions_2_Solutions where question_id=" + str(qid) + ';')
        sid = cursor.fetchall()[0][0]
        cursor.execute("SELECT context FROM Options where id=" + str(sid) + ';')
        solution = cursor.fetchall()[0][0]
        table.append(solution)

        cursor.execute("SELECT option_id FROM Questions_2_Options where question_id=" + str(qid) + ';')
        oid_list = cursor.fetchall()
        cursor.close()
        oid_list = [x[0] for x in list(oid_list)]
        for oid in oid_list:
            cursor = db.cursor()
            cursor.execute("SELECT context FROM Options where id=" + str(oid) + ';')
            option = cursor.fetchall()
            cursor.close()
            print(option[0][0])
            table.append(option[0][0])
        print(table)
        response = self.app.response_class(
            response=json.dumps(table),
            status=200,
            mimetype='application/json'
        )
        return response

    def list_all_questions_after_modify(self, data='modify successfully', methods=['GET', 'POST']):
        qid = int(request.args.get('qid', 0))
        sid = int(request.args.get('sid', 0))
        bid = int(request.args.get('b', 0))
        cid = int(request.args.get('c', 0))
        did = int(request.args.get('d', 0))
        eid = int(request.args.get('e', 0))
        oids = [bid, cid, did, eid]
        question = request.form.get("question")
        print(question)
        a = request.form.get("a")  # solution
        b = request.form.get("b")
        c = request.form.get("c")
        d = request.form.get("d")
        e = request.form.get("e")
        new_opts = [b, c, d, e]
        db = self.mysql.connection
        cursor = db.cursor()
        sql_update = """update questions set context = %s where id = %s"""
        cursor.execute(sql_update, (question, qid))
        db.commit()
        sql_update = """update options set context = %s where id = %s"""
        cursor.execute(sql_update, (a, sid))
        db.commit()
        for i in range(4):
            oid = oids[i]
            new_opt = new_opts[i]
            cursor.execute(sql_update, (new_opt, oid))
            db.commit()
        cursor.close()
        return redirect(url_for('list_all_questions', data='successfully modified a question'))

    def list_errors(self, data=''):
        self.cur_chapter_id = int(request.args.get('chapter_id', self.cur_chapter_id))
        print("received book id is " + str(request.args.get('chapter_id', self.cur_chapter_id)))
        db = self.mysql.connection
        cursor = db.cursor()
        cursor.execute("SELECT error_id FROM Chapters_2_Errors where chapter_id=" + str(self.cur_chapter_id) + ';')
        qids = [x[0] for x in list(cursor.fetchall())]
        table = []
        for qid in qids:
            cursor.execute("SELECT context FROM Questions where id=" + str(qid) + ';')
            question = cur.fetchall()[0][0]
            cursor.execute("SELECT solution_id FROM Questions_2_Solutions where question_id=" + str(qid) + ';')
            sid = cursor.fetchall()[0][0]
            cursor.execute("SELECT context FROM Options where id=" + str(sid) + ';')
            solution = cur.fetchall()[0][0]
            table.append({'qid': qid, 'question': question, 'solution': solution})
        shuffle(qids)
        cur_qid_list = cur_qid_list_tmp = qids
        cursor.close()
        response = self.app.response_class(
            response=json.dumps(table),
            status=200,
            mimetype='application/json'
        )
        return response

    def at_question(self):
        print(len(cur_qid_list_tmp))
        if len(cur_qid_list_tmp) == 0:
            return self.list_chapters(data='This chapter is empty.')
        restart = int(request.args.get('restart', 0))
        if restart == 1:
            self.cur_qid_list = self.cur_qid_list_tmp
        if len(self.cur_qid_list) == 0:
            return self.list_chapters(data='Finished a quiz. Select another chapter')
        cur_qid, cur_qid_list = cur_qid_list

        db = self.mysql.connection
        cursor = db.cursor()
        cursor.execute("SELECT context FROM Questions where id=" + str(cur_qid) + ';')
        save = cursor.fetchall()
        cursor.close()
        print(save)
        q_context = save[0][0]
        self.table.append(q_context)

        cursor = db.cursor()
        cursor.execute("SELECT option_id FROM Questions_2_Options where question_id=" + str(cur_qid) + ';')
        save = cursor.fetchall()
        cursor.close()
        print(save)
        save = [x[0] for x in list(save)]
        oid_list = save
        shuffle(oid_list)

        for oid in oid_list:
            db = self.mysql.connection
            cur = db.cursor()
            cur.execute("SELECT context FROM Options where id=" + str(oid) + ';')
            save = cur.fetchall()
            cur.close()
            print(save[0][0])
            self.table.append(save[0][0])

        db = self.mysql.connection
        cur = db.cursor()
        cur.execute("SELECT solution_id FROM Questions_2_Solutions where question_id=" + str(cur_qid) + ';')
        save = cur.fetchall()
        cur.close()
        print(save[0][0])
        sid = save[0][0]

        db = self.mysql.connection
        cur = db.cursor()
        cur.execute("SELECT context FROM Options where id=" + str(sid) + ';')
        save = cur.fetchall()
        cur.close()
        print(save[0][0])
        self.table.append(save[0][0])
        response = self.app.response_class(
            response=json.dumps(self.table),
            status=200,
            mimetype='application/json'
        )
        return response

    def answered_question(self):
        value = request.form.getlist('check')
        if len(value) > 1:
            return render_template('start_quiz.html', table=self.table, data='Only one possible solution')
        if value[0] != self.table[-1]:
            db = self.mysql.connection
            cur = db.cursor()
            sql_insert = """insert into Chapters_2_Errors (chapter_id, error_id) values (%s,%s)"""
            try:
                cur.execute(sql_insert, (self.cur_chapter_id, self.cur_qid))
                db.commit()
            except db.IntegrityError:
                logging.warn("failed to insert values %s, %s", cur_chapter_id, cur_qid)
            cur.close()
        else:
            db = self.mysql.connection
            cur = db.cursor()
            sql_delete = """delete from Chapters_2_Errors where (chapter_id, error_id) = (%s,%s)"""
            try:
                cur.execute(sql_delete, (self.cur_chapter_id, self.cur_qid))
                db.commit()
            except db.IntegrityError:
                logging.warn("failed to delete values %s, %s", self.cur_chapter_id, self.cur_qid)
            cur.close()
        return

    def list_all_questions2(self, data='', methods=['GET', 'POST']):
        self.cur_chapter_id = int(request.args.get('chapter_id', self.cur_chapter_id))
        print("received book id is " + str(request.args.get('chapter_id', self.cur_chapter_id)))
        db = self.mysql.connection
        cur = db.cursor()
        cur.execute("SELECT question_id FROM Chapters_2_Questions where chapter_id=" + str(cur_chapter_id) + ';')
        qids = cur.fetchall()
        qids = [x[0] for x in list(qids)]
        table = []
        for qid in qids:
            cur.execute("SELECT context FROM Questions where id=" + str(qid) + ';')
            question = cur.fetchall()[0][0]

            cur.execute("SELECT option_id FROM Questions_2_Options where question_id=" + str(qid) + ';')
            save = cur.fetchall()
            oid_list = [x[0] for x in list(save)]
            shuffle(oid_list)

            options = []
            for oid in oid_list:
                cur.execute("SELECT context FROM Options where id=" + str(oid) + ';')
                option = cur.fetchall()
                options.append(option[0][0])

            cur.execute("SELECT solution_id FROM Questions_2_Solutions where question_id=" + str(qid) + ';')
            sid = cur.fetchall()[0][0]
            cur.execute("SELECT context FROM Options where id=" + str(sid) + ';')
            solution = cur.fetchall()[0][0]
            table.append({'qid': qid, 'question': question, 'options': options, 'solution': solution})
        shuffle(qids)
        cur_qid_list = cur_qid_list_tmp = qids
        cur.close()
        response = self.app.response_class(
            response=json.dumps(table),
            status=200,
            mimetype='application/json'
        )
        return response

    def question(self):
        qid = int(request.args.get('qid', 0))
        db = self.mysql.connection
        cur = db.cursor()
        table = []
        cur.execute("SELECT context FROM Questions where id=" + str(qid) + ';')
        save = cur.fetchall()
        q_context = save[0][0]
        table.append({"id": qid, "context": q_context})

        cur.execute("SELECT option_id FROM Questions_2_Options where question_id=" + str(qid) + ';')
        save = cur.fetchall()
        save = [x[0] for x in list(save)]
        oid_list = save
        shuffle(oid_list)

        for oid in oid_list:
            cur.execute("SELECT context FROM Options where id=" + str(oid) + ';')
            save = cur.fetchall()
            table.append({"id": oid, "context": save[0][0]})

        cur.execute("SELECT solution_id FROM Questions_2_Solutions where question_id=" + str(qid) + ';')
        save = cur.fetchall()
        sid = save[0][0]

        cur.execute("SELECT context FROM Options where id=" + str(sid) + ';')
        save = cur.fetchall()
        table.append({"id": sid, "context": save[0][0]})
        cur.close()
        response = self.app.response_class(
            response=json.dumps(table),
            status=200,
            mimetype='application/json'
        )
        return response

    def modify(self, data='modify successfully', methods=['GET', 'POST']):
        qid = int(request.args.get('qid', 0))
        aid = int(request.args.get('aid', 0))
        bid = int(request.args.get('bid', 0))
        cid = int(request.args.get('cid', 0))
        did = int(request.args.get('did', 0))
        sid = int(request.args.get('sid', 0))
        oids = [aid, bid, cid, did]
        print(oids)
        question = request.form.get("question")
        a = request.form.get("a")
        b = request.form.get("b")
        c = request.form.get("c")
        d = request.form.get("d")
        solution = request.form.get("solution")
        new_opts = [a, b, c, d]
        db = self.mysql.connection
        cur = db.cursor()
        sql_update = """update questions set context = %s where id = %s"""
        cur.execute(sql_update, (question, qid))
        db.commit()
        sql_update = """update Questions_2_Solutions set solution_id = %s where question_id = %s"""
        cur.execute(sql_update, (sid, qid))
        db.commit()
        sql_update = """update options set context = %s where id = %s"""
        for i in range(4):
            oid = oids[i]
            new_opt = new_opts[i]
            cur.execute(sql_update, (new_opt, oid))
            db.commit()
        cur.close()
        response = Response(status=200)
        return response
