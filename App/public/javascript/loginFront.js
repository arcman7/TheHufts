//Don't need this as of right now, all it does is make the forms appear or dissapear when login or register is clicked
// function navboxListener(){
//   //#login
//   //#register
//   $('.cancel').on("click",function(event){
//     event.preventDefault();
//     if ( $(".active-form") ){
//       $(".active-form").removeClass("active-form");
//     }
//   });

//   $("#login").on("click",function(event){
//     event.preventDefault();
//     $(".active-form").removeClass("active-form");
//     $(".login-form").addClass("active-form");
//     console.log("login clicked");
//   });

//   $("#register").on("click",function(event){
//     event.preventDefault();
//     $(".active-form").removeClass("active-form");
//     $(".register-form").addClass("active-form");
//     console.log("register clicked");
//   });
// }

function encrypt(string,key){
  var encrypted = CryptoJS.AES.encrypt(string,key).toString();
  return encrypted;
}

function decrypt(string,key){
  var decrypted = CryptoJS.AES.decrypt(string, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
}



function formSubmitListener(){
  var confirmation = "TheHufts";
  var gateKeeperURL = "U2FsdGVkX1/TgCOk5cMhFLg/9AnetMh2IYRno+wQGk78aKwkRS39/rop2c/Cm3SpOtrz2UQHSNgZOie01+kZQg==";

  $("#logIn-button").on("click",function(event){
    event.preventDefault();
    console.log("form submitted");
    //var username = $('.login-form input[name="form-email"]').val();
    var email    = $('.login-form input[name="form-email"]').val();
    var password = $('.login-form input[name="form-password"]').val();
        password =  CryptoJS.SHA3(password).toString();
    console.log(password);

    //var data = { username: username, password: password, confirmation: confirmation, login:true};
    var data = { email: email, password: password, confirmation: confirmation, login:true};

    ajaxLoginRouter(data,decrypt(gateKeeperURL,confirmation));
  });

   $("#register-button").on("click",function(event){
    event.preventDefault();
    console.log("form submitted");
    var username = $('.login-form input[name="form-name"]').val();
    var password = $('.login-form input[name="password"]').val();
        password =  CryptoJS.SHA3(password).toString();

    var email    = $('.login-form input[name="form-email"]').val();

    var data = { username: username, password: password, email: email, confirmation: confirmation, login:false};
    ajaxLoginRouter(data,decrypt(gateKeeperURL,confirmation));
  });
}

function ajaxLoginRouter(data,url){
  data = JSON.stringify(data);
  $.ajax({
          url: url,
          type: "get"
      }).
  done(function(response){
    var key = response;
    data = encrypt(data, key);
    var loginURL = "U2FsdGVkX18QPZdMyeLqAkP32qAdsz5D1W4iRNrujhzK7jsbsxqL4Fur1NrXDNfk34cDezQ52BUvIP7WBT71sg==";
    var confirmation = encrypt("TheHufts",key);
    $.ajax({
        url: decrypt(loginURL,"TheHufts"),
        type: "post",
        data: {data: data}
    })
    .done(function(response){
      response = JSON.parse(response);
      if(response["redirect"]){
        window.location.href = response["redirect"];
      }

      if(response == "{error-code:k}"){
        var retryURL = this.url;
        var retryData = this.data;
        ajaxLoginRouter(retryData,retryURL);
      }
    });
  });
}



$(document).on("ready",function(){
  //navboxListener();
  formSubmitListener();
})