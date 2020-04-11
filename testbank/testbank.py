from flask import Flask, request, render_template, url_for, redirect
from flask_cors import CORS
from flask_caching import Cache
from flask_mysqldb import MySQL
import logging
from random import shuffle

app = Flask(__name__)
CORS(app)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '123456'
app.config['MYSQL_DB'] = "wjq"

# app.config['MYSQL_HOST'] = '127.0.0.1'
# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_PASSWORD'] = '123456'
# app.config['MYSQL_DB'] = "test"


mysql = MySQL(app)

cache.clear()

cur_user_id = None
cur_book_id = 0
cur_chapter_id = 0
cur_qid_list = []
cur_qid = None
test = False
table = None


# app.config['APPLICATION_ROOT'] = "../html/index.html"
@app.route('/', methods=['GET', 'POST'])
def welcome(data=''):
    db = mysql.connection
    cur = db.cursor()
    if test:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().execute(f.read())
        cur.close()
        db.commit()
    else:
        cur.execute('CREATE TABLE IF NOT EXISTS '
                    'Users ( '
                    'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                    'username VARCHAR(30) NOT NULL UNIQUE, '
                    'pw VARCHAR(30) NOT NULL, '
                    'email VARCHAR(50) UNIQUE, '
                    'reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);')
        cur.execute('CREATE TABLE IF NOT EXISTS '
                    'Books ( '
                    'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                    'category VARCHAR(30) NOT NULL, '
                    'number int(10) NOT NULL, '
                    'name VARCHAR(50), '
                    'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, '
                    'UNIQUE KEY (category, number, name));')
        cur.execute('CREATE TABLE IF NOT EXISTS '
                    'Chapters ( '
                    'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                    'name VARCHAR(50), '
                    'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);')
        cur.execute('CREATE TABLE IF NOT EXISTS '
                    'Questions ( '
                    'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                    'context VARCHAR(3000) NOT NULL, '
                    'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);')
        cur.execute('CREATE TABLE IF NOT EXISTS '
                    'Options ( '
                    'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                    'context VARCHAR(3000) NOT NULL, '
                    'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);')

        cur.execute('CREATE TABLE IF NOT EXISTS '
                    'Users_2_Books ( '
                    'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                    'user_id INT(10) UNSIGNED NOT NULL, '
                    'book_id INT(10) UNSIGNED NOT NULL, '
                    'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, '
                    'UNIQUE KEY (user_id, book_id), '
                    'FOREIGN KEY (book_id) REFERENCES Books(id), '
                    'FOREIGN KEY (user_id) REFERENCES Users(id));')
        cur.execute('CREATE TABLE IF NOT EXISTS '
                    'Books_2_Chapters ( '
                    'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                    'book_id INT(10) UNSIGNED NOT NULL, '
                    'chapter_id INT(10) UNSIGNED NOT NULL, '
                    'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, '
                    'UNIQUE KEY (book_id, chapter_id), '
                    'FOREIGN KEY (book_id) REFERENCES Books(id), '
                    'FOREIGN KEY (chapter_id) REFERENCES Chapters(id));')
        cur.execute('CREATE TABLE IF NOT EXISTS '
                    'Chapters_2_Questions ( '
                    'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                    'chapter_id INT(10) UNSIGNED NOT NULL, '
                    'question_id INT(10) UNSIGNED NOT NULL, '
                    'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, '
                    'UNIQUE KEY (chapter_id, question_id), '
                    'FOREIGN KEY (question_id) REFERENCES Questions(id), '
                    'FOREIGN KEY (chapter_id) REFERENCES Chapters(id));')
        cur.execute('CREATE TABLE IF NOT EXISTS '
                    'Questions_2_Options ( '
                    'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                    'question_id INT(10) UNSIGNED NOT NULL, '
                    'option_id INT(10) UNSIGNED NOT NULL, '
                    'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, '
                    'UNIQUE KEY (question_id, option_id), '
                    'FOREIGN KEY (question_id) REFERENCES Questions(id), '
                    'FOREIGN KEY (option_id) REFERENCES Options(id));')
        cur.execute('CREATE TABLE IF NOT EXISTS '
                    'Questions_2_Solutions ( '
                    'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                    'question_id INT(10) UNSIGNED NOT NULL, '
                    'solution_id INT(10) UNSIGNED NOT NULL, '
                    'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, '
                    'UNIQUE KEY (question_id, solution_id), '
                    'FOREIGN KEY (question_id) REFERENCES Questions(id), '
                    'FOREIGN KEY (solution_id) REFERENCES Options(id));')
        cur.execute('CREATE TABLE IF NOT EXISTS '
                    'Chapters_2_Errors ( '
                    'id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY UNIQUE, '
                    'chapter_id INT(10) UNSIGNED NOT NULL, '
                    'error_id INT(10) UNSIGNED NOT NULL, '
                    'add_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, '
                    'UNIQUE KEY (chapter_id, error_id), '
                    'FOREIGN KEY (error_id) REFERENCES Questions(id) ON DELETE CASCADE, '
                    'FOREIGN KEY (chapter_id) REFERENCES Chapters(id) ON DELETE CASCADE);')

    return render_template('index.html', data=data)
    # return '../html/index.html'


