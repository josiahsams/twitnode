
var fs = require('fs')
const tempfile = require('tempfile');
const request = require('request');
const cheerio = require('cheerio')

ttext = 'https://t.co/opZwPogCeJ\n\n#DemoPowerAI its working'
ttext = 'RT @josiah_test: Tell me how does it work .. https://t.co/dksWMJvibC #DemoPowerAI'
console.log(ttext.match(/(http*[^\n|^ ]*)/g)[0]);
url = ttext.match(/(http*[^\n|^ ]*)/g)[1];
url = 'https://t.co/HzZ0NHI7hR';
url = 'https://t.co/opZwPogCeJ';
url = 'https://pbs.twimg.com/media/DXRrxzIXUAApiCV.jpg'
url = 'https://t.co/Ofi96m1Xz'

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


