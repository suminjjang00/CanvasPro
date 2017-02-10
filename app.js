var express = require('express');
var http = require('http');
var app = express();
var socketio = require('socket.io');
var fs = require('fs');
var ejs = require('ejs');
var body_parser=require('body-parser');


app.engine('html',ejs.renderFile);
app.use(body_parser.urlencoded({extended:false}));
app.use(express.static('public'));

var server = http.createServer(app);

var io = socketio.listen(server);

var room = '';

io.sockets.on('connection',function(socket){
  socket.on('join',function(data){
    socket.join(data);
    room=data;
  });
  socket.on('draw',function(data){
    io.sockets.in(room).emit('line',data);
    console.log(data);
  });
  socket.on('create_room',function(data){
    io.sockets.emit('create_room',data.toString());
    console.log(data.toString());
  });
});

app.get('/',function(request,response){
  fs.readFile('lobby.html',function(error,data){
    response.send(data.toString());
  });
});
app.get('/canvas/:room',function(request,response){
  // fs.readFile('canvas.html',function(error,data){
  //   console.log('ss')
  //   response.send(ejs.render(data,{
  //     room:request.body.room
  //   }));
  // });
  var filesync = fs.readFileSync('./canvas.html','utf8');
  console.log('s2');
  response.send(ejs.render(filesync,{
    room:request.body.room
  }));
  console.log('s1');
});
app.get('/room',function(request,response){
  var rooms = Object.keys(io.sockets.adapter.rooms).filter(function(item){
    return item.indexOf('/') < 0;
  });
  response.send(rooms);
});
server.listen(10118,function(){
  console.log('on the server...');
});
app.get('/',function(request,response){
  response.send('test');
});