# @app.route('/successful_login', methods=['GET', 'POST'])
# def login():
#     return render_template('login.html')


@app.route('/login2s', methods=['GET', 'POST'])
def success():
    return render_template('login.html')


@app.route('/login2f', methods=['GET', 'POST'])
def fail():
    return render_template('index.html', data='Please try again')


@app.route('/login', methods=['GET', 'POST'])
def hello_world():
    # print(request)
    a = request.form.get("username")
    b = request.form.get("password")
    if b is None or a is None:
        return redirect(url_for('fail'))
    db = mysql.connection
    cur = db.cursor()
    cur.execute("SELECT id FROM Users where username=\'" + a + '\' and pw=\'' + b + '\'')
    global cur_user_id
    if cur.rowcount == 1:
        cur_user_id = cur.fetchall()[0]
        print(cur_user_id)
        return redirect(url_for('list_books'))
    else:
        return redirect(url_for('fail'))


@app.route('/create_account', methods=['GET', 'POST'])
def create_account():
    return render_template('create_account.html', data='')


@app.route('/create_account_fail', methods=['GET', 'POST'])
def create_account_fail(err='Required field missing'):
    return render_template('create_account.html', data=err)


@app.route('/creating_account', methods=['GET', 'POST'])
def creating_account():
    print('creating_account')
    a = request.form.get("username")
    b = request.form.get("password")
    c = request.form.get("email")
    if a == '' or b == '' or c == '':
        print('create_account_fail')
        return redirect(url_for('create_account_fail'))
    db = mysql.connection
    cur = db.cursor()
    sql_insert = """insert into Users (username, pw, email) values (%s,%s,%s)"""
    try:
        cur.execute(sql_insert, (a, b, c))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s, %s", "%s", a, b, c)
        return create_account_fail(err='username and email should be unique')
    else:
        return welcome(data='Create acoount successfully. Please login now.')
    finally:
        cur.close()


@app.route('/list_books', methods=['GET', 'POST'])
def list_books(data=''):
    db = mysql.connection
    cur = db.cursor()
    sql_select = """SELECT book_id FROM Users_2_Books where user_id=%s"""
    # return cur_user_id
    cur.execute(sql_select, (cur_user_id))
    save = cur.fetchall()
    cur.close()
    book_table = []
    for s in save:
        s = s[0]
        sql_select = """SELECT category FROM Books where id=%s"""
        cur = db.cursor()
        # cur.execute(sql_select, (s))
        cur.execute("SELECT * FROM Books where id=" + str(s) + ';')
        book_info = cur.fetchall()[0]
        id = book_info[0]
        category = book_info[1]
        number = book_info[2]
        name = book_info[3]
        cur.close()
        book_table.append({'category': category, 'number': number, 'name': name, 'id': id})
    cur.close()
    return render_template('list_books.html', data=data, table=book_table)
    # return render_template('list_books.html', data=data, table=json.dumps(table))


@app.route('/add_book', methods=['GET', 'POST'])
def add_book(data=''):
    return render_template('add_book.html', data=data)


@app.route('/add_chapter', methods=['GET', 'POST'])
def add_chapter(data=''):
    return render_template('add_chapter.html', data=data)


@app.route('/add_question', methods=['GET', 'POST'])
def add_question(data=''):
    return render_template('add_question.html', data=data)


