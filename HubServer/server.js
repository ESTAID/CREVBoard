const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const sessionStore = require('session-file-store')(session); 
const mysql = require('mysql');
const pool = mysql.createPool({
  host: '****',
  user: '****',
  database: '****',
  password: '****',
  port: '****',
});

app.set('PORT', 3000);
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

 
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://crevhub.run.goorm.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(session({
  secret: 'crevjjang',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60
  },
  store: new sessionStore()
}));
  
app.post('/login', function (req, res) {
  if (!req.body) res.end("[]");
  if (req.body.user_id == "admin" && req.body.user_pw == "1234") {
    req.session.user_id = "admin";
    req.session.user_name = "관리자";
    res.json({
      result: "success"
    });
  } else {
    res.json({
      result: "fail"
    });
  }
});

app.get('/list', function (req, res) {
  pool.getConnection(function (err, conn) {
    if (err) throw err;
    var category = "1";
    if (req.query.category !== undefined){
     category = `b_category = '${req.query.category}'`;
    } 
    var p = req.query.p * 20;
    var selectListQuery = "select b_idx, m_name, b_title, b_regdate from board where " + category + " order by b_regdate DESC limit " + p + ", 20";
    console.log(selectListQuery);
    conn.query(selectListQuery, function (err, row) {
      if (err) console.error(err);
      res.send(JSON.stringify(row));
      conn.release();
    });
  });
});

app.post('/read/:id', function (req, res) {
  var id = req.params.id;
  pool.getConnection(function (err, conn) {
    if (err) throw err;
    var selectListQuery = "select m_name, b_title, b_contents, b_regdate, b_idx, b_category from board where b_idx = ?";
    conn.query(selectListQuery, id, function (err, row) {
      if (err) console.error(err);
      res.send(JSON.stringify(row));
      conn.release();
    });
  });
});

app.post('/delete/:id', function (req, res) {
  var id = req.params.id;
  pool.getConnection(function (err, conn) {
    var selectOne = "DELETE FROM board WHERE b_idx = ?";
    conn.query(selectOne, id, function (err, row) {
      if (err) console.error(err);
      res.send(JSON.stringify(row));
      conn.release();
    });
  });
});


app.post('/write', function (req, res) {
  if (typeof req.session.user_id !== "undefined") {
    var id = req.session.user_id;
    var name = req.session.user_name;
    var category = req.body.category;
    var title = req.body.title;
    var contents = req.body.contents;
    var regdate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var datas = [id, name, category, title, contents, regdate];
    pool.getConnection(function (err, conn) {
      var insertQuery = "INSERT INTO board(m_id, m_name, b_category, b_title, b_contents, b_regdate) values(?, ?, ?, ?, ?, ?)";
      conn.query(insertQuery, datas, function (err, row) {
        if (err) console.error(err);
        res.json({
          result: "success"
        });
        conn.release();
      });
    });
  } else {
    res.json({
      result: "fail"
    });
  }
});
 
app.post('/update/:id', function (req, res) {
  var id = req.params.id;
  var title = req.body.title;
  var content = req.body.content;
  var datasb = [title, content, id];
  
    console.log(datasb);
  pool.getConnection(function (err, conn) {
    var updateQuery = "UPDATE board SET b_title = ?, b_contents = ? WHERE b_idx = ?";
    conn.query(updateQuery, datasb, function (err, row) {
      if (err) console.error(err);
      res.send(JSON.stringify(row));
      conn.release();
    });
  });
});

app.listen(app.get('PORT'), function () {
  console.log('Server start.. ', app.get('PORT'));
});

