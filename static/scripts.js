document.addEventListener("DOMContentLoaded", function () {
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
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
    if (fileInput.files.length === 0) {
        setFeedback("Lütfen bir resim seçin.", "error");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

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
            document.getElementById('result').innerText = `Tahmin Edilen Sınıf: ${result.predicted_class} (Güven: ${result.confidence.toFixed(2)}%)`;
            addToHistory(result.predicted_class, result.confidence.toFixed(2));
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

function addToHistory(predictedClass, confidence) {
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.innerText = `Sınıf: ${predictedClass} (Güven: ${confidence}%)`;
    historyList.appendChild(listItem);
}