@app.route('/adding_chapter', methods=['GET', 'POST'])
def adding_chapter():
    name = request.form.get("name")
    print(name)
    db = mysql.connection
    cur = db.cursor()
    # sql_insert = """insert into Chapters (name) values (%s)"""
    try:
        cur.execute("""insert into Chapters (name) values (%s)""", (name,))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s", name)

    # sql_select = "SELECT id FROM Chapters ORDER BY id DESC LIMIT 1"
    cur.execute("SELECT id FROM Chapters ORDER BY id DESC LIMIT 1")

    chapter_id = cur.fetchall()[0][0]
    print(chapter_id)
    sql_insert = """insert into Books_2_Chapters (book_id, chapter_id) values (%s,%s)"""
    try:
        cur.execute(sql_insert, (cur_book_id, chapter_id))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s, %s", cur_book_id, chapter_id)

    # for row in cur.fetchall():
    #     sql_select = """SELECT * FROM  Books where id=%s"""
    #     book_info = cur.execute(sql_select, row[2])
    #     print(book_info)
    return list_chapters(data='Successfully Adding a Book!')


@app.route('/adding_book', methods=['GET', 'POST'])
def adding_book(data=''):
    category = request.form.get("category")
    number = request.form.get("number")
    name = request.form.get("name")

    db = mysql.connection
    cur = db.cursor()

    sql_insert = """insert into Books (category, number, name) values (%s,%s,%s)"""
    try:
        cur.execute(sql_insert, (category, number, name))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s, %s", "%s", category, number, name)
        return render_template('add_book.html', data='one of category, number, name has to be different')

    sql_select = """SELECT id FROM Books where category=%s and number=%s and name=%s;"""
    cur.execute(sql_select, (category, number, name))

    book_id = cur.fetchall()[0][0]
    sql_insert = """insert into Users_2_Books (user_id, book_id) values (%s,%s)"""
    try:
        cur.execute(sql_insert, (cur_user_id, book_id))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s, %s", cur_user_id, book_id)

    # for row in cur.fetchall():
    #     sql_select = """SELECT * FROM  Books where id=%s"""
    #     book_info = cur.execute(sql_select, row[2])
    #     print(book_info)
    return list_books(data='Successfully Adding a Book!')


@app.route('/adding_question', methods=['GET', 'POST'])
def adding_question():
    question = request.form.get("question")
    a = request.form.get("a")
    b = request.form.get("b")
    c = request.form.get("c")
    d = request.form.get("d")
    solution = request.form.get("solution")

    db = mysql.connection
    cur = db.cursor()
    try:
        cur.execute("""insert into Questions (context) values (%s)""", (question,))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s", question)
    cur.execute("SELECT id FROM Questions ORDER BY id DESC LIMIT 1")
    question_id = cur.fetchall()[0][0]
    print(question_id)
    cur.close()

    cur = db.cursor()
    try:
        cur.execute("""insert into Options (context) values (%s)""", (a,))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s", a)
    cur.execute("SELECT id FROM Options ORDER BY id DESC LIMIT 1")
    a_id = cur.fetchall()[0][0]
    print(a_id)
    cur.close()

    cur = db.cursor()
    try:
        cur.execute("""insert into Options (context) values (%s)""", (b,))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s", b)
    cur.execute("SELECT id FROM Options ORDER BY id DESC LIMIT 1")
    b_id = cur.fetchall()[0][0]
    print(b_id)
    cur.close()

    cur = db.cursor()
    try:
        cur.execute("""insert into Options (context) values (%s)""", (c,))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s", c)
    cur.execute("SELECT id FROM Options ORDER BY id DESC LIMIT 1")
    c_id = cur.fetchall()[0][0]
    print(c_id)
    cur.close()

    cur = db.cursor()
    try:
        cur.execute("""insert into Options (context) values (%s)""", (d,))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s", d)
    cur.execute("SELECT id FROM Options ORDER BY id DESC LIMIT 1")
    d_id = cur.fetchall()[0][0]
    print(d_id)
    cur.close()

    cur = db.cursor()
    try:
        cur.execute("""insert into Options (context) values (%s)""", (solution,))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s", solution)
    cur.execute("SELECT id FROM Options ORDER BY id DESC LIMIT 1")
    solution_id = cur.fetchall()[0][0]
    print(solution_id)
    cur.close()

    cur = db.cursor()
    sql_insert = """insert into Chapters_2_Questions (chapter_id, question_id) values (%s,%s)"""
    try:
        cur.execute(sql_insert, (cur_chapter_id, question_id))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s, %s", cur_chapter_id, question_id)
    cur.close()

    cur = db.cursor()
    sql_insert = """insert into Questions_2_Options (question_id, option_id) values (%s,%s)"""
    try:
        cur.execute(sql_insert, (question_id, a_id))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s, %s", question_id, a_id)
    cur.close()

    cur = db.cursor()
    sql_insert = """insert into Questions_2_Options (question_id, option_id) values (%s,%s)"""
    try:
        cur.execute(sql_insert, (question_id, b_id))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s, %s", question_id, b_id)
    cur.close()

    cur = db.cursor()
    sql_insert = """insert into Questions_2_Options (question_id, option_id) values (%s,%s)"""
    try:
        cur.execute(sql_insert, (question_id, c_id))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s, %s", question_id, c_id)
    cur.close()

    cur = db.cursor()
    sql_insert = """insert into Questions_2_Options (question_id, option_id) values (%s,%s)"""
    try:
        cur.execute(sql_insert, (question_id, d_id))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s, %s", question_id, d_id)
    cur.close()

    cur = db.cursor()
    sql_insert = """insert into Questions_2_Options (question_id, option_id) values (%s,%s)"""
    try:
        cur.execute(sql_insert, (question_id, solution_id))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s, %s", question_id, solution_id)
    cur.close()

    cur = db.cursor()
    sql_insert = """insert into Questions_2_Solutions (question_id, solution_id) values (%s,%s)"""
    try:
        cur.execute(sql_insert, (question_id, solution_id))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to insert values %s, %s", question_id, solution_id)
    cur.close()

    return list_all_questions(data='Successfully Adding a Question!')


