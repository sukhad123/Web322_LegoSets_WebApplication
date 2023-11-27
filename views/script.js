document.addEventListener("DOMContentLoaded", () => {

    // Fetch the data from the quotable API
    fetch("https://api.quotable.io/random")
    .then(response => response.json())
    .then(data => {
       // Update the DOM with the fetched data
       document.getElementById("quote-content").innerText = data.content;
       document.getElementById("quote-author").innerText = "- " + data.author;
    })
    .catch(error => console.error("Error fetching data:", error));
    });