//导入依赖
const async = require('async');
const superagent = require('superagent');
require('superagent-charset')(superagent);
const cheerio = require('cheerio');
const express = require('express');
const url = require('url');

const app = express();

const allbookUrl = 'http://www.quanshuwang.com/book/0/269';



const fetchUrl = function(topicUrl, callback) {
    console.log('正在抓取' + topicUrl)
    superagent.get(topicUrl)
        .buffer('true')
        .charset('gbk')
        .then((res, err) => {
            let $ = cheerio.load(res.text);

            let title = $('.jieqi_title').text().trim();
            let content = $('.mainContenr').text();
            content = content.replace(/\s*/g, "");

            result = {
                title: title,
                content: content
            };
            callback(err, result);
        })
}

superagent.get(allbookUrl)
    .buffer('true')
    .charset('gbk')
    .then((res, err) => {
        if (err) {
            return console.error(err);
        }
        let topicUrls = [];
        let $ = cheerio.load(res.text);
        //获取页面内所有的链接
        $('.dirconone a').each(function(index, element) {
            var $element = $(element);
            var href = url.resolve(allbookUrl, $element.attr('href'));
            topicUrls.push(href);
        })
        console.log('url待抓取：');
        console.log(topicUrls);
        return topicUrls;

    }).then((res, err) => {
        if (err) {
            console.log(err);
        }

        let urls = res.slice(0,50);



        async.mapLimit(urls, 5, function(url, callback) {
            fetchUrl(url, callback);
        }, (err, res) => {
            if (err) {
                console.log(err);
            }
            console.log('最终抓取数据：');
            console.log(res);




            let items = res;

            app.get('/', function(req, res, next) {

                res.send(items);

            });

            let port = process.env.PORT;
            if (port == null || port == "") {
                port = 4000;
            }
            app.listen(port,function () {
                console.log('app is listening at port'+ port);
            });
        })
    })