@app.route('/list_chapters', methods=['GET', 'POST'])
def list_chapters(data=''):
    global cur_book_id
    chapter_table = []
    cur_book_id = int(request.args.get('book_id', cur_book_id))
    print("received book id is " + str(request.args.get('book_id', cur_book_id)))
    db = mysql.connection
    cur = db.cursor()
    sql_select = """SELECT chapter_id FROM Books_2_Chapters where book_id=%s"""
    cur.execute("SELECT chapter_id FROM Books_2_Chapters where book_id=" + str(cur_book_id) + ';')
    save = cur.fetchall()
    cur.close()
    for s in save:
        s = s[0]
        print("fetched chapter id is " + str(s))
        cur = db.cursor()
        cur.execute("SELECT * FROM Chapters where id=" + str(s) + ';')
        chapter_info = cur.fetchall()[0]
        id = chapter_info[0]
        name = chapter_info[1]
        cur.close()
        chapter_table.append({'name': name, 'id': id})
    cur.close()
    print(chapter_table)
    # return "value=" + str(values[index]['b'])
    return render_template('list_chapters.html', data=data, table=chapter_table)


@app.route('/list_questions', methods=['GET', 'POST'])
def list_questions(data=''):
    db = mysql.connection
    global cur_chapter_id
    cur_chapter_id = int(request.args.get('chapter_id', cur_chapter_id))
    print("received book id is " + str(request.args.get('chapter_id', cur_chapter_id)))
    cur = db.cursor()
    cur.execute("SELECT question_id FROM Chapters_2_Questions where chapter_id=" + str(cur_chapter_id) + ';')
    save = cur.fetchall()
    save = [x[0] for x in list(save)]
    shuffle(save)
    cur.close()
    global cur_qid_list
    global cur_qid_list_tmp
    cur_qid_list = save
    cur_qid_list_tmp = save
    return render_template('list_questions.html', data=data)



@app.route('/list_all_questions', methods=['GET', 'POST'])
def list_all_questions(data='', methods=['GET', 'POST']):
    db = mysql.connection
    global cur_chapter_id
    cur_chapter_id = int(request.args.get('chapter_id', cur_chapter_id))
    print("received book id is " + str(request.args.get('chapter_id', cur_chapter_id)))
    cur = db.cursor()
    cur.execute("SELECT question_id FROM Chapters_2_Questions where chapter_id=" + str(cur_chapter_id) + ';')
    qids = cur.fetchall()
    qids = [x[0] for x in list(qids)]
    table = []
    for qid in qids:
        cur.execute("SELECT context FROM Questions where id=" + str(qid) + ';')
        question = cur.fetchall()[0][0]

        cur.execute("SELECT solution_id FROM Questions_2_Solutions where question_id=" + str(qid) + ';')
        sid = cur.fetchall()[0][0]
        cur.execute("SELECT context FROM Options where id=" + str(sid) + ';')
        solution = cur.fetchall()[0][0]
        table.append({'qid': qid, 'question': question, 'solution': solution})
    cur.close()
    return render_template('view_all_questions.html', table=table)


