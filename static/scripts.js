document.addEventListener("DOMContentLoaded", function () {
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    fetch('/models/')
        .then(response => response.json())
        .then(models => {
            const modelSelect = document.getElementById('model-select');
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.text = model;
                modelSelect.appendChild(option);
            });
        });

    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', function () {
        const fileName = fileInput.files[0].name;
        const nextSibling = fileInput.nextElementSibling;
        nextSibling.innerText = fileName;
        setFeedback("Resim seçildi: " + fileName, "success");
    });
});

function toggleTheme() {
    const body = document.body;
    body.classList.toggle("dark-mode");
    const newTheme = body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
}

function setFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.innerText = message;
    feedback.style.display = 'block';
    feedback.className = type === "success" ? "alert alert-success" : "alert alert-error";
}

function previewImage(event) {
    const fileInput = document.getElementById('file-input');
    const imageUrl = URL.createObjectURL(fileInput.files[0]);
    const uploadedImage = document.getElementById('uploaded-image');
    uploadedImage.src = imageUrl;
    uploadedImage.style.display = 'block';

    uploadedImage.onload = function () {
        const maxWidth = 400;
        const maxHeight = 400;
        let width = uploadedImage.naturalWidth;
        let height = uploadedImage.naturalHeight;

        if (width > height) {
            if (width > maxWidth) {
                height = Math.round((height *= maxWidth / width));
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round((width *= maxHeight / height));
                height = maxHeight;
            }
        }
        uploadedImage.width = width;
        uploadedImage.height = height;
    };
}

async function uploadImage() {
    const fileInput = document.getElementById('file-input');
    const modelSelect = document.getElementById('model-select');
    if (fileInput.files.length === 0) {
        setFeedback("Lütfen bir resim seçin.", "error");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('model_name', modelSelect.value);

    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').innerText = '';
    setFeedback("Resim işleniyor. Lütfen bekleyin...", "success");

    try {
        const response = await fetch('/predict/', {
            method: 'POST',
            body: formData
        });

        document.getElementById('loading').style.display = 'none';

        if (response.ok) {
            const result = await response.json();
            document.getElementById('result').innerText = `Tahmin Edilen Sınıf: ${result.predicted_class}`;
            addToHistory(result.predicted_class);
            setFeedback("Tahmin başarılı!", "success");
        } else {
            const error = await response.json();
            document.getElementById('result').innerText = `Hata: ${error.detail}`;
            setFeedback("Tahmin başarısız. " + error.detail, "error");
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('result').innerText = `Hata: ${error.message}`;
        setFeedback("Bir hata oluştu: " + error.message, "error");
    }
}

function addToHistory(predictedClass) {
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.innerText = `Sınıf: ${predictedClass}`;
    historyList.appendChild(listItem);
}

async function uploadModel() {
    const modelFileInput = document.getElementById('model-file-input');
    const modelFeedback = document.getElementById('model-feedback');

    if (modelFileInput.files.length === 0) {
        modelFeedback.innerHTML = 'Lütfen bir model dosyası seçin.';
        modelFeedback.style.display = 'block';
        modelFeedback.className = 'alert alert-danger';
        return;
    }

    const formData = new FormData();
    formData.append('model_file', modelFileInput.files[0]);

    try {
        const response = await fetch('/upload_model/', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            modelFeedback.innerHTML = 'Model başarıyla yüklendi!';
            modelFeedback.className = 'alert alert-success';
            setTimeout(() => {
                location.reload();
            }, 1000);  // 1 saniye bekledikten sonra sayfayı yeniler
        } else {
            const error = await response.json();
            modelFeedback.innerHTML = 'Model yükleme başarısız. ' + error.detail;
            modelFeedback.className = 'alert alert-danger';
        }

        modelFeedback.style.display = 'block';
    } catch (error) {
        modelFeedback.innerHTML = 'Bir hata oluştu: ' + error.message;
        modelFeedback.className = 'alert alert-danger';
        modelFeedback.style.display = 'block';
    }
}
