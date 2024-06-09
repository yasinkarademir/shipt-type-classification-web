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

const shipDamages = {
    '001.Nimitz-class_aircraft_carrier': 'Nimitz sınıfı uçak gemileri, büyük boyutları nedeniyle liman altyapısına fiziksel zarar verebilir ve yoğun trafik yaratabilir.',
    '002.KittyHawk-class_aircraft_carrier': 'Kitty Hawk sınıfı uçak gemileri, yüksek tonajları ile iskelelerde ve rıhtımlarda ciddi baskı oluşturabilir.',
    '003.Midway-class_aircraft_carrier': 'Midway sınıfı uçak gemileri, büyük boyutları ve ağır yükleri nedeniyle liman altyapısında aşınma ve yıpranmaya neden olabilir.',
    '004.Kuznetsov-class_aircraft_carrier': 'Kuznetsov sınıfı uçak gemileri, devasa boyutları ve ağırlıkları ile liman yapılarında ciddi yapısal hasar riski oluşturur.',
    '005.Charles_de_Gaulle_aricraft_carrier': 'Charles de Gaulle uçak gemisi, nükleer tahrikli olması nedeniyle limanda radyasyon güvenlik endişeleri yaratabilir.',
    '006.INS_Virrat_aircraft_carrier': 'INS Viraat uçak gemisi, liman manevralarında zorluk çıkararak rıhtım ve iskelelere zarar verebilir.',
    '007.INS_Vikramaditya_aircraft_carrier': 'INS Vikramaditya, büyük boyutları nedeniyle liman altyapısında fiziksel aşınma ve hasar oluşturabilir.',
    '008.Ticonderoga-class_cruiser': 'Ticonderoga sınıfı kruvazörler, güçlü silah sistemleri ve radar ekipmanları nedeniyle elektromanyetik interferansa neden olabilir.',
    '009.Arleigh_Burke-class_destroyer': 'Arleigh Burke sınıfı muhripler, limanda yakıt ve mühimmat depolama riskleri taşıyabilir.',
    '010.Akizuki-class_destroyer': 'Akizuki sınıfı muhripler, yüksek hız ve manevra kabiliyetleriyle liman yapılarında çarpma hasarına neden olabilir.',
    '011.Asagiri-class_destroyer': 'Asagiri sınıfı muhripler, liman altyapısında titreşim ve ses kirliliğine yol açabilir.',
    '012.Kidd-class_destroyer': 'Kidd sınıfı muhripler, yoğun manevra kabiliyetleri ile liman yapılarına zarar verebilir.',
    '013.Type_45_destroyer': 'Type 45 muhripleri, elektronik harp ekipmanları ile limanda elektromanyetik interferansa neden olabilir.',
    '014.Wasp-class_assault_ship': 'Wasp sınıfı amfibi hücum gemileri, büyük boyutları ve yük kapasiteleri ile liman altyapısında aşınma ve yıpranmaya yol açabilir.',
    '015.Osumi-class_landing_ship': 'Osumi sınıfı çıkarma gemileri, büyük yük kapasiteleri ve ağır araç taşıma potansiyelleriyle rıhtımlarda yapısal hasara neden olabilir.',
    '016.Hyuga-class_helicopter_destroyer': 'Hyuga sınıfı helikopter muhripleri, limanda hava trafiği ve gürültü kirliliğine yol açabilir.',
    '017.Lzumo-class_helicopter_destroyer': 'Izumo sınıfı helikopter muhripleri, büyük boyutları ile liman altyapısında fiziksel hasar riski oluşturabilir.',
    '018.Whitby_Island-class_dock_landing_ship': 'Whitby Island sınıfı rıhtım çıkarma gemileri, büyük yük kapasiteleri ile liman altyapısında aşınma ve yıpranmaya neden olabilir.',
    '019.San_Antonio-class_transport_dock': 'San Antonio sınıfı taşıma rıhtımları, büyük boyutları ve ağır yükleri ile liman yapılarına fiziksel zarar verebilir.',
    '020.Freedom-class_combat_ship': 'Freedom sınıfı muharip gemiler, yüksek hız ve manevra kabiliyetleri ile limanda çarpma riski taşır.',
    '021.Independence-class_combat_ship': 'Independence sınıfı muharip gemiler, gelişmiş silah sistemleri ve radar ekipmanları ile limanda elektromanyetik interferansa neden olabilir.',
    '022.Sacramento-class_support_ship': 'Sacramento sınıfı destek gemileri, büyük yakıt ve malzeme depolama kapasiteleri ile limanda yangın ve patlama riskleri taşıyabilir.',
    '023.Crane_ship': 'Vinç gemileri, liman manevralarında iskele ve rıhtımlara zarar verebilecek büyük ve ağır yükleri taşır.',
    '024.Abukuma-class_frigate': 'Abukuma sınıfı fırkateynler, limanda yüksek manevra kabiliyetleri ile rıhtım ve iskelelere zarar verebilir.',
    '025.Megayacht': 'Megayatlar, büyük boyutları ile liman altyapısında aşınma ve yıpranmaya yol açabilir.',
    '026.Cargo_ship': 'Yük gemileri, büyük yük kapasiteleri ile liman altyapısında yapısal hasar ve aşınma riski oluşturur.',
    '027.Murasame-class_destroyer': 'Murasame sınıfı muhripler, limanda yüksek hız ve manevra kabiliyetleri ile çarpma hasarına neden olabilir.',
    '028.Container_ship': 'Konteyner gemileri, büyük yük kapasiteleri ve ağır konteynerler ile liman altyapısında aşınma ve yıpranmaya yol açabilir.',
    '029.Towing_vessel': 'Römorkörler, liman manevralarında diğer gemilere ve liman yapılarına zarar verme riski taşır.',
    '030.Civil_yacht': 'Sivil yatlar, limanda aşırı trafik ve gürültü kirliliği yaratabilir.',
    '031.Medical_ship': 'Tıbbi gemiler, limanda biyolojik atık yönetimi ve sağlık güvenliği riskleri taşıyabilir.',
    '032.Sand_carrier': 'Kum taşıyıcıları, limanda kum ve diğer inşaat malzemelerinin dökülmesiyle çevresel kirlenmeye neden olabilir.',
    '033.Tank_ship': 'Tank gemileri, büyük yakıt ve kimyasal madde depolama kapasiteleri ile limanda çevresel kirlenme ve patlama riski taşır.',
    '034.Garibaldi_aircraft_carrier': 'Garibaldi sınıfı uçak gemileri, büyük boyutları ve ağırlıkları ile liman altyapısında yapısal hasar riski oluşturabilir.',
    '035.Zumwalt-class_destroyer': 'Zumwalt sınıfı muhripler, gelişmiş silah sistemleri ve radar ekipmanları ile limanda elektromanyetik interferansa neden olabilir.',
    '036.Kongo-class_destroyer': 'Kongo sınıfı muhripler, yüksek hız ve manevra kabiliyetleri ile limanda çarpma riski taşır.',
    '037.Horizon-class_destroyer': 'Horizon sınıfı muhripler, gelişmiş silah sistemleri ile liman güvenlik riskleri yaratabilir.',
    '038.Atago-class_destroyer': 'Atago sınıfı muhripler, limanda yüksek hız ve manevra kabiliyetleri ile yapısal hasara neden olabilir.',
    '039.Mistral-class_amphibious_assault_ship': 'Mistral sınıfı amfibi hücum gemileri, büyük boyutları ve yük kapasiteleri ile liman altyapısında aşınma ve yıpranmaya yol açabilir.',
    '040.Juan_Carlos_I_Strategic_Projection_Ship': 'Juan Carlos I gemisi, büyük boyutları ve yük kapasiteleri ile liman altyapısında fiziksel hasar riski oluşturabilir.',
    '041.Maestrale-class_frigate': 'Maestrale sınıfı fırkateynler, limanda yüksek manevra kabiliyetleri ile rıhtım ve iskelelere zarar verebilir.',
    '042.San_Giorgio-class_transport_dock': 'San Giorgio sınıfı taşıma rıhtımları, büyük boyutları ve ağır yükleri ile liman yapılarına fiziksel zarar verebilir.'
};

