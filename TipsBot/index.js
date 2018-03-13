/**
 * Google Cloud Function that responds to messages sent from a
 * Hangouts Chat room.
 *
 * @param {Object} req Request sent from Hangouts Chat room
 * @param {Object} res Response to send back
 */
exports.tipsBot = function tipsBot (req, res) {
  const https = require('https');
  // Imports the Google Cloud client library
  const BigQuery = require('@google-cloud/bigquery');
  const bq = BigQuery({
      projectId: "gpi-it-1225"
  });
  const datasetId = "tipsdata";
  const tableId = "tips";
  
  var sender = req.body.message.sender.displayName;
  var image = req.body.message.sender.avatarUrl;
  var msg = req.body.message.text.replace("@Dave ","");
  var card = createMessage(sender, image, msg);
  
  var tobq = {"sender":sender,"image":image,"message":msg};
  
  bq.dataset(datasetId).table(tableId).insert(tobq).then(function(data) {
    var apiResponse = data[0];
    console.log("api errors : " + JSON.stringify(apiResponse));
    res.send(card);
  }).catch(function(err) {
    // An API error or partial failure occurred.
    console.log("err : " + JSON.stringify(err));
    res.send("error occured");
  });
  
  
};

/**
 * Creates a card with two widgets.
 * @param displayName the sender's display name
 * @param imageURL the URL for the sender's avatar
 */
function createMessage(displayName, imageURL, msg){
  var HEADER = {
    "title": "Thank you " + displayName + " for your tip! Head over to https://us-central1-gpi-it-1225.cloudfunctions.net/getTips to see yours and more!"
  };

  var SENDER_IMAGE_WIDGET = {
    "imageUrl": imageURL
  };

  return {
  "cards": [
    {
      "header": {
        "title": "Thanks for your Tip "+displayName+"!",
        "subtitle": "Remember to @Dave to add more tips!"
      },
      "sections": [
        {
          "widgets": [
            {
              "textParagraph": {
                "text": msg
              }
            },
            {
              "buttons": [
                {
                  "textButton": {
                    "text": "Click here to see all tips",
                    "onClick": {
                      "openLink": {
                        "url": "https://us-central1-gpi-it-1225.cloudfunctions.net/getTips"
                      }
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
}
