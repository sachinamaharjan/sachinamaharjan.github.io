const adWrapper = document.getElementById('adWrapper');
const studentInfo = document.querySelector('.studentInfo'); // More robust selector

function handleError(image) {
  // Handle image loading error (e.g., display a placeholder image)
  image.src = "./assets/placeholder.jpg"; // Replace with your placeholder