async function uploadImage() {
    const fileInput = document.getElementById('file-input');
    const modelSelect = document.getElementById('model-select');
    const resultElement = document.getElementById('result');
    const shipDescriptionElement = document.getElementById('ship-description');
    const shipDamageElement = document.getElementById('ship-damage');

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
    shipDamageElement.style.display = 'none';
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
                shipDescriptionElement.classList.add('green-box');
            } else {
                shipDescriptionElement.innerText = '';
                shipDescriptionElement.style.display = 'none';
            }

            // Gemi zararını göster
            const damage = shipDamages[predictedClass];
            if (damage) {
                shipDamageElement.innerText = `Zarar: ${damage}`;
                shipDamageElement.style.display = 'block';
                shipDamageElement.classList.add('red-box');
            } else {
                shipDamageElement.innerText = '';
                shipDamageElement.style.display = 'none';
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

    // Yeni liste öğesi oluştur
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.innerText = `Sınıf: ${predictedClass}`;

    // Liste öğesini başa ekle
    historyList.insertBefore(listItem, historyList.firstChild);

    // Listenin uzunluğunu kontrol et ve gerekirse fazla öğeleri sil
    while (historyList.childElementCount > 4) {
        historyList.removeChild(historyList.lastChild);
    }
}

async function uploadModel() {
    const modelFileInput = document.getElementById('model-file-input');
    const modelFeedback = document.getElementById('model-feedback');
    const modelSelect = document.getElementById('model-select');

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

        const result = await response.json();

        if (response.ok) {
            modelFeedback.innerHTML = `Model başarıyla yüklendi: ${result.model_name}`;
            modelFeedback.className = 'alert alert-success';

            // Model listesini güncelle
            modelSelect.innerHTML = '';  // Mevcut seçenekleri temizle
            result.models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.text = model;
                modelSelect.appendChild(option);
            });

            modelFileInput.value = '';  // Input alanını temizle

            // Mesajı belirli bir süre sonra kaldır
            setTimeout(() => {
                modelFeedback.style.display = 'none';
            }, 3000); // 3 saniye sonra mesajı kaldır
        } else {
            modelFeedback.innerHTML = 'Model yükleme başarısız. ' + result.message;
            modelFeedback.className = 'alert alert-danger';
        }

        modelFeedback.style.display = 'block';
    } catch (error) {
        modelFeedback.innerHTML = 'Bir hata oluştu: ' + error.message;
        modelFeedback.className = 'alert alert-danger';
        modelFeedback.style.display = 'block';
    }
}
