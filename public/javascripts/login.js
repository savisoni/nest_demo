$(document).ready(function () {
    $("#login-form").submit(function (e) {
        e.preventDefault();

        const email = $('input[name="email"]').val();
        const password = $('input[name="password"]').val();
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
console.log("cartdara-------->", cartData);
        $.ajax({
            url: '/users/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password,cartData}),
            success: function (data) {
              window.location.href ="/products";
              localStorage.removeItem('cart');

            },
            error: function (error) {
              console.error('Error:', error);
              alert(error.responseJSON.message)
            }
          });
        });


})