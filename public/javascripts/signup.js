$(document).ready(function(){
    $('#signupform').submit(function (event) {
       event.preventDefault();
       $.ajax({
         url: '/users/signup',
         method: 'POST',
         data: $(this).serialize(),
         success: function (data) {
           
            alert(data.message)
         },
         error: function (error) {
            console.log("error===>", error);
           alert(error.responseJSON.message)
         }
       });
     });
     })