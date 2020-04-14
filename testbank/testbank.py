import os
import sys
file_dir = os.path.dirname(__file__)
sys.path.append(file_dir)

from flask import Flask
from flask_cors import CORS
from flask_caching import Cache
from testbank_src import TestBank

def create_app(UPLOAD_FOLDER):
    app = Flask(__name__)
    CORS(app)
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.secret_key = "secret key"
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

    # Modify the following entries according to your local setup
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'
    app.config['MYSQL_PASSWORD'] = 'skye1808'
    app.config['MYSQL_DB'] = "mytest"

    cache = Cache(app, config={'CACHE_TYPE': 'simple'})
    cache.clear()
    return app


UPLOAD_FOLDER = 'upload/'
app = create_app(UPLOAD_FOLDER)
testbank = TestBank(app)

@app.route('/login2s', methods=['GET', 'POST'])
def success():
    return testbank.success()

@app.route('/login2f', methods=['GET', 'POST'])
def fail():
    return testbank.fail()

@app.route('/create_account', methods=['GET', 'POST'])
def create_account():
    return testbank.create_account()

@app.route('/create_account_fail', methods=['GET', 'POST'])
def create_account_fail(err='Required field missing'):
    return testbank.create_account_fail(err='Required field missing')

@app.route('/creating_account', methods=['GET', 'POST'])
def creating_account():
    return testbank.creating_account()

@app.route('/', methods=['GET', 'POST'])
def welcome():
    return testbank.welcome()

@app.route('/login', methods=['GET', 'POST'])
def hello_world():
    return testbank.hello_world()

@app.route('/list_books', methods=['GET', 'POST'])
def list_books(data=''):
    return testbank.list_books(data)

@app.route('/add_book', methods=['GET', 'POST'])
def add_book(data=''):
    return testbank.add_book(data)

@app.route('/add_chapter', methods=['GET', 'POST'])
def add_chapter(data=''):
    return testbank.add_chapter(data)

@app.route('/add_question', methods=['GET', 'POST'])
def add_question(data=''):
    return testbank.add_question(data)

@app.route('/upload_file', methods=['GET', 'POST'])
def upload_form():
    return testbank.upload_form()

@app.route('/uploaded', methods=['POST'])
def upload_file():
    return testbank.upload_file()

@app.route('/adding_chapter', methods=['GET', 'POST'])
def adding_chapter():
    return testbank.adding_chapter()

@app.route('/adding_book', methods=['GET', 'POST'])
def adding_book(data=''):
    return testbank.adding_book(data)

@app.route('/adding_question', methods=['GET', 'POST'])
def adding_question():
    return testbank.adding_question()

@app.route('/list_chapters', methods=['GET', 'POST'])
def list_chapters(data=''):
    return testbank.list_chapters(data)

@app.route('/list_questions', methods=['GET', 'POST'])
def list_questions(data=''):
    return testbank.list_questions(data)

@app.route('/list_all_questions', methods=['GET', 'POST'])
def list_all_questions(data='', methods=['GET', 'POST']):
    return testbank.list_all_questions(data, methods)

@app.route('/list_all_questions_after_delete', methods=['GET', 'POST'])
def list_all_questions_after_delete(data='', methods=['GET', 'POST']):
    return testbank.list_all_questions_after_delete(data, methods)

@app.route('/modify_question', methods=['GET', 'POST'])
def modify_question(methods=['GET', 'POST']):
    return testbank.modify_question(methods)

@app.route('/list_all_questions_after_modify', methods=['GET', 'POST'])
def list_all_questions_after_modify(data='modify successfully', methods=['GET', 'POST']):
    return testbank.list_all_questions_after_modify(data, methods)

@app.route('/list_errors', methods=['GET', 'POST'])
def list_errors(data=''):
    return testbank.list_errors(data)

@app.route('/at_question', methods=['GET', 'POST'])
def at_question():
    return testbank.at_question()

@app.route('/answered_question', methods=['GET', 'POST'])
def answered_question():
    return testbank.answered_question()

@app.route('/questions', methods=['GET', 'POST'])
def list_all_questions2(data='', methods=['GET', 'POST']):
    return testbank.list_all_questions2(data, methods)

@app.route('/question', methods=['GET', 'POST'])
def question():
    return testbank.question()

@app.route('/modify', methods=['GET', 'POST'])
def modify(data='modify successfully', methods=['GET', 'POST']):
    return testbank.modify(data, methods)
