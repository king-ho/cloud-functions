/**
 * Google Cloud Function that responds to messages sent from a
 * Hangouts Chat room.
 *
 * @param {Object} req Request sent from Hangouts Chat room
 * @param {Object} res Response to send back
 */
exports.getTips = function getTips (req, res) {
  
  const BigQuery = require('@google-cloud/bigquery');
  const bq = BigQuery({
      projectId: "gpi-it-1225"
  });
  const datasetId = "tipsdata";
  const tableId = "tips";
  
  bq.dataset(datasetId).table(tableId).getRows().then(function(data) {
    var content = "";
    for(var i = 0 ; i < data[0].length ; i++){
      //content = content + "<div class='card'><p>"+data[0][i].message+"</p><img src='"+data[0][i].image+"' alt=''>by "+data[0][i].sender+"</div>";
      content = content + "<div class='grid-item'> <span class='bywhom'>by "+data[0][i].sender+"</span> <p>"+data[0][i].message+"</p><img src='"+data[0][i].image+"' alt=''> </div>"
    }
    //res.send("<!DOCTYPE html><html><head> <meta charset='utf-8'> <title>Daves Tips</title> <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'> <style>*{font-family: 'Roboto', sans-serif;}div{display: inline-block;}</style></head><body>"+content+"</body></html>");
    res.send("<!DOCTYPE html><html><head> <meta charset='utf-8'> <title>Daves Tips</title> <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'> <script src='https://code.jquery.com/jquery-3.3.1.min.js' integrity='sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=' crossorigin='anonymous'></script> <script src='https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js'></script> <style>*{font-family: 'Roboto', sans-serif; font-size: 18px; width: 100%; margin: 0;}body{background: rgba(40, 30, 20, 0.2);}h3{background: rgba(20, 45, 180, 1); color: white;}.grid{padding-left: 10px;}.grid-item{width: 400px; background: rgba(180, 45, 20, 1); margin-bottom: 10px; color: white}.grid-item p{margin: 10px;}.grid-item img{width: 25%; float: right;}.bywhom{font-style: italic; font-size: 12px;}</style></head><body> <h3>Daves Tips : Tips collected from talking to @dave on Hangouts Chats</h3> <br><div class='grid'>"+content+"</div><script type='text/javascript'> $('.grid').masonry({itemSelector: '.grid-item', columnWidth: 200, gutter: 5}); </script></body></html>");
    console.log("api errors : " + JSON.stringify(apiResponse.insertErrors));
  }).catch(function(err) {
    // An API error or partial failure occurred.
    console.log("err : " + JSON.stringify(err));
  });
  
  
};
