//导入依赖
const async = require('async');
const superagent = require('superagent');
require('superagent-charset')(superagent);
const cheerio = require('cheerio');
const url = require('url');
const fs = require('fs');
const express = require('express');

const app = express();
//小说地址
const allbookUrl = 'http://www.quanshuwang.com/book/0/269';
//小说章节抓取策略
const fetchUrl = function(topicUrl, callback) {
    superagent.get(topicUrl)
        .buffer('true')
        .charset('gbk')
        .then((res, err) => {
            let $ = cheerio.load(res.text);
            let title = $('.jieqi_title').text().trim();
            let content = $('.mainContenr').text();
            content = content.replace(/\s*/g, "");
            result = {
                "title" : title,
                "content" : content
            };
            callback(err, result);
        })
}
//抓取小说
superagent.get(allbookUrl)
    .buffer('true')
    .charset('gbk')
    .then((res, err) => {
        if (err) {
            console.error(err);
        }
        let topicUrls = [];
        let $ = cheerio.load(res.text);
        //获取页面内所有的链接
        $('.dirconone a').each(function(index, element) {
            var $element = $(element);
            var href = url.resolve(allbookUrl, $element.attr('href'));
            topicUrls.push(href);
        })
        return topicUrls;
    }).then((res, err) => {
        if (err) {
            console.log(err);
        }
        let allTopicUrls = res;
        app.get('/fr',function (req, res){
            //通过get方法获取抓取小说范围
            let start = +req.query.start-1||0;
            let end = +req.query.end||(+req.query.start)||30;
            console.log(start,end);
            urls = allTopicUrls.slice(start,end);
            async.mapLimit(urls, 10, function(url, callback) {
                fetchUrl(url, callback);
            }, function(err, results) {
                if (err) {
                    console.log(err);
                }
                res.send(results);
            })
        })
    })
//端口监听
app.set('port', process.env.PORT||3000)
app.listen(app.get('port'),function(){
    console.log('app is listening on the port: %s', app.get('port'))
});