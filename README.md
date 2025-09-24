# Telegram Bot - Node.js Version

Bu Telegram bot yangi a'zolarga xush kelibsiz xabarini yuboradi va admin paneli bilan boshqariladi.

## Xususiyatlari

- ✅ Yangi a'zolarga avtomatik xush kelibsiz xabari
- ✅ Admin paneli statistika bilan
- ✅ Havolani o'zgartirish imkoniyati
- ✅ Vercel uchun optimallashtirilgan
- ✅ JSON fayl orqali ma'lumotlar saqlash

## O'rnatish

### 1. Loyihani klonlash
```bash
git clone <repository-url>
cd telegram-bot-nodejs
```

### 2. Bog'liqliklarni o'rnatish
```bash
npm install
```

### 3. Mahalliy ishga tushirish
```bash
npm run dev
```

## Vercel'ga deploy qilish

### 1. Vercel CLI o'rnatish
```bash
npm i -g vercel
```

### 2. Deploy qilish
```bash
vercel --prod
```

### 3. Webhook o'rnatish
Deploy qilingandan keyin, Telegram Bot API orqali webhook o'rnating:

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-vercel-domain.vercel.app/webhook
```

## Admin buyruqlari

- `/admin` - Admin panelini ochish
- `/setlink <yangi_havola>` - Havolani o'zgartirish
- `📊 Statistika` - Foydalanuvchilar sonini ko'rish
- `🔗 Hozirgi link` - Joriy havolani ko'rish

## Konfiguratsiya

Bot sozlamalari `api/webhook.js` faylida:

```javascript
const BOT_TOKEN = 'YOUR_BOT_TOKEN';
const ADMIN_ID = YOUR_ADMIN_ID;
const PHOTO_URL = 'YOUR_PHOTO_URL';
```

## Fayl tuzilishi

```
├── api/
│   └── webhook.js          # Asosiy webhook handler
├── package.json            # Node.js bog'liqliklar
├── vercel.json            # Vercel konfiguratsiyasi
├── server.js              # Mahalliy development server
└── README.md              # Hujjatlar
```

## Xatoliklarni tuzatish

1. **Bot javob bermayapti**: Webhook to'g'ri o'rnatilganligini tekshiring
2. **Admin panel ishlamayapti**: ADMIN_ID to'g'riligini tekshiring
3. **Rasm yuklanmayapti**: PHOTO_URL mavjudligini tekshiring

## Qo'llab-quvvatlash

Muammolar yuzaga kelsa, GitHub Issues orqali xabar bering.