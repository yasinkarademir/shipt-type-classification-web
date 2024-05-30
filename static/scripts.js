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

let scale = 1;
const scaleStep = 0.1;
const maxScale = 3;
let minScale = 1;
let isDragging = false;
let startX, startY, initialX = 0, initialY = 0;

function zoomIn() {
    const uploadedImage = document.getElementById('uploaded-image');
    if (scale < maxScale) {
        scale += scaleStep;
        uploadedImage.style.transform = `scale(${scale})`;
        uploadedImage.style.cursor = 'grab';
    }
}

function zoomOut() {
    const uploadedImage = document.getElementById('uploaded-image');
    if (scale > minScale) {
        scale -= scaleStep;
        uploadedImage.style.transform = `scale(${scale})`;
        if (scale === 1) {
            uploadedImage.style.cursor = 'default';
            uploadedImage.style.left = '0px';
            uploadedImage.style.top = '0px';
            initialX = 0;
            initialY = 0;
        }
    }
}

function previewImage(event) {
    const fileInput = document.getElementById('file-input');
    const imageUrl = URL.createObjectURL(fileInput.files[0]);
    const uploadedImage = document.getElementById('uploaded-image');
    const imageContainer = document.getElementById('image-container');
    const zoomButtons = document.getElementById('zoom-buttons');

    uploadedImage.src = imageUrl;
    uploadedImage.style.display = 'block';
    imageContainer.style.display = 'block';
    zoomButtons.style.display = 'block';

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
        uploadedImage.style.width = width + 'px';
        uploadedImage.style.height = height + 'px';
        scale = 1;
        minScale = 1;
        uploadedImage.style.transform = `scale(${scale})`;
        uploadedImage.style.left = '0px';
        uploadedImage.style.top = '0px';
        initialX = 0;
        initialY = 0;
        uploadedImage.style.cursor = 'default';
    };

    addDragAndDropFunctionality();
}

function addDragAndDropFunctionality() {
    const uploadedImage = document.getElementById('uploaded-image');
    const imageContainer = document.getElementById('image-container');

    uploadedImage.addEventListener('mousedown', (e) => {
        if (scale > 1) {
            isDragging = true;
            startX = e.clientX - initialX;
            startY = e.clientY - initialY;
            uploadedImage.style.cursor = 'grabbing';
        }
    });

    uploadedImage.addEventListener('mouseup', () => {
        isDragging = false;
        if (scale > 1) {
            uploadedImage.style.cursor = 'grab';
        } else {
            uploadedImage.style.cursor = 'default';
        }
        initialX = parseInt(uploadedImage.style.left || 0, 10);
        initialY = parseInt(uploadedImage.style.top || 0, 10);
    });

    uploadedImage.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.clientX - startX;
        const y = e.clientY - startY;
        uploadedImage.style.left = `${x}px`;
        uploadedImage.style.top = `${y}px`;
    });

    uploadedImage.addEventListener('mouseleave', () => {
        isDragging = false;
        if (scale > 1) {
            uploadedImage.style.cursor = 'grab';
        } else {
            uploadedImage.style.cursor = 'default';
        }
        initialX = parseInt(uploadedImage.style.left || 0, 10);
        initialY = parseInt(uploadedImage.style.top || 0, 10);
    });
}


