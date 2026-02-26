const fileInput = document.getElementById('bg');
const submitButton = document.getElementById('submit');

console.log(fileInput.files);
submitButton.addEventListener('click', handleFormSubmit);

function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const file = fileInput.files[0];

    if (file) {
        const image = new Image();
        image.src = URL.createObjectURL(file);

        image.onload = function() {

            document.body.style.backgroundImage = `url(${image.src})`;
            document.body.style.backgroundSize = '100% 100%';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
        };
    } 
}