var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var nunjucks = require('nunjucks');
var config = require('./config');

/* Views configuration */

nunjucks.configure('views', {
  autoescape: true,
  express   : app
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

/* Routes */

app.get('/', function(req, res){
  res.render('index', {sites: config.sites});
});

app.get('/status', function(req, res){
  io.emit('status', {});
  res.json({ message: 'success'});
});

app.get('/deploy/start/:site_id', function(req, res){
  var site_id = req.params.site_id;
  var site = config.sites[site_id];
  site.id = site_id;
  site.status = config.statuses.deploy.message;
  io.emit('deploy start', site);
  res.json({ message: 'success'});
});

app.get('/deploy/stop/:site_id', function(req, res){
  io.emit('deploy stop', {site_id: req.params.site_id});
  res.json({ message: 'success'});
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
