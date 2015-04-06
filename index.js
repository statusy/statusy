var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var path = require('path');
var nunjucks = require('nunjucks');
var async = require('async');

var config = require('./config');
var utils = require('./utils');

/* Views configuration */

nunjucks.configure('views', {
  autoescape: true,
  express   : app
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

/* Routes */

app.get('/', function(req, res){
  console.log(config.sites);
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
  site.worker = config.statuses.worker.waiting;
  io.emit('deploy start', site);
  res.json({ message: 'success'});
});

app.get('/deploy/stop/:site_id', function(req, res){
  var site_id = req.params.site_id;
  var site = config.sites[site_id];
  site.id = site_id;
  site.status = config.statuses.active.message;
  site.last_deploy_date = utils.getFormattedDate();
  io.emit('deploy stop', site);
  res.json({ message: 'success'});
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

server.listen(3000, function(){
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

function sendRequest(site){

  var last_checked_date = Date.now();
  site.last_checked_date = last_checked_date;
  io.emit('sending request', site);
  console.log('sending request to: ' + site.host);
  var req = http.get(site.host, function(res) {

    io.emit('got response', site);
    console.log(res.statusCode);
    console.log(res.statusMessage);
  });

  req.on('error', function(e){
    console.log("Got error: " + e.message);
  });

}

function asyncEachSite(){
  async.each(config.sites, function(item, callback){
    item.id = config.sites.indexOf(item);
    if (item.status !== config.statuses.deploy.message) {
      sendRequest(item);
    }
    callback(null);
  }, function(err){
    if(err) {
    console.log('A file failed to process');
  } else {
    console.log('All files have been processed successfully');
  }
  });
}

asyncEachSite();
setInterval(asyncEachSite, config.DELAY_CHECK_SITES);
