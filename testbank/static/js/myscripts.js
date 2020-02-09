function myFunction() {
	console.log("Flash 9.0.115 is required to enjoy this site.");
	var a=document.getElementById('username').value
	var b=document.getElementById('password').value

	var cur_user = {
	    'username': a,
	    'password': b
    }
	console.log(b)

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() { 
	        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
	            console.log("success!");
	            // window.location = "/login"
	   //          xmlHttp.open("POST", 'http://127.0.0.1:5000/login', true); // true for asynchronous 
				// xmlHttp.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
				// xmlHttp.send("username="+a+"&password="+b);
	        }
	    }
	    // xmlHttp.send(cur_user);
    xmlHttp.open("POST", 'http://127.0.0.1:5000/login', true); // true for asynchronous 
    xmlHttp.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xmlHttp.send("username="+a+"&password="+b);
    // window.location = "/login"
    // return xmlHttp.responseText;
    // window.location = "/login"
    // xmlHttp.send(null);
    // console.log(window.location.href);
    // window.location.href = "login.html";
}

// const form = document.forms["paypal"];
// const log = document.getElementById('log');
// form.addEventListener('submit', myFunction);

function logging(el){
     console.log(document.getElementById(el).innerHTML);
}  

function myFunc(data) {
	console.log(someJavaScriptVar)
    return someJavaScriptVar
}

var d = "{{ table }}";

function generate_table(el) {
	data = JSON.parse(document.getElementById(el).innerHTML)
	// console.log(JSON.parse(data))
	
  // get the reference for the body
  var body = document.getElementsByTagName("body")[0];

  // creates a <table> element and a <tbody> element
  var tbl = document.getElementById("table");
  var tblBody = document.createElement("tbody");

  var cell = document.createElement("thead");
  var row = document.createElement("tr");
  var cell = document.createElement("th");
  var cellText = document.createTextNode('Category');
  cell.appendChild(cellText);
  row.appendChild(cell);
  var cell = document.createElement("th");
  var cellText = document.createTextNode('Number');
  cell.appendChild(cellText);
  row.appendChild(cell);
  var cell = document.createElement("th");
  var cellText = document.createTextNode('Name');
  cell.appendChild(cellText);
  row.appendChild(cell);
  tblBody.appendChild(row);

  // creating all cells
  for (var i of data) {
  	// console.log(i)
    // creates a table row
    var row = document.createElement("tr");

    for (var j of i) {
    	// console.log(j)
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      var cell = document.createElement("td");
      var cellText = document.createTextNode(j);
      cell.appendChild(cellText);
      row.appendChild(cell);
    }

    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  // body.appendChild(tbl);
  // sets the border attribute of tbl to 2;
  tbl.setAttribute("border", "2");

  var table = document.getElementById("table");
  var rows = table.getElementsByTagName("tr");
  for (i = 1; i < rows.length; i++) {
    var currentRow = table.rows[i];
    var createClickHandler = function(row) {
      return function() {
        var cell = row.getElementsByTagName("td")[0];
        var id = cell.innerHTML;
        window.location.href="list_chapters";
      };
    };
    currentRow.onclick = createClickHandler(currentRow);
  }
}


function show(sid, content) {
  document.getElementById(sid).innerHTML = content;
}


