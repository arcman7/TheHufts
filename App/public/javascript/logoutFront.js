

function logoutListener(){
  var domain = window.location.href.split('/')[2];
  var username = window.location.href.split('=')[1];
  console.log(username);
  var logOutURL = "http://" + domain + '/logout';
  $('#navbar-collapse').on("click","#signOut", function (e){
     e.preventDefault();
     var data = {domain: domain, username: username};
     $.ajax({
      url: logOutURL,
      data: data,
      type: "post"
     })
     .done(function (response){
        response = JSON.parse(response);
        if(response["redirect"]){
          window.location.href = response["redirect"];
        }
        else{
          console.log(response)
        }
    });//end done function
  });//end on click
}

$(document).ready(logoutListener);