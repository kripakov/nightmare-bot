
var Nightmare = require("nightmare"),
  nightmare = Nightmare({
    show: true,
    switches: {
      'ignore-certificate-errors': true
    }
  }),
  nightmare2 = Nightmare({
    show: true,
    switches: {
      'ignore-certificate-errors': true
    }
  }),
  async = require("async"),
  request = require("request"),
  cheerio = require("cheerio"),
  fs = require('fs'),
  underscore = require('underscore'),
  urls = require('url'),
  readline = require('readline'),
  child_process = require('child_process'),
  path = require('path'),
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  }),
  util = require('util'),
  MathRandom = (Math.floor(Math.random() * (999 - 1 + 1)) + 1),
  headers = {
    'User-Agent': 'mozilla/5.0 (windows nt 10.0; wow64) applewebkit/537.36 (khtml, like gecko) chrome/49.0.2623.112 safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  limitObjectClient = 4,
  limitObjectDb = 2;
var schedule = require('node-schedule');
 
var rule = new schedule.RecurrenceRule();
rule.minute = 5;

//   xvfb-run -a node --harmony app.js 
//   ~/.dropbox-dist/dropboxd

var readFile = fs.readFileSync(__dirname + '/public/task/task.json', 'utf8');

var objectReadFile = JSON.parse(readFile);
    //console.log(objectReadFile);

var deleteFolderRecursive = function(path) {
  console.log('i am delete folder to recursive');
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

deleteFolderRecursive('/home/olga_orlova_gt_96/.config/Electron'); //remove folder Electron

console.log('start core.js')

function walk(currentDirPath, callback) {
  fs.readdir(currentDirPath, function(err, files) {
    if (err) {
      throw new Error(err);
    }
    files.forEach(function(name) {
      var filePath = path.join(currentDirPath, name);
      var stat = fs.statSync(filePath);
      if (stat.isFile()) {
        callback(filePath, stat);
      } else if (stat.isDirectory()) {
        walk(filePath, callback);
      }
    });
  });
}

function compareRandom(a, b) {
  return Math.random() - 0.5;
}

function parseChannelYootube(array, callbackDone) {
  console.log('array -- ', array.search);
  var options = {
    rejectUnauthorized: false,
    method: 'GET',
    headers: headers,
    maxRedirects: 100
  };

  if (array.urlChannel) {
    options['url'] = array.urlChannel;
  }
  request(options, function(err, response, body) {
    if (err) {
      throw err;
    } else {
      var $ = cheerio.load(body),
        sendObjectToClient = [],
        sendObjectToDb = [];
      async.series([
          function(callback) {
            $('ul h3.yt-lockup-title').find('a').slice(array.min, array.max).each(function(i, e) {
              var videos = 'https://www.youtube.com' + $(e).attr('href');
              console.log('scraping links___ - ', videos);
              if (i <= array.maxVideo) {
                sendObjectToClient.push(videos);
              } else {
                sendObjectToDb.push(videos);
              }
            });
            setTimeout(function() {
              callback(null);
            }, 2000);
          },
          function(callback){
            console.log('youtube search');
            console.log(array.search[0]);
            var excludeDomain = [
              'https://www.youtube.com',
              'https://www.facebook.com/'
            ];
            var objectads = {};
            var one = 155000,
                two = 200000;
            async.eachSeries(array.search[0].sort(compareRandom), function(item, callback) {
              console.log('item ',item);
              nightmare
                .useragent('mozilla/5.0 (windows nt 10.0; wow64) applewebkit/537.36 (khtml, like gecko) chrome/49.0.2623.112 safari/537.36')
                .viewport(1350, 709)
                .goto(array.search[1][0])
                .wait(3500)
                .inject('js', 'public/jquery.js')
                .evaluate(function(i) {
                  $('#masthead-search-term').val(i);
                },item)
                .wait(1000)
                .inject('js', 'public/jquery.js')
                .evaluate(function() {
                  $('button.yt-uix-button').click();
                })
                .wait(2000)
                .inject('js', 'public/jquery.js')
                .evaluate(function(){
                  $('a.yt-uix-tile-link')[0].click();
                })
                .wait(19000) 
                //.screenshot('./public/screen/current/1.png')
                
                .inject('js', 'public/jquery.js')
                .evaluate(
                  function() {
                    var doms = [
                      '.text-inner-container a',
                      '.image-container a'
                    ];

                    function removeDoms(elem, callback) {
                      document.querySelector(elem).removeAttribute('target');
                      callback(elem);
                    }

                    function clickADS(elem) {
                      return document.querySelector(elem).click();
                    }

                    function removeTagret(doms, callback) {
                      if (typeof(document.querySelector('.text-inner-container a')) != 'undefined' && document.querySelector('.text-inner-container a') != null) {
                        removeDoms('.text-inner-container a', function() {
                          if (Math.random() < 0.5){
                          clickADS('.text-inner-container a');
                          }
                        });
                      }
                      if (typeof(document.querySelector('.image-container a')) != 'undefined' && document.querySelector('.image-container a') != null) {
                        removeDoms('.image-container a', function() {
                          if (Math.random() < 0.5){
                          clickADS('.image-container a');
                          }
                        });
                      }
                    }

                    removeTagret(doms, function() {
                      for (var c = 0; c < doms.length; c++) {
                        if (typeof(document.querySelector(doms[c])) != 'undefined' && document.querySelector(doms[c]) != null) {
                          if (Math.random() < 0.8){
                          document.querySelector(doms[c]).click();
                          }
                        }
                      }
                    });
                  }
                )
                .wait(29000)
                .wait(29000)
                .wait(29000)
                .inject('js', 'public/jquery.js')
                .evaluate(function(){
                  function getA(callback){
                    $('body').find('a').each(function(i, e) {
                      var href = $(e);
                      linkAds.push(href);
                      console.log(linkAds);
                      callback(underscore.sample(linkAds, 1));
                    });
                  }
                  getA(function(link){
                    $(link[0]).click();
                  });
                })
                .run(function(err, nightmare) {
                    if (err) {
                      throw err;
                    };
                });
            });
          }
        ],
        function(err, results) {
          if (err) {
            throw err;
          }
          callbackDone();
        });
    }
  });
}

//function run(){
  async.eachSeries(objectReadFile.channel, parseChannelYootube, function(err,results){
    console.log('start core.js at 15 hour');
      if (err) {
        throw err;
      }
      console.log('All done');
  });
//}

//setInterval(function(){
  //run();
//},40000000);

/*
setTimeout(function() {
  async.eachSeries(objectReadFile.channel, parseChannelYootube, function(err,results){
    console.log('start core.js at 15 hour');
      if (err) {
        throw err;
      }
      console.log('All done');
  });
}, 300000);
*/
/*
schedule.scheduleJob(rule, function() {
  console.log('start core.js at 15 hour');
  console.log('????????&&&&&&&&&&&&&&&&&&');
  
});
*/

function job(){
  var j = schedule.scheduleJob(rule, function() {
  console.log('start core.js at 15 hour');
  console.log('????????&&&&&&&&&&&&&&&&&&');
  async.eachSeries(objectReadFile.channel, parseChannelYootube, function(err,results){
      if (err) {
        throw err;
      }
      console.log('All done');
      job();
    });
  });
}

function parseADSurl(url, callback) {
  var options = {
      rejectUnauthorized: false,
      url: url,
      method: 'GET',
      headers: headers,
      maxRedirects: 100
    },
    reqUrl = url,
    history = {};
  request(options, function(err, response, body) {
    if (err) {
      throw err;
    } else {
      var $ = cheerio.load(body),
        linkAds = [],
        sampRandom,
        lastVideo;
      console.log('a find links__', $('body').find('a').length);

      $('body').find('a').each(function(i, e) {
        var href = $(e).attr('href') + '';
        var elemHost = urls.parse(reqUrl).hostname;
        var protocol = urls.parse(reqUrl).protocol;

        if (href.split('/').length > 1) {
          if (!href.split('http:')[1]) {
            if (!href.split('https:')[1] && typeof href === 'undefined') {
              linkAds.push(protocol + elemHost + href);
            }else{
              linkAds.push(protocol + elemHost);
            }
          }
        }

        if (reqUrl.split('https:')) {
          if (href.split('http:')[1] || href.split('https:')[1]) {
            linkAds.push(href);
          }
        } else if (reqUrl.split('http:')) {
          if (!href.split('http:')[1] && !href.split('https:')[1]) {
            if (href.split('/').length > 1) {
              linkAds.push(elemHost + href);
            }
          }
        }
        sampRandom = underscore.sample(linkAds, 3);
      });
      history['url' + Math.floor(Math.random() * (999 - 1 + 1)) + 1] = sampRandom;
    }
    callback(underscore.extend({}, sampRandom));
  });
}
