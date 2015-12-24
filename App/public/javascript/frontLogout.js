

function logoutListener(){
  var domain = window.location.href.split('/')[2];
  var logOutURL = "http://" + domain + '/logout';
  $('#navbar-collapse').on("click","#signOut", function (e){
     e.preventDefault();
     $.ajax({
      url: logOutURL,
      data: {domain: domain},
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