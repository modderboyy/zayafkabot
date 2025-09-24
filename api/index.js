// Vercel KV (ma'lumotlarni saqlash uchun) va node-fetch (API so'rovlari uchun) importlari
const { kv } = require('@vercel/kv');
const fetch = require('node-fetch');

// ================== SOZLAMALAR ==================
const BOT_TOKEN = process.env.BOT_TOKEN || '7875196919:AAEoRfMpmy4WhUz43Gnv-ftEltNvdGfOh04';
const ADMIN_ID = parseInt(process.env.ADMIN_ID || '6295092422', 10);
const PHOTO_URL = 'https://67ef3e768bb87.myxvest1.ru/zayafkabot/image.jpg';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ================== YORDAMCHI FUNKSIYALAR ==================

// Telegramga API so'rov yuborish
async function apiRequest(method, params) {
    try {
        const response = await fetch(`${API_URL}/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!response.ok) {
            console.error('Telegram API Error:', await response.text());
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch Error:', error);
        return null;
    }
}

// Xabar yuborish
async function sendMessage(chatId, text, keyboard = null) {
    const params = { chat_id: chatId, text, parse_mode: 'HTML' };
    if (keyboard) {
        params.reply_markup = keyboard;
    }
    return apiRequest('sendMessage', params);
}

// Rasm bilan xabar yuborish
async function sendPhotoWithCaption(chatId, photoUrl, caption, keyboard) {
    const params = {
        chat_id: chatId,
        photo: photoUrl,
        caption,
        parse_mode: 'HTML',
        reply_markup: keyboard,
    };
    return apiRequest('sendPhoto', params);
}


// ================== ASOSIY FUNKSIYA (HANDLER) ==================

// Vercel barcha so'rovlarni shu funksiyaga yo'naltiradi
module.exports = async (request, response) => {
    // Faqat POST so'rovlarini qabul qilamiz (Telegramdan keladigan)
    if (request.method !== 'POST') {
        return response.status(405).send('Method Not Allowed');
    }

    try {
        const update = request.body;

        // Admin Paneli
        if (update.message && update.message.from.id === ADMIN_ID) {
            const chatId = ADMIN_ID;
            const text = update.message.text;

            if (text === '/admin') {
                const adminKeyboard = {
                    keyboard: [[{ text: '📊 Statistika' }], [{ text: '🔗 Hozirgi link' }]],
                    resize_keyboard: true,
                };
                await sendMessage(chatId, "<b>Salom, Admin!</b>\n\nLinkni o'zgartirish uchun:\n<code>/setlink https://...</code>", adminKeyboard);
            
            } else if (text.startsWith('/setlink ')) {
                const newLink = text.split(' ')[1];
                if (newLink && newLink.startsWith('http')) {
                    await kv.set('target_url', newLink);
                    await sendMessage(chatId, `✅ Havola muvaffaqiyatli o'zgartirildi:\n${newLink}`);
                } else {
                    await sendMessage(chatId, "❌ Noto'g'ri havola formati.");
                }

   
