document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('image-input').addEventListener('change', function() {
        var reader = new FileReader();
        reader.onload = function(e) {
            var imgPreview = document.getElementById('image-preview');
            imgPreview.innerHTML = '';
            var imgElement = document.createElement('img');
            imgElement.src = e.target.result; 
            imgElement.style.maxWidth = '400px';
            imgElement.style.maxHeight = '400px';
            imgPreview.appendChild(imgElement);
        };

        if(this.files[0]) {
            reader.readAsDataURL(this.files[0]);
            
        }
    });


    document.getElementById('upload-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', document.getElementById('image-input').files[0]);

        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            document.getElementById('prediction-result').innerText =
                'Predicted Class: ' + data.class_name + '\n Probability: ' + data.probability;
        } catch (error) {
            console.error('Error during fetch: ', error);
            document.getElementById('prediction-result').innerText = 'Error: ' + error.message;
        }
    });
});
