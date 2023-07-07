let uploadButton = document.getElementById
  ("upload");
let chosenImage = document.getElementById
  ("chosen-image");
var resultContainer = document.getElementById('result-container');


resultContainer.style.display = "none"
uploadButton.onchange = () => {
  let reader = new FileReader();
  reader.readAsDataURL(uploadButton.files[0]);
  reader.onload = () => {
    chosenImage.setAttribute("src", reader.result);

  }
}

hideLoadingSpinner()

function showLoadingSpinner() {
  var spinner = document.getElementById('loading-spinner');
  spinner.style.display = 'flex';
}

function hideLoadingSpinner() {
  var spinner = document.getElementById('loading-spinner');
  spinner.style.display = 'none';
}

function displayResponse(response) {
  // Get the result container element
  // resultContainer.style.display = "flex"
  resultContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    background-color: transparent;
    /* Add more styles here */
`;
  resultContainer.style.marginTop = "22px"
  // Clear the container
  resultContainer.innerHTML = '';

  // Create the disease element
  var diseaseElement = document.createElement('p');
  diseaseElement.textContent = 'Disease: ' + response.disease;
  diseaseElement.style.color = 'white';
  diseaseElement.style.marginTop = '7px';

  // Create the accuracy element
  var accuracyElement = document.createElement('p');
  accuracyElement.textContent = 'Accuracy: ' + response.accuracy + " %";
  accuracyElement.style.color = 'white';
  accuracyElement.style.marginTop = '7px';

  // Create the medicine element
  var medicineElement = document.createElement('p');
  medicineElement.textContent = 'Medicine: ' + response.medicine;
  medicineElement.style.color = 'white';
  medicineElement.style.marginTop = '7px';

  // Append the elements to the container
  resultContainer.appendChild(diseaseElement);
  resultContainer.appendChild(accuracyElement);
  resultContainer.appendChild(medicineElement);

  var mapButton = document.createElement("button");
  mapButton.className = "mapButton"; 
  mapButton.innerHTML = "Look for Clinics";
  var body = document.getElementsByTagName("body")[0];
  body.appendChild(mapButton);

  mapButton.addEventListener ("click", function() {
  //window.open(map.html);
  window.open('https://www.google.com/maps/search/Pharmacies');
  });

  //document.getElementById(results).hidden=true;
}

function displayError(message) {
  // Get the error container element
  var errorContainer = document.getElementById('error-container');

  // Set the error message
  // Clear previous error messages
  errorContainer.innerHTML = '';

  // Create the <h4> element
  var errorMessageElement = document.createElement('h4');

  // Apply styles to the <h4> element
  errorContainer.style.marginTop = '55px';
  errorMessageElement.style.color = 'red';
  errorMessageElement.style.backgroundColor = 'transparent';



  errorMessageElement.textContent = message;

  // Append the <h4> element to the error container
  errorContainer.appendChild(errorMessageElement);


}
function submitForm() {
  var form = document.getElementById('uploadForm');
  var formData = new FormData(form);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/detect', true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      alert(xhr.responseText);
    } else {
      alert('Error occurred while uploading the file.');
    }
  };
  xhr.send(formData);
}
function detectFunction() {
  // Show loading spinner
  showLoadingSpinner();

  // Get the form and the selected file
  var form = document.getElementById('uploadForm');
  var fileInput = document.getElementById('upload');

  // Create a FormData object and append the selected file
  var formData = new FormData();
  formData.append('file', fileInput.files[0]);

  // Send a POST request to the server
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/detect', true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Hide loading spinner
      hideLoadingSpinner();

      // Parse the response JSON
      var response = JSON.parse(xhr.responseText);

      // Display the response
      displayResponse(response);
    } else {
      // Hide loading spinner
      hideLoadingSpinner();

      var response = JSON.parse(xhr.responseText);


      // Show an error message
      displayError('Error: ' + response.message);
      setTimeout(() => {
        displayError('');

      }, 1000);
    }
  };
  xhr.send(formData);
}
