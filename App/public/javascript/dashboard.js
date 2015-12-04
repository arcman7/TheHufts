$(document).on("ready",function(){
  $('.test-link').on("click", function(e){
    e.preventDefault();
    console.log("clicked")
    $('.profit-row').hide());
  })
})