@app.route('/list_all_questions_after_delete', methods=['GET', 'POST'])
def list_all_questions_after_delete(data='', methods=['GET', 'POST']):
    db = mysql.connection
    cur = db.cursor()
    global cur_chapter_id
    cur_chapter_id = int(request.args.get('chapter_id', cur_chapter_id))
    print("received book id is " + str(request.args.get('chapter_id', cur_chapter_id)))
    qid = int(request.args.get('question_id', None))

    sql_delete = """delete from Chapters_2_Questions where (chapter_id, question_id) = (%s,%s)"""
    try:
        cur.execute(sql_delete, (cur_chapter_id, qid))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to delete values %s, %s", cur_chapter_id, qid)

    sql_delete = """delete from Chapters_2_Errors where (chapter_id, error_id) = (%s,%s)"""
    try:
        cur.execute(sql_delete, (cur_chapter_id, qid))
        db.commit()
    except db.IntegrityError:
        logging.warn("failed to delete values %s, %s", cur_chapter_id, qid)

    cur.execute("SELECT question_id FROM Chapters_2_Questions where chapter_id=" + str(cur_chapter_id) + ';')
    qids = cur.fetchall()
    qids = [x[0] for x in list(qids)]
    table = []
    for qid in qids:
        cur.execute("SELECT context FROM Questions where id=" + str(qid) + ';')
        question = cur.fetchall()[0][0]

        cur.execute("SELECT solution_id FROM Questions_2_Solutions where question_id=" + str(qid) + ';')
        sid = cur.fetchall()[0][0]
        cur.execute("SELECT context FROM Options where id=" + str(sid) + ';')
        solution = cur.fetchall()[0][0]
        table.append({'qid': qid, 'question': question, 'solution': solution})
    cur.close()
    return render_template('view_all_questions.html', table=table)



@app.route('/modify_question', methods=['GET', 'POST'])
def modify_question(methods=['GET', 'POST']):
    table=[]
    qid = int(request.args.get('question_id', 0))
    print(qid)
    db = mysql.connection
    cur = db.cursor()

    cur.execute("SELECT context FROM Questions where id=" + str(qid) + ';')
    question = cur.fetchall()[0][0]
    print(question)
    table.append(question)

    cur.execute("SELECT solution_id FROM Questions_2_Solutions where question_id=" + str(qid) + ';')
    sid = cur.fetchall()[0][0]
    cur.execute("SELECT context FROM Options where id=" + str(sid) + ';')
    solution = cur.fetchall()[0][0]
    table.append(solution)

    cur.execute("SELECT option_id FROM Questions_2_Options where question_id=" + str(qid) + ';')
    oid_list = cur.fetchall()
    cur.close()
    oid_list = [x[0] for x in list(oid_list)]
    for oid in oid_list:
        cur = db.cursor()
        cur.execute("SELECT context FROM Options where id=" + str(oid) + ';')
        option = cur.fetchall()
        cur.close()
        print(option[0][0])
        table.append(option[0][0])
    print(table)
    return render_template('modify_a_question.html', table=table, qid=qid, sid=sid, oids=oid_list)

@app.route('/list_all_questions_after_modify', methods=['GET', 'POST'])
def list_all_questions_after_modify(data='modify successfully', methods=['GET', 'POST']):
    qid = int(request.args.get('qid', 0))
    sid = int(request.args.get('sid', 0))
    bid = int(request.args.get('b', 0))
    cid = int(request.args.get('c', 0))
    did = int(request.args.get('d', 0))
    eid = int(request.args.get('e', 0))
    oids = [bid, cid, did, eid]
    question = request.form.get("question")
    print(question)
    a = request.form.get("a")#solution
    b = request.form.get("b")
    c = request.form.get("c")
    d = request.form.get("d")
    e = request.form.get("e")
    new_opts = [b,c,d,e]
    print(new_opts)
    db = mysql.connection
    cur = db.cursor()
    sql_update = """update questions set context = %s where id = %s"""
    cur.execute(sql_update, (question, qid))
    db.commit()
    sql_update = """update options set context = %s where id = %s"""
    cur.execute(sql_update, (a, sid))
    db.commit()
    for i in range(4):
        oid = oids[i]
        new_opt = new_opts[i]
    # for (oid, new_opt) in (oids, new_opts):
        cur.execute(sql_update, (new_opt, oid))
        db.commit()
    cur.close()
    return redirect(url_for('list_all_questions', data='successfully modified a question'))