const shipDescriptions = {
    '001.Nimitz-class_aircraft_carrier': 'Nimitz sınıfı uçak gemisi, ABD Deniz Kuvvetleri\'ne ait büyük ve nükleer enerjili bir uçak gemisidir.',
    '002.KittyHawk-class_aircraft_carrier': 'Kitty Hawk sınıfı uçak gemisi, ABD Deniz Kuvvetleri için inşa edilen geleneksel tahrikli bir uçak gemisidir.',
    '003.Midway-class_aircraft_carrier': 'Midway sınıfı uçak gemisi, II. Dünya Savaşı sonrasında ABD Deniz Kuvvetleri tarafından kullanılan büyük bir uçak gemisidir.',
    '004.Kuznetsov-class_aircraft_carrier': 'Kuznetsov sınıfı uçak gemisi, Rusya tarafından kullanılan ağır uçak taşıyıcı kruvazördür.',
    '005.Charles_de_Gaulle_aircraft_carrier': 'Charles de Gaulle uçak gemisi, Fransız Deniz Kuvvetleri\'ne ait nükleer enerjili bir uçak gemisidir.',
    '006.INS_Virrat_aircraft_carrier': 'INS Virrat uçak gemisi, Hindistan Deniz Kuvvetleri tarafından kullanılan eski bir uçak gemisidir.',
    '007.INS_Vikramaditya_aircraft_carrier': 'INS Vikramaditya uçak gemisi, Hindistan Deniz Kuvvetleri\'ne ait modern bir uçak gemisidir.',
    '008.Ticonderoga-class_cruiser': 'Ticonderoga sınıfı kruvazör, ABD Deniz Kuvvetleri\'ne ait güdümlü füze kruvazörüdür.',
    '009.Arleigh_Burke-class_destroyer': 'Arleigh Burke sınıfı muhrip, ABD Deniz Kuvvetleri\'ne ait modern ve çok amaçlı bir muhriptir.',
    '010.Akizuki-class_destroyer': 'Akizuki sınıfı muhrip, Japon Deniz Öz Savunma Kuvvetleri\'ne ait hava savunma muhribidir.',
    '011.Asagiri-class_destroyer': 'Asagiri sınıfı muhrip, Japon Deniz Öz Savunma Kuvvetleri\'ne ait eski bir muhriptir.',
    '012.Kidd-class_destroyer': 'Kidd sınıfı muhrip, ABD Deniz Kuvvetleri tarafından kullanılan güdümlü füze muhribidir.',
    '013.Type_45_destroyer': 'Type 45 sınıfı muhrip, Birleşik Krallık Kraliyet Donanması\'na ait modern bir hava savunma muhribidir.',
    '014.Wasp-class_assault_ship': 'Wasp sınıfı hücum gemisi, ABD Deniz Kuvvetleri\'ne ait amfibi hücum gemisidir.',
    '015.Osumi-class_landing_ship': 'Osumi sınıfı çıkarma gemisi, Japon Deniz Öz Savunma Kuvvetleri\'ne ait amfibi çıkarma gemisidir.',
    '016.Hyuga-class_helicopter_destroyer': 'Hyuga sınıfı helikopter muhribi, Japon Deniz Öz Savunma Kuvvetleri\'ne ait helikopter taşıyıcı muhriptir.',
    '017.Lzumo-class_helicopter_destroyer': 'Izumo sınıfı helikopter muhribi, Japon Deniz Öz Savunma Kuvvetleri\'ne ait büyük helikopter taşıyıcı muhriptir.',
    '018.Whitby_Island-class_dock_landing_ship': 'Whitby Island sınıfı havuz çıkarma gemisi, ABD Deniz Kuvvetleri\'ne ait amfibi çıkarma gemisidir.',
    '019.San_Antonio-class_transport_dock': 'San Antonio sınıfı nakliye havuz gemisi, ABD Deniz Kuvvetleri\'ne ait modern amfibi nakliye havuz gemisidir.',
    '020.Freedom-class_combat_ship': 'Freedom sınıfı savaş gemisi, ABD Deniz Kuvvetleri\'ne ait küçük ve çok amaçlı bir savaş gemisidir.',
    '021.Independence-class_combat_ship': 'Independence sınıfı savaş gemisi, ABD Deniz Kuvvetleri\'ne ait trimaran tasarımlı çok amaçlı bir savaş gemisidir.',
    '022.Sacramento-class_support_ship': 'Sacramento sınıfı destek gemisi, ABD Deniz Kuvvetleri\'ne ait hızlı muharebe destek gemisidir.',
    '023.Crane_ship': 'Vinç gemisi, büyük ve ağır yükleri kaldırmak için kullanılan özel donanımlı bir gemidir.',
    '024.Abukuma-class_frigate': 'Abukuma sınıfı fırkateyn, Japon Deniz Öz Savunma Kuvvetleri\'ne ait küçük savaş gemisidir.',
    '025.Megayacht': 'Mega yat, lüks ve büyük boyutlu bir yat türüdür.',
    '026.Cargo_ship': 'Yük gemisi, ticari mal taşımacılığı için kullanılan büyük gemidir.',
    '027.Murasame-class_destroyer': 'Murasame sınıfı muhrip, Japon Deniz Öz Savunma Kuvvetleri\'ne ait modern çok amaçlı muhriptir.',
    '028.Container_ship': 'Konteyner gemisi, standart boyutlu konteynerlerin taşınması için özel olarak tasarlanmış bir gemidir.',
    '029.Towing_vessel': 'Römorkör, diğer gemileri çekmek veya itmek için kullanılan güçlü motorlu bir gemidir.',
    '030.Civil_yacht': 'Sivil yat, kişisel veya ticari kullanım için tasarlanmış özel bir deniz taşıtıdır.',
    '031.Medical_ship': 'Tıbbi gemi, denizde sağlık hizmetleri sunmak için donatılmış özel bir gemidir.',
    '032.Sand_carrier': 'Kum taşıyıcı, kum ve benzeri dökme yüklerin taşınması için kullanılan gemidir.',
    '033.Tank_ship': 'Tank gemisi, sıvı yüklerin taşınması için özel olarak tasarlanmış büyük gemidir.',
    '034.Garibaldi_aircraft_carrier': 'Garibaldi uçak gemisi, İtalyan Deniz Kuvvetleri\'ne ait küçük bir uçak gemisidir.',
    '035.Zumwalt-class_destroyer': 'Zumwalt sınıfı muhrip, ABD Deniz Kuvvetleri\'ne ait gelişmiş teknolojiye sahip bir muhriptir.',
    '036.Kongo-class_destroyer': 'Kongo sınıfı muhrip, Japon Deniz Öz Savunma Kuvvetleri\'ne ait Aegis savaş sistemine sahip bir muhriptir.',
    '037.Horizon-class_destroyer': 'Horizon sınıfı muhrip, Fransız ve İtalyan deniz kuvvetlerine ait hava savunma muhripleridir.',
    '038.Atago-class_destroyer': 'Atago sınıfı muhrip, Japon Deniz Öz Savunma Kuvvetleri\'ne ait Aegis savaş sistemine sahip modern bir muhriptir.',
    '039.Mistral-class_amphibious_assault_ship': 'Mistral sınıfı amfibi hücum gemisi, Fransız Deniz Kuvvetleri\'ne ait amfibi hücum ve helikopter taşıyıcı gemidir.',
    '040.Juan_Carlos_I_Strategic_Projection_Ship': 'Juan Carlos I Stratejik Projeksiyon Gemisi, İspanyol Deniz Kuvvetleri\'ne ait çok amaçlı amfibi hücum gemisidir.',
    '041.Maestrale-class_frigate': 'Maestrale sınıfı fırkateyn, İtalyan Deniz Kuvvetleri\'ne ait küçük çok amaçlı savaş gemisidir.',
    '042.San_Giorgio-class_transport_dock': 'San Giorgio sınıfı nakliye havuz gemisi, İtalyan Deniz Kuvvetleri\'ne ait amfibi çıkarma gemisidir.'
};

