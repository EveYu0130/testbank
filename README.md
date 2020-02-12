## Description 

This is a Flask application. 
```
testbank
│   README.md
│   setup.py 
|   MANIFEST.in   
|   relational_diagram.png //visualized tables and relations
│
└───sample_db
    |   README.md (for sample database)
    |   test-sample.sql
    |   test-sample.out
    |   createtables.sql
    |   populatetables.sql
    └───data
│
└───testbank
        __init__.py
    │   schema.sql //test sql script
    |   testbank.py //core of the app
    │
    └───templates // html files
       │   index.html
       │   login.html
           ...
    |
    └───static
        └───js // javascripts
        
```
## Database Connection
This app uses local MySQL as database,so you need to set up MySQL on your local machine and create a database instance. 
Once you have done these, modify the following lines in testbank.py to match your information. 
```{python}
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '123456'
app.config['MYSQL_DB'] = "test_script
```

## Run App
Go to root diretory(/testbank), run the following commands.
```
export FLASK_APP=testbank
export FLASK_DEBUG=true
flask run
```
You will see a message telling you that server has started along with the address at which you can access it.
