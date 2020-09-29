const express = require('express');
const cheerio = require('cheerio');
const superagent = require('superagent');
const eventproxy = require('eventproxy');
const async = require('async');
const url = require('url');
const router = express.Router();
/**
* 使用superagent与cheerio完成简单爬虫
* */
router.get('/cheer',function (req,res,next) {
   superagent.get('https://cnodejs.org/')
       .end(function (err, sres) {
           if(err) {
               return next(err);
           }
           let $ = cheerio.load(sres.text);
           let items = [];
           $('#topic_list .topic_title').each(function (idx, element) {
               let $element = $(element);
               items.push({
                   title: $element.attr('title'),
                   href: $element.attr('href')
               });
           });
           res.send(items);
       });
});
/**
 * 使用eventproxy 控制并发
 *
* */
router.get('/eventproxy',function (req,res,next) {
     let cnodeUrl = 'https://cnodejs.org/';
     superagent.get(cnodeUrl)
         .end(function (err,sres) {
             if(err) {
                 return console.error(err);
             }
             let topicUrls = [];
             let $ = cheerio.load(sres.text);
             $('#topic_list .topic_title').each(function (idx, element) {
                 let $element = $(element);
                 let href = url.resolve(cnodeUrl, $element.attr('href'));
                 topicUrls.push(href);
             });
             let ep = new eventproxy();
             ep.after('topic_html',topicUrls.length, function (topics) {
                 topics = topics.map(function(topicPair){
                     let topicUrl = topicPair[0];
                     let topicHtml = topicPair[1];
                     let $ = cheerio.load(topicHtml);
                     return ({
                         title: $('.topic_full_title').text().trim(),
                         href: topicUrl,
                         comment1: $('.reply_content').eq(0).text().trim(),
                     });
                 });
                res.send(topics);
                 // console.log('final:');
                 // console.log(topics);
             });
             topicUrls.forEach(function (topicUrl) {
                superagent.get(topicUrl)
                    .end(function (err, sres) {
                        console.log('fetch ' + topicUrl + ' successful');
                        ep.emit('topic_html', [topicUrl,sres.text]);
                    }) ;
             });
         });
});
/**
 * 使用async 控制并发
 *
 * */
router.get('/async',function (req,res,next) {
    let concurrencyCount = 0;
    let fetchUrl = function(url,callback) {
        let delay = parseInt((Math.random() * 10000000) % 2000, 10);
        concurrencyCount++;
        console.log('现在的并发数是：', concurrencyCount, ', 正在抓取的是', url, ',耗时' + delay + '毫秒');
        setTimeout(function(){
            concurrencyCount++;
            callback(null,url+' html content');
        },delay);
    };
    let urls = [];
    for(let i=0;i< 30;i++) {
        urls.push('http://datasource_'+i);
    }
    async.mapLimit(urls,5,function (url,callback) {
        fetchUrl(url,callback);
    },function (err,result) {
        console.log('final:');
        console.log(result);
        res.send(result);
    })
});
module.exports = router;