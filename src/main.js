const bot = require("./bot")
const start = require("./commands/start")
const mercant = require("./commands/mercant")
const distribution = require('./commands/distribution')
const chat = require("./commands/chat")
const okx = require("./commands/okx")
const cancel = require("./commands/cancel")
const update = require("./commands/update")
const help = require("./commands/help")
const robot = require("./commands/robot")
const callbacks = require("./callback")
const database = require('./database')

database()

// Global pendingTransfers object to track pending transfers
let pendingTransfers = {}

// Flags to prevent multiple registrations of the same command
let isGenerateRegistered = false
let isBalanceRegistered = false
let isTransferRegistered = false
let isStartRegistered = false

console.log("Bot is running...")

bot.setMyCommands([
    { command: "/start", description: "💰 开启财富之门" },
    { command: "/mercant_portal", description: "🛍 我的店铺" },
    { command: "/my_distribution", description: "💹 我的分销" },
    { command: "/my_chat", description: "🌟 我的会员" },
    { command: "/okx", description: "📈 实时汇率" },
    { command: "/cancel", description: "❌ 取消" },
    { command: "/update", description: "🔁 更新回话信息" },
    { command: "/help", description: "🤖 机器人使用帮助" }
]);

bot.on("callback_query", (query) => {
    if (!query.data) {
      return;
    }
  
    let request;
  
    try {
      request = JSON.parse(query.data);
    } catch {
      return;
    }
  
    if (!callbacks[request.method]) {
      return;
    }
  
    callbacks[request.method](query, request.data);
  });

const userStates = {}

bot.on("message", msg => {
    const chatId = msg.chat.id
    const userResponse = msg.text.trim().toLowerCase()
    if (userResponse == "🤖 机器人") robot(bot, chatId)
})

bot.on("message", msg => {
    const chatId = msg.chat.id
    const userResponse = msg.text.trim().toLowerCase()

    // Handle transfer confirmation exclusively
    if (pendingTransfers[chatId]) {
        if (userResponse === "yes") {
            const transferConfirmHandler = require("./commands/transfer").confirmTransfer
            transferConfirmHandler(bot, chatId, pendingTransfers)
        } else if (userResponse === "no") {
            bot.sendMessage(chatId, "Transfer canceled.")
            delete pendingTransfers[chatId] // Clear pending transfer
        } else {
            bot.sendMessage(chatId, 'Invalid response. Please reply with "Yes" or "No".')
        }
        return // Ignore all other input while waiting for confirmation
    }

    // If no pending transfer, process normal commands
    const msgText = msg.text.trim()
    const messageId = msg.message_id

    // Validate command if it starts with "/"
       
            // Process valid commands
        switch (msgText) {
            // case "/startfinance":
            //     bot.sendMessage(chatId, "Welcome to the Tron Wallet Bot!\n" + helpMessage)
            //     break

            
            // case "/generate":
            //     if (!isGenerateRegistered) {
            //         const registerGenerateCommand = require("./commands/generate")
            //         registerGenerateCommand(bot)
            //         isGenerateRegistered = true // Mark as registered
            //     }
            //     break
            
            // case "/balance":
            //     if (!isBalanceRegistered) {
            //         const registerBalanceCommand = require("./commands/balance")
            //         registerBalanceCommand(bot)
            //         isBalanceRegistered = true // Mark as registered
            //     }
            //     break
            
            // case "/transfer":
            //     if (!isTransferRegistered) {
            //         const registerTransferCommand = require("./commands/transfer")
            //         registerTransferCommand(bot, pendingTransfers)
            //         isTransferRegistered = true // Mark as registered
            //     }
            //     break
            
            // case "/info":
            //     if (!isInfoRegistered) {
            //         const registerInfoCommand = require("./commands/info")
            //         registerInfoCommand(bot)
            //         isInfoRegistered = true // Mark as registered
            //     }
            //     break
                            
            case "/start":
                start(bot, chatId)
                break
                
            case "/mercant_portal":
                mercant(bot, chatId)
                break

            case "🛍我的店铺":
                mercant(bot, chatId)
                break

            case "/my_distribution":
                distribution(bot, chatId, messageId)
                break

            case "💹我的分销":
                distribution(bot, chatId, messageId)
                break

            case "/my_chat":
                chat(bot, chatId, messageId)
                break

            case "🌟 我的会员":
                chat(bot, chatId, messageId)
                break
                
            case "/okx":
                okx(bot, chatId)
                break
                
            case "/cancel":
                cancel(bot, chatId)
                break
                
            case "/update":
                update(bot, chatId, messageId)
                break
                
            case "/help":
                help(bot, chatId)
                break

            // case "🤖 机器人":
            //     robot(bot, chatId)
            //     break
        }
})

// Handle polling errors
bot.on("polling_error", error => console.error("Polling Error:", error))
