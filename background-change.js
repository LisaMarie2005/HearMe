const fileInput = document.getElementById('bg'); //fetch the file input element where user submits the image
const submitButton = document.getElementById('submit'); // get the submit button

submitButton.addEventListener('click', handleFormSubmit); //when the submit button gets clicked call the function handleFormSubmit

function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const file = fileInput.files[0]; //gets the first file submitted by the user

    if (file) {
        const image = new Image();
        image.src = URL.createObjectURL(file); //creates a temporary url to be used to display the image

        image.onload = function() {   //when the image is loaded

            document.body.style.backgroundImage = `url(${image.src})`; //change the background image of the body to the image submitted by the user
            document.body.style.backgroundSize = '100% 100%'; //make the background image fit the entire body
            document.body.style.backgroundPosition = 'center'; //center the background image
            document.body.style.backgroundRepeat = 'no-repeat'; //do not repeat the background image
        };
    } 
}