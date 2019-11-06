// const express = require('express');

// const app = express();
// const router = express.Router();

// //设置端口号
// app.set('port', process.env.PORT || 8854);

// //设置路由
// app.param('id', function(req, res, next, id){
//     console.log('call only once');
//     console.log(id,'called');

// })

// app.get('/usr/:id', function(req, res, next){
//     res.send('hello')
// })

// app.listen(app.get('port'), function(){
//     console.log('Express started on http://localhost:%s;press Ctrl-C to terminate.', app.get('port'));
// })
let a = [1,2,3,4,5,6,7,8,9]

let start = 2
let end = 0;

let b = a.slice(start||0, end||start+3||5)
console.log(b)