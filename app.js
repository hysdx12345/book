//导入依赖
const async = require('async');
const superagent = require('superagent');
require('superagent-charset')(superagent);
const cheerio = require('cheerio');
const url = require('url');
const fs = require('fs');
const express = require('express');

const app = express();
// const mongoose = require('mongoose');

// const Murl = "mongodb://localhost:27017/book";


// mongoose.connect(Murl);
// const con = mongoose.connection;

// con.on('error', console.error.bind(console, '连接数据库失败'));
// con.once('open', () => {
//             //成功连接
//             //定义一个schema
//             let bookSchema = mongoose.Schema({
//                 title: String,
//                 content: String
//             });
//             bookSchema.methods.read = function() {
//                 console.log("已保存：" + this.title);
//             }
//             //继承一个schema
//             let bookModel = mongoose.model("book", bookSchema);

//         })

const allbookUrl = 'http://www.quanshuwang.com/book/0/269';

const fetchUrl = function(topicUrl, callback) {
    console.log('正在抓取：' + topicUrl)
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

			// con.on('error', console.error.bind(console, '连接数据库失败'));
			// con.once('open', () => {
			//     //成功连接
			//     //生成一个document
	  //           let book = new bookModel({
	  //               title: title,
	  //               content: content
	  //           });

			//     //存放数据
			//     book.save((err, book) => {
			//         if (err) return console.log(err);
			//         apple.read();
			//         //查找数据
			//         Model.find({ name: 'book' }, (err, data) => {
			//             console.log(data);
			//         })
			//     });
			// })

            callback(err, result);
        })
}
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
        console.log('url待抓取：');
        console.log(topicUrls);
        return topicUrls;

    }).then((res, err) => {
        if (err) {
            console.log(err);
        }

        let urls = res.slice(0, 50);

        async.mapLimit(urls, 10, function(url, callback) {
            fetchUrl(url, callback);
        }, function(err, results) {
            if (err) {
                console.log(err);
            }

            app.get('/', function (req, res, next) {
            	// body...
            	res.send(result);
            })
            let port = process.env.PORT;
			if (port == null || port == "") {
			  port = 3000;
			}
			app.listen(port);
            // console.log('最终抓取数据: ');
            // console.log(results);
        })
    })