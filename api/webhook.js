const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// ================== SOZLAMALAR ==================
const BOT_TOKEN = '8243325586:AAGkNjVmltmR2xgqrFg0Hx1hWcp3yvG-1Ag';
const ADMIN_ID = 6295092422;
const PHOTO_URL = 'https://67ef3e768bb87.myxvest1.ru/zayafkabot/image.jpg';

// Ma'lumotlar fayllari
const DATA_FILE = path.join('/tmp', 'bot_data.json');
const CONFIG_FILE = path.join('/tmp', 'bot_config.json');

// Bot yaratish
const bot = new TelegramBot(BOT_TOKEN);

// ================== FUNKSIYALAR ==================

// JSON fayllarni o'qish va yozish
function getJsonData(file) {
    try {
        if (!fs.existsSync(file)) return {};
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON:', error);
        return {};
    }
}

function saveJsonData(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving JSON:', error);
    }
}

// Xabar yuborish
async function sendMessage(chatId, text, keyboard = null) {
    try {
        const options = {
            parse_mode: 'HTML'
        };
        if (keyboard) {
            options.reply_markup = keyboard;
        }
        return await bot.sendMessage(chatId, text, options);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Rasm bilan xabar yuborish
async function sendPhotoWithCaption(chatId, photoUrl, caption, keyboard) {
    try {
        const options = {
            caption: caption,
            parse_mode: 'HTML',
            reply_markup: keyboard
        };
        return await bot.sendPhoto(chatId, photoUrl, options);
    } catch (error) {
        console.error('Error sending photo:', error);
    }
}

// ================== WEBHOOK HANDLER ==================
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const update = req.body;
        
        if (!update) {
            return res.status(200).json({ status: 'No update' });
        }

        // Admin paneli uchun
        if (update.message && update.message.text && update.message.from.id == ADMIN_ID) {
            const chatId = ADMIN_ID;
            const text = update.message.text;

            if (text === '/admin') {
                const admin_keyboard = {
                    keyboard: [
                        [{ text: '📊 Statistika' }],
                        [{ text: '🔗 Hozirgi link' }]
                    ],
                    resize_keyboard: true
                };
                await sendMessage(chatId, "Salom, Admin!", admin_keyboard);
            } 
            else if (text.startsWith('/setlink ')) {
                const new_link = text.replace('/setlink ', '').trim();
                const config = getJsonData(CONFIG_FILE);
                config.target_url = new_link;
                saveJsonData(CONFIG_FILE, config);
                await sendMessage(chatId, `✅ Havola o'zgartirildi: ${new_link}`);
            }
            else if (text === '🔗 Hozirgi link') {
                const config = getJsonData(CONFIG_FILE);
                const current_link = config.target_url || 'https://t.me/+SOQjqCOhJSxjNDFi';
                await sendMessage(chatId, `ℹ️ Hozirgi havola:\n<code>${current_link}</code>`);
            }
            else if (text === '📊 Statistika') {
                const data = getJsonData(DATA_FILE);
                const userCount = (data.users || []).length;
                const sentCount = data.total_sent || 0;
                const stat_text = `<b>📊 Statistika</b>\n\n👤 Bot a'zolari: <b>${userCount}</b>\n📬 Jami yuborilgan: <b>${sentCount}</b>`;
                await sendMessage(chatId, stat_text);
            }
        }

        // Yangi a'zolarga xabar yuborish
        let new_user_id = null;

        if (update.chat_join_request) {
            // Kanalga so'rov
            new_user_id = update.chat_join_request.from.id;
        } 
        else if (update.chat_member) {
            // Guruhga qo'shilish
            const chat_member = update.chat_member;
            if (chat_member.new_chat_member.status === 'member' && 
                chat_member.old_chat_member.status === 'left') {
                new_user_id = chat_member.new_chat_member.user.id;
            }
        }

        if (new_user_id) {
            const config = getJsonData(CONFIG_FILE);
            const target_url = config.target_url || 'https://t.me/+SOQjqCOhJSxjNDFi';
            
            const welcome_text = "<b>Siz uchun ajoyib BONUS!</b> 🎁\n\nQiymati 100$ bo'lgan yopiq treyding signal kanali endi siz uchun mutlaqo <b>BEPUL!</b>";
            
            const inline_keyboard = {
                inline_keyboard: [[
                    { text: '💎 Tekinga qo\'shilish', url: target_url }
                ]]
            };

            await sendPhotoWithCaption(new_user_id, PHOTO_URL, welcome_text, inline_keyboard);

            // Statistikani yangilash
            const data = getJsonData(DATA_FILE);
            if (!data.users) data.users = [];
            if (!data.users.includes(new_user_id)) {
                data.users.push(new_user_id);
            }
            data.total_sent = (data.total_sent || 0) + 1;
            saveJsonData(DATA_FILE, data);
        }

        res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};