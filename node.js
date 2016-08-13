var express = require('express');
var app = express();

app.get('/', function (req, res) {

  var OAuth = require('oauth-request');

var twitter = OAuth({
    consumer: {
        public: 'zyiAgV9Jbea1BSrpVPFl0w',
        secret: 's-jcY90vXvG9UOx8pYE8g0WOosw'
    }
});

twitter.setToken({
    public: 'vfZcastyjgwkfXaDKtczSLY8JVBW943B',
    secret: 'F8-P5ZsXTkhEH_brQfVdeZAPLDs'
});

//list user timeline
twitter.get('https://api.yelp.com/v2/search?location=New York&deals_filter=true', function(err, thing, tweets) {
    res.send(tweets);
});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
