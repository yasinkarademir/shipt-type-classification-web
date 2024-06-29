# Gemi Türü Tespiti - FastAPI Projesi

Bu proje, 42 sınıflı gemi türü tespiti yapan modelleri çalıştırmak için oluşturulmuş bir FastAPI uygulamasıdır.

## Projeyi Klonlama ve Çalıştırma

### Gereksinimler

Bu projeyi çalıştırmak için aşağıdaki gereksinimlere ihtiyacınız olacak:

- Python 3.9 veya daha üstü
- Git

### Adımlar

1. **Projeyi Klonlayın**

   ```sh
   git clone https://github.com/yasinkarademir/shipt-type-classification-web.git
   cd shipt-type-classification-web
   ```
2. **Gerekli Paketleri Kurun** 

   Sanal bir ortam oluşturup, gerekli paketleri requirements.txt dosyasından kurabilirsiniz.

   ```sh
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
   
3. **Uygulamayı Çalıştırın**

    Uygulamayı çalıştırmak için aşağıdaki komutu çalıştırabilirsiniz.
   ```sh
   uvicorn main:app --reload
    ```
4. **Tarayıcıda Uygulamayı Açın**

   Tarayıcınızda http://127.0.0.1:8000 adresini açarak uygulamayı kullanmaya başlayabilirsiniz.