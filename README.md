# BEON RT
Beon RT adalah aplikasi yang saya buat guna memenuhi tes Magang, saya harap aplikasi ini sesuai dengan apa yang diharapkann penguji

Projek ini dapat diakses di [beon-rt.adiiskandar.my.id](https://beon-rt.adiiskandar.my.id)
* username : admin
* password : password

## Gambar ERD
<a href="https://drive.google.com/uc?export=view&id=1Bukqxhdn0Vys96_e0sadg0NlJXOEjhFI"><img src="https://drive.google.com/uc?export=view&id=1Bukqxhdn0Vys96_e0sadg0NlJXOEjhFI" style="width: 650px; max-width: 100%; height: auto" title="Click to enlarge picture" />

## Instalasi

* Lakukan Copy Repository dari github

```
git clone https://github.com/adiubaidah/beon-rt.git
```

### Backend

* Masuk ke folder backend
```
cd backend
```
* Buat database dengan nama beon_rt

* Edit file .env-example, dan rename menjadi .env, serta isi
```
DATABASE_URL="mysql://root:<password>@localhost:3306/beon_rt"
CLIENT_URL=http://localhost:5173
PORT=5000
SECRET_KEY=secret
DOMAIN=.adiiskandar.my.id
```
* Lakukan Instalasi package
```
npm i
```

* Lakukan generate linting typescript prisma
```
npx prisma generate
```

* Push ke database
```
npx prisma db push
```
* Seed (isi) database
```
npx prisma db seed
```
* Run backend
```
npm run dev
```
> [!NOTE]
> Pastikan backend berjalan sesuai port

### Frontend
* Masuk ke folder frontend
```
cd frontend
```
* Edit file .env-example, dan rename menjadi .env, serta isi
```
VITE_SERVER_URL=http://localhost:5000
```
* Lakukan Instalasi package
```
npm i
```
* Run frontend
```
npm run dev
```
> [!NOTE]
> Pastikan frontend berjalan sesuai port
