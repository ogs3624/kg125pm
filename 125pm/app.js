var http = require("http");
var socketio = require("socket.io");
var fs = require("fs");

var server = http.createServer(function(req, res) {
     res.writeHead(200, {"Content-Type":"text/html"});
     var output = fs.readFileSync("./index.html", "utf-8");
     res.end(output);
}).listen(process.env.VMC_APP_PORT || 3300);
console.log('Server running　http://59.106.221.135:3300/');

var server2 = http.createServer(function(req, res) {
     res.writeHead(200, {"Content-Type":"text/html"});
     var output = fs.readFileSync("./client.html", "utf-8");
     res.end(output);
}).listen(process.env.VMC_APP_PORT || 3330);
console.log('Server running　http://59.106.221.135:3330/');

var io = socketio.listen(server);
var io2 = socketio.listen(server2);

var mode = 0;

io.sockets.on("connection", function (socket) {
  // メッセージ送信（送信者にも送られる）
  socket.on("C_to_S_message", function (data) {
  //console.log('hoge2');
  
  if(data.color==null){
    //console.log('hoge');
	io.sockets.emit("S_to_C_message", {value:data.value});
  }else{
    io.sockets.emit("S_to_C_message", {value:data.value,color:data.color,size:data.size});
  }
  
    
	//io2.sockets.emit("S_to_C_message", {value:data.value,color:data.color,size:data.size});
	//console.log('hoge');
  });
  // ブロードキャスト（送信者以外の全員に送信）
  socket.on("C_to_S_broadcast", function (data) {
    //socket.broadcast.emit("S_to_C_message", {value:data.value,color:data.color,size:data.size});
  });
  // 切断したときに送信
  socket.on("disconnect", function () {
//    io.sockets.emit("S_to_C_message", {value:"user disconnected"});
  });
});

io2.sockets.on("connection", function (socket) {
	//console.log("connect");
	if(mode==1){
		io2.sockets.emit("S_to_C_message", {changeworld:1111});
	}
	if(mode==2){
		io2.sockets.emit("S_to_C_message", {changeworld:5555});
	}
	
  // メッセージ送信（送信者にも送られる）
  socket.on("C_to_S_message", function (data) {
    //io.sockets.emit("S_to_C_message", {value:data.value,color:data.color,size:data.size});
	io2.sockets.emit("S_to_C_message", {changeworld:data.value});
	if(data.value==1111){
		mode=1;
	}else if(data.value==9999){
		mode=0;
	}else if(data.value==5555){
		mode=2;
	}
	//console.log(data.value);
  });
  
  // ブロードキャスト（送信者以外の全員に送信）
  socket.on("C_to_S_broadcast", function (data) {
    //io2.broadcast.emit("S_to_C_message", {changeworld:data.changeworld});
	//console.log('hoge');
  });
  // 切断したときに送信
  socket.on("disconnect", function () {
//    io.sockets.emit("S_to_C_message", {value:"user disconnected"});
  });
});

