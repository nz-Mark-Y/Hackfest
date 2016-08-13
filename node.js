var express = require('express');
var app = express();
var OAuth = require('oauth-request');

app.get('/getdealsforlocation', function (req, res) {
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
  function filterData(data) {
    //console.log('data', data);
    var filteredData = [];
    var businesses = data.businesses;
    businesses.map(function(business){
        var newObject = {};
        newObject.name = business.name;
        newObject.deals = business.deals;
        newObject.address = business.location.display_address;
        newObject.coordinates = business.location.coordinate
        filteredData.push(newObject);
    });
    return filteredData;

  }
//list user timeline
  twitter.get('https://api.yelp.com/v2/search?cll='+ req.query.lat + ',' + req.query.lon +'&location=' + req.query.location + '&deals_filter=true&term=food&radius_filter='+req.query.radius_filter, function(err, thing, data) {
    res.setHeader('Content-Type','application/json');
    //console.log('thing', data.businesses);
    //console.log('total', data.total);
    //console.log(thing);
      var filteredData = filterData(JSON.parse(data))//(data);
      res.send(filteredData);//data);
  });
});




app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
