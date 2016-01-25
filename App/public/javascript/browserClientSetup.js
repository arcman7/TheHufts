function randomString(length, chars) {
  var mask = '';
  if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
  if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.indexOf('#') > -1) mask += '0123456789';
  if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
  var result = '';
  for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
  return result;
}

function initializeCoderPadWithDemo(){
  var username = String(window.location).split('=')[1];
  var url = protocol + "//" + domain + "/passAlgoFile";

  var data = { username: username, algoName: 'psychicDemo', demo: true};
    var request = $.ajax({
      url: url,
      type: "post",
      data: data
    });

    request.done(function (response){
      //console.log('done');
      //console.log(response);
      //console.log("key: ", window.access_key);
      response = JSON.parse(response);
      var fileType = response.fileType;
      var text = decrypt(response.algoFile, window.access_key);
        //set text-area for code pad to be generated from
      $('#code1').text(text);
      $('.codemirror').remove();
        //update codemirror pad
      var newCodeMirror = CodeMirror.fromTextArea(document.getElementById('code1'), {
          mode: "javascript",
          theme: "default",
          lineNumbers: true,
          readOnly: true
      });  //end codemirror
      newCodeMirror.setSize(800, 900);
      });//end done function

    request.fail(function (error){
      console.log(error);
    });
}

function setBrowserKey(){
  window.access_key = randomString(77,"aA#");
  var url = protocol+ '//' + domain + '/setBrowserKey';

  var username = String(window.location).split('=')[1];

  var data = { browserKey: window.access_key, domain: domain, protocol: protocol, username: username };
  var gateKeeperURL = protocol + "//" + domain + "/gateKeeper/knockKnock";

  $.ajax({
    url: url,
    type: "post",
    data: data
  }).done(function (response){
    console.log(response);
    initializeCoderPadWithDemo()
  });
}

$(document).on("ready",function(){
  setBrowserKey();
});