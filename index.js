//
//  RTD2 - Twitter bot that tweets about the most popular github.com news
//  Also makes new friends and prunes its followings.
//
var Bot = require('./bot')
  , config1 = require('./config');

var bot = new Bot(config1);

var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('Mr Bennett is twitter famous! https://twitter.com/officiaibennett');
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express is running on port " + port);

console.log('Mr Bennett is online!');

//get date string for today's date (e.g. '2011-01-01')
function datestring () {
  var d = new Date(Date.now() - 5*60*60*1000);  //est timezone
  return d.getUTCFullYear()   + '-'
     +  (d.getUTCMonth() + 1) + '-'
     +   d.getDate();
};

setInterval(function() {
  bot.twit.get('followers/ids', function(err, reply) {
    if(err) return handleError(err)
    console.log('\n# followers:' + reply.ids.length.toString());
  });
  var rand = Math.random();

    if(rand <= 0.04) {//make a retweet
    var params = {
        q: "&#34;mr bennett&#34; -filter:replies"
      , since: datestring()
      //, result_type: "mixed"
	  , lang: "en"
    };
 
    bot.retweet(params, function(err, reply) {
      if(err) return handleError(err);
      console.log("\nRetweet: retweeted response: " + reply.id);
    });
}
	
    else if(rand <= 0.52) {// make a friend
    bot.mingle(function(err, reply) {
      if(err) return handleError(err);

      var name = reply.screen_name;
      console.log('\nMingle: followed @' + name);
    });
  } else {// prune a friend
    bot.prune(function(err, reply) {
      if(err) return handleError(err);

      var name = reply.screen_name;
      console.log('\nPrune: unfollowed @'+ name);
    });
  }
}, 350001);

function handleError(err) {
  console.error('response status:', err.statusCode);
  console.error('data:', err.data);
}

var http = require("http");
setInterval(function() {
    http.get("http://mr-bennett.herokuapp.com");
}, 600000);