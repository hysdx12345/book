const express = require('express');

const app = express();
const router = express.Router();

//设置端口号
app.set('port', process.env.PORT || 8854);

//设置路由
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
})

router.get('/',function(req, res){
    res.send('admin home page');
})

router.get('/about',function(req, res){
    res.send('admin about page');
})

app.all('/admin',function(req, res, next){
    console.log('Acessing',app.mountpath);
    console.log(req.query.start)
    next();
})

app.use('/admin', router);

app.use(express.static('public'));


app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + ';press Ctrl-C to terminate.');
})

