require("dotenv").config();
const FemtoBot = require("./app/FemtoBot"); //import FemtoBot

const token = process.env.BOTFATHER_HTTP_API;
const options = { polling: true };

console.log("Starting FemtoBot...");

//check token
if (!token) {
    throw new Error("No token provided");
}

const femtoBot = new FemtoBot(token, options);

const main = () => {
    femtoBot.getSticker();
    femtoBot.getGreeting();
    femtoBot.getQuote();
    femtoBot.getNews();
    femtoBot.getQuake();
    femtoBot.getHelp();
};

main();

console.log("FemtoBot is ready!");