@app.route('/list_errors', methods=['GET', 'POST'])
def list_errors(data=''):
    db = mysql.connection
    global cur_chapter_id
    cur_chapter_id = int(request.args.get('chapter_id', cur_chapter_id))
    print("received book id is " + str(request.args.get('chapter_id', cur_chapter_id)))
    cur = db.cursor()
    cur.execute("SELECT error_id FROM Chapters_2_Errors where chapter_id=" + str(cur_chapter_id) + ';')
    save = cur.fetchall()
    save = [x[0] for x in list(save)]
    shuffle(save)
    cur.close()
    global cur_qid_list
    global cur_qid_list_tmp
    cur_qid_list = save
    cur_qid_list_tmp = save
    return render_template('list_questions.html', data=data)


@app.route('/at_question', methods=['GET', 'POST'])
def at_question():
    global cur_qid_list, cur_qid_list_tmp, cur_qid
    print(len(cur_qid_list_tmp))
    if len(cur_qid_list_tmp) == 0:
        return list_chapters(data='This chapter is empty.')
        # return redirect(url_for('list_chapters', data='This chapter is empty.'))
    restart = int(request.args.get('restart', 0))
    global table
    table = []
    if restart == 1:
        cur_qid_list = cur_qid_list_tmp
    if len(cur_qid_list) == 0:
        return list_chapters(data='Finished a quiz. Select another chapter')
        # return redirect(url_for('list_chapters', data='Finished a quiz. Select another chapter'))
        # return 'end of quiz'
    cur_qid = cur_qid_list[0]
    cur_qid_list = cur_qid_list[1:]

    db = mysql.connection
    cur = db.cursor()
    cur.execute("SELECT context FROM Questions where id=" + str(cur_qid) + ';')
    save = cur.fetchall()
    cur.close()
    print(save)
    q_context = save[0][0]
    table.append(q_context)

    cur = db.cursor()
    cur.execute("SELECT option_id FROM Questions_2_Options where question_id=" + str(cur_qid) + ';')
    save = cur.fetchall()
    cur.close()
    print(save)
    save = [x[0] for x in list(save)]
    oid_list = save
    shuffle(oid_list)

    for oid in oid_list:
        cur = db.cursor()
        cur.execute("SELECT context FROM Options where id=" + str(oid) + ';')
        save = cur.fetchall()
        cur.close()
        print(save[0][0])
        table.append(save[0][0])

    cur = db.cursor()
    cur.execute("SELECT solution_id FROM Questions_2_Solutions where question_id=" + str(cur_qid) + ';')
    save = cur.fetchall()
    cur.close()
    print(save[0][0])
    sid = save[0][0]

    cur = db.cursor()
    cur.execute("SELECT context FROM Options where id=" + str(sid) + ';')
    save = cur.fetchall()
    cur.close()
    print(save[0][0])
    table.append(save[0][0])

    return render_template('start_quiz.html', table=table)

@app.route('/answered_question', methods=['GET', 'POST'])
def answered_question():
    global table, cur_qid, cur_chapter_id
    value = request.form.getlist('check')
    if len(value) > 1:
        return render_template('start_quiz.html', table=table, data='Only one possible solution')
    if value[0] != table[-1]:
        db = mysql.connection
        cur = db.cursor()
        sql_insert = """insert into Chapters_2_Errors (chapter_id, error_id) values (%s,%s)"""
        try:
            cur.execute(sql_insert, (cur_chapter_id, cur_qid))
            db.commit()
        except db.IntegrityError:
            logging.warn("failed to insert values %s, %s", cur_chapter_id, cur_qid)
        cur.close()
        return render_template('start_quiz.html', table=table, data='Wrong')
    else:
        db = mysql.connection
        cur = db.cursor()
        sql_delete = """delete from Chapters_2_Errors where (chapter_id, error_id) = (%s,%s)"""
        try:
            cur.execute(sql_delete, (cur_chapter_id, cur_qid))
            db.commit()
        except db.IntegrityError:
            logging.warn("failed to delete values %s, %s", cur_chapter_id, cur_qid)
        cur.close()
        return render_template('start_quiz.html', table=table, data='Correct')
