// Function to calculate total price
function calculateTotalPrice() {
    var totalPrice = 0;

    // Iterate through each room and calculate total price
    document.querySelectorAll('.room').forEach(function(room) {
        var roomCount = parseInt(room.querySelector('.room-count').value);
        var roomPrice = parseFloat(room.querySelector('.room-count').getAttribute('data-price'));
        totalPrice += roomCount * roomPrice;
    });

    // Update total price
    document.getElementById('total-price').innerText = "Total Price: $" + totalPrice.toFixed(2) + " NZD";
}

// Event listener for room count change
document.querySelectorAll('.room-count').forEach(function(select) {
    select.addEventListener('change', calculateTotalPrice);
});

// Event listener for confirm button
document.getElementById('confirm-button').addEventListener('click', function() {
    alert("Total Price: $" + parseFloat(document.getElementById('total-price').innerText.split(' ')[2]).toFixed(2) + " NZD");
});

// Initial calculation
calculateTotalPrice();
