$(document).ready(function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    $.ajax({
        type: "POST",
        url: "/local",
        contentType: "application/json", 
        data: JSON.stringify({ cart }),
        success: function (response) {
            alert("Success");
            location.href = "/local";
        },
        error: function (error) {
            console.error("Error:", error);
        }
    });
});