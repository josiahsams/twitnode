
var twit = require('twit');
var config = require('./config.js');
var fs = require('fs')
const tempfile = require('tempfile');
const request = require('request');
const cheerio = require('cheerio')

var Twitter = new twit(config);

var MonitorTweet = function(){
  var stream = Twitter.stream('statuses/filter', { track: '#DemoPowerAI', language: 'en' })

  stream.on('tweet', function (tweet) {
//      console.log(tweet);
      console.log("User : " + tweet.user.name);
      ttext = tweet.text;
      console.log("Text : " + ttext);
      url = ttext.match(/(http*[^\n|^ ]*)/g);

      if (typeof(url) != 'undefined' && url != null) {
          url = url[0];
          console.log("URL : " + url);
          request(url, { json: false }, (err, res, body) => {
            if (err) { return console.log(err); }
            const $ = cheerio.load(body);
            imgurl = $('div .AdaptiveMedia-photoContainer').attr('data-image-url');
            if (typeof(imgurl) != 'undefined' && imgurl != null) {
                extn = imgurl.split('.').pop();
                filename = tempfile('.'+extn);
            } else {
                imgurl = url;
                filename = tempfile('.jpg');
            }

            console.log("Img URL : " + imgurl);
            request.head(imgurl, function(err, res, body){
                contyp = res.headers['content-type']
                console.log('content-type:', res.headers['content-type']);
                if (contyp.match("image")) {
                    request(imgurl).pipe(fs.createWriteStream(filename)).on('close', function(){
                      console.log('File Downloaded to ' + filename);
                    });
                } else {
                    console.log("Not an image");
                }
            });
        });
      } else {
          console.log("Unable to detect URL in the text");
      }
  })
}

MonitorTweet();
