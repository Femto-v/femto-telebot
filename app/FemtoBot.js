const TelegramBot = require("node-telegram-bot-api");
const commands = require("../libs/commands");
const { helpText, invalidCommandText } = require("../libs/constant");
require("dotenv").config();

class FemtoBot extends TelegramBot {
    constructor(token, options) {
        super(token, options);
        this.on("message", (msg) => {
            const isCommand = Object.values(commands).some((keyword) =>
                keyword.test(msg.text)
            );
            const isSticker = msg.sticker;
            if (!isCommand && !isSticker) {
                this.sendMessage(msg.chat.id, invalidCommandText, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Help", callback_data: "go_to_help" }],
                        ],
                    },
                });
                const lastName = msg.chat.last_name
                    ? " " + msg.chat.last_name
                    : "";
                console.log(
                    "Unknown command: " +
                        msg.text +
                        " <= " +
                        msg.chat.first_name +
                        lastName
                );
            }
        });
        this.on("callback_query", (callbackQuery) => {
            const msg = callbackQuery.message;
            if (callbackQuery.data === "go_to_help") {
                this.sendMessage(msg.chat.id, helpText, {
                    parse_mode: "Markdown",
                });
                console.log(
                    "help button loaded by: " +
                        msg.chat.first_name +
                        (msg.chat.last_name ? " " + msg.chat.last_name : "")
                );
            }
        });
    }
    getHelp() {
        this.onText(commands.help, (msg) => {
            const helpMessage = helpText;

            this.sendMessage(msg.chat.id, helpMessage, {
                parse_mode: "Markdown",
            });
            console.log(
                "help command loaded by: " +
                    msg.chat.first_name +
                    (msg.chat.last_name ? " " + msg.chat.last_name : "")
            );
        });
    }
    getSticker() {
        this.on("sticker", (msg) => {
            this.sendMessage(msg.chat.id, msg.sticker.emoji);
            console.log(
                "getSticker command loaded: " +
                    msg.chat.first_name +
                    (msg.chat.last_name ? " " + msg.chat.last_name : "")
            );
        });
    }
    getGreeting() {
        this.onText(commands.halo, (msg) => {
            this.sendMessage(msg.chat.id, "Halo juga masbro");
            console.log(
                "getGreeting command loaded: " +
                    msg.chat.first_name +
                    (msg.chat.last_name ? " " + msg.chat.last_name : "")
            );
        });
    }
    getQuote() {
        this.onText(commands.quote, async (msg) => {
            const quoteEndpoint = process.env.QUOTE_API;

            try {
                const response = await fetch(quoteEndpoint);
                const { quote } = await response.json();
                this.sendMessage(msg.chat.id, quote);
                console.log(
                    "getQuote command loaded: " +
                        msg.chat.first_name +
                        (msg.chat.last_name ? " " + msg.chat.last_name : "")
                );
            } catch (error) {
                this.sendMessage(
                    msg.chat.id,
                    "Failed to fetch quote. Please try again later."
                );
            }
        });
    }
    getNews() {
        this.onText(commands.news, async (msg) => {
            const newsEndpoint = process.env.NEWS_API;

            try {
                const response = await fetch(newsEndpoint);
                const articles = await response.json();
                const maxNews = 3;

                // 3 articles limit
                for (let i = 0; i < maxNews; i++) {
                    const news = await articles.posts[i];
                    const { title, image, headline, link } = news;

                    this.sendPhoto(msg.chat.id, image, {
                        caption: `*${title}*\n\n${headline}`,
                        parse_mode: "Markdown",
                    });
                }
            } catch (error) {
                console.log(error);
            }
            console.log(
                "getNews command loaded: " +
                    msg.chat.first_name +
                    (msg.chat.last_name ? " " + msg.chat.last_name : "")
            );
        });
    }
    getQuake() {
        const bmkgQuakeEndpoint = process.env.BMKG_QUAKE_API;
        const urlBMKG = "https://data.bmkg.go.id/DataMKG/TEWS/";
        this.onText(commands.quake, async (msg) => {
            try {
                const response = await fetch(bmkgQuakeEndpoint);
                const data = await response.json();
                const { Infogempa } = data;
                const { gempa } = Infogempa;
                const {
                    Tanggal,
                    Jam,
                    Magnitude,
                    Kedalaman,
                    Wilayah,
                    Potensi,
                    Shakemap,
                } = gempa;
                this.sendPhoto(msg.chat.id, urlBMKG + Shakemap, {
                    caption: `*Info Gempa Terkini*\n\nTanggal: ${Tanggal}\nJam: ${Jam}\nMagnitude: ${Magnitude}\nKedalaman: ${Kedalaman}\nWilayah: ${Wilayah}\nPotensi: ${Potensi}`,
                    parse_mode: "Markdown",
                });
            } catch (error) {
                console.log(error);
            }
            console.log(
                "getQuake command loaded: " +
                    msg.chat.first_name +
                    (msg.chat.last_name ? " " + msg.chat.last_name : "")
            );
        });
    }
}

module.exports = FemtoBot;