async function uploadImage() {
    const fileInput = document.getElementById('file-input');
    const modelSelect = document.getElementById('model-select');
    const resultElement = document.getElementById('result');
    const shipDescriptionElement = document.getElementById('ship-description');

    if (fileInput.files.length === 0) {
        setFeedback("Lütfen bir resim seçin.", "error");
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('model_name', modelSelect.value);

    document.getElementById('loading').style.display = 'block';
    resultElement.innerText = '';
    shipDescriptionElement.style.display = 'none';
    setFeedback("Resim işleniyor. Lütfen bekleyin...", "success");

    try {
        const response = await fetch('/predict/', {
            method: 'POST',
            body: formData
        });

        document.getElementById('loading').style.display = 'none';

        if (response.ok) {
            const result = await response.json();
            const predictedClass = result.predicted_class;
            resultElement.innerText = `Tahmin Edilen Sınıf: ${predictedClass}`;
            addToHistory(predictedClass);

            // Gemi açıklamasını göster
            const description = shipDescriptions[predictedClass];
            if (description) {
                shipDescriptionElement.innerText = `Açıklama: ${description}`;
                shipDescriptionElement.style.display = 'block';
            } else {
                shipDescriptionElement.innerText = '';
                shipDescriptionElement.style.display = 'none';
            }

            setFeedback("Tahmin başarılı!", "success");
        } else {
            const error = await response.json();
            resultElement.innerText = `Hata: ${error.detail}`;
            setFeedback("Tahmin başarısız. " + error.detail, "error");
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        resultElement.innerText = `Hata: ${error.message}`;
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
