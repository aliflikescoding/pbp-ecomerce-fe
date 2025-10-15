# 🧩 Frontend Setup Guide

## 1️⃣ Install Dependencies
Setelah meng-clone repository frontend, jalankan perintah berikut di terminal:

```bash
npm install
```

Perintah ini akan menginstal semua dependencies yang tercantum di dalam `package.json`.

---

## 2️⃣ Setup Environment Variables
Biasanya terdapat file contoh bernama `.env.example`.

1. Salin file tersebut dan ubah namanya menjadi `.env`
2. Buka `.env.example`, **copy seluruh isinya**, lalu **paste ke `.env`**

Contoh:
```bash
cp .env.example .env
```

---

## 3️⃣ Jalankan Development Server
Setelah file `.env` sudah dibuat dan diisi, jalankan server lokal dengan perintah:

```bash
npm run dev
```

Server biasanya akan berjalan di:
```
http://localhost:3000
```

---

## ✅ Selesai!
Frontend sudah siap dijalankan 🚀
