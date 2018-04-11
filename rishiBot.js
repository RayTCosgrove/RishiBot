console.log('The bot is starting');
var Twit = require('twit');
var config = require('./config');
var fs = require('fs');
var responses = require("./responses.json");
var T = new Twit(config);
var userStream = T.stream('user');

userStream.on('follow', followed);
userStream.on('tweet', mentioned);

function tweeted(err, data, response){
	if(err){
		console.log(err);
	}
	else{
		console.log('It worked!');
	}
}

function mentioned(tweetEvent){
	//filesystem module
		//var fs = require('fs');
	//javascript object to text
		//var json = JSON.stringify(tweet,null,2);
	//writes it to a file
		//fs.writeFile("tweet.json", json);
		var replied = false;
		var replyTo = tweetEvent.in_reply_to_screen_name;
		var text = tweetEvent.text.toUpperCase();
		var from = tweetEvent.user.screen_name;
		var fromName = tweetEvent.user.name;
		
		console.log(replyTo + ' ' + from);

		if(replyTo === 'RishiBot'){
			if(from === 'thomas_walsh13' || from === 'seapathil' || from === 'RayTCosgrove'){
				var friendReply = '@' + from + ' shut up ' + fromName.substring(0,fromName.indexOf(' '));
				tweetIt(friendReply);
			}
			else if(text.search(responses.replies[0].keyword)!==-1){
				var picReply = '@' + from + responses.replies[1].response;
				var filename = 'rishiPics/rishi' + Math.floor(Math.random()*5) + '.png';		
				var params = {
					encoding: 'base64'
				}

				var b64 = fs.readFileSync(filename, params);

				T.post('media/upload',{media_data: b64}, uploaded);

				function uploaded(err,data,response){

					var tweet = {
						status: picReply,
						media_ids: [data.media_id_string]
					}
					T.post('statuses/update',tweet,tweeted)
					replied = true;

				}


			}

		
		else if(text.search('LOVE')!==-1){
			var filename = 'rishiPics/patty.jpg';
			//console.log(filename);
			var params = {
				encoding: 'base64'
			}
			var b64 = fs.readFileSync(filename, params);

			T.post('media/upload',{media_data: b64}, uploaded);

			function uploaded(err,data,response){
				//var id = data.media_id_string;
				var tweet = {
					status: '@' + from + ' I only love patricia ;)',
					media_ids: [data.media_id_string]
				}
				T.post('statuses/update',tweet,tweeted)
				replied = true;
			}
		}
		else{
			
			for(var i = 1; i<responses.replies.length; i++)
			{
				if(text.search(responses.replies[i].keyword)!==-1){
					var tweet = {
						status: '@' + from + " " + responses.replies[i].response

					} 
					T.post('statuses/update', tweet, tweeted);
					
					replied = true;
					break;
				}
			}
			if(!replied){

				if(text.search('\\?')!==-1){
				var genericReply = '@' + from + " " + responses.genericQ[(Math.floor(Math.random() * responses.genericQ.length))].response;
				tweetIt(genericReply);
				}
				else{
				var genericReply = '@' + from + " " + responses.generic[(Math.floor(Math.random() * responses.generic.length))].response;
				tweetIt(genericReply);
				}
			}
		}

	}

}
function followed(eventMsg){
	var name = eventMsg.source.name;
	var screenName = eventMsg.source.screen_name;
	var followText = '@' + screenName +'"Hellll yeaahh," thanks for the follow!';

	tweetIt(followText);
}

function tweetIt(txt){
	var tweet = {
		status: txt
	}
	T.post('statuses/update', tweet, tweeted);
}
//	tweetWelcome(welcomeText,tweeted);

