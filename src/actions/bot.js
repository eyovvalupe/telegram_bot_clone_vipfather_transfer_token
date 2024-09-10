const Bot = require("../Models/Bot");
const https = require("https");
const bot = require("../bot");
const {
  getAddBotErrorMessage,
  getBindBotMessage,
  getSettingServiceMessage,
  setBindBotMessageTurnOff,
  setBindBotMessageTurnOn,
  isEmpty,
} = require("../utils");
const axios = require("axios");
const { setChildBot } = require("./childBot");
const { getUserInfo } = require("./user");
require("dotenv").config()

async function addRobot(botToken, chatId, user) {
  Bot.findOne({ token: botToken }).then(async (res) => {
    if (res === null) {
      const botData = await getBotInfo(botToken);
      let webhook;
      await getBotWebhookState(botToken)
        .then(result => {
            webhook = result
        })
        .catch(err => console.error(err));
      console.log(webhook)
      if (isEmpty(webhook)) {
        
      }
      const newBot = new Bot({
        token: botToken,
        userId: user.id,
        botId: botData.id,
        botFirstName: botData.first_name,
        botName: botData.user_name,
        onoffState: true,
        serviceUser: "",
        webhook: "",
      });

      newBot
        .save()
        .then(async () => {
          console.log("Bot saved!");
        })
        .catch((err) => console.error("Error saving bot token: ", err));
      
      botState(botData, chatId);
    } else {
      const addBotMessage = getAddBotErrorMessage();
      bot.sendMessage(chatId, addBotMessage);
    }
  });
}

function botState(botData, chatId) {
  bot.sendMessage(
    chatId,
    `机器人 @${botData.user_name} 绑定成功！请进入机器人，发送 /start 查看`
  );
  const textParas = {
    botNameId: botData.user_name,
    potential: "未设置",
    switch: "开启",
    state: "已启动",
  };
  const bindBotMessage = getBindBotMessage(textParas);
  bot.sendMessage(chatId, bindBotMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "⛔ 停止",
            callback_data: JSON.stringify({
              action: "stop_bot",
              botName: botData.user_name,
            }),
          },
          {
            text: "🔑 更新 Token",
            callback_data: JSON.stringify({
              action: "update_bot",
            }),
          },
        ],
        [
          {
            text: "💁‍♀️ 设置客服",
            callback_data: JSON.stringify({
              action: "set_servicer",
              botName: botData.user_name,
            }),
          },
        ],
        [
          {
            text: "🎉 欢迎消息",
            url: `http://t.me/${botData.user_name}`,
          },
        ],
        [
          {
            text: "📦 商品列表",
            callback_data: JSON.stringify({
              action: "products_list",
              botName: botData.user_name,
            }),
          },
        ],
        [
          {
            text: "💹 代理分销",
            callback_data: JSON.stringify({
              action: "anylisis_service",
            }),
          },
        ],
        [
          {
            text: "🚮 删除列表",
            callback_data: JSON.stringify({
              action: "delete_bot",
            }),
          },
        ],
        [
          {
            text: "🔙 返回",
            callback_data: JSON.stringify({
              action: "back",
            }),
          },
        ],
      ],
    },
  });
}

function stopBotMessage(displayData, chatId, messageId) {
  Bot.findOneAndUpdate(
    { botName: displayData.botName },
    { $set: { onoffState: false } }
  ).then(async (res) => {
    let potential;
    
    if (isEmpty(res.serviceUser)) {
        potential = "未设置"
    } else {
        const user = await getUserInfo(res.serviceUser);
        potential = `${user.firstName} (${res.serviceUser})`;
    }

    const textParas = {
      botNameId: displayData.botName,
      potential,
      switch: "关闭",
      state: "未启动",
    };
    const bindBotMessage = getBindBotMessage(textParas);
    bot.editMessageText(bindBotMessage, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "▶ 启动",
              callback_data: JSON.stringify({
                action: "run_bot",
                botName: displayData.botName,
              }),
            },
            {
              text: "🔑 更新 Token",
              callback_data: JSON.stringify({
                action: "update_bot",
                data: "",
              }),
            },
          ],
          [
            {
              text: "💁‍♀️ 设置客服",
              callback_data: JSON.stringify({
                action: "set_servicer",
                botName: displayData.botName,
              }),
            },
          ],
          [
            {
              text: "🎉 欢迎消息",
              url: `http://t.me/${displayData.botName}`,
            },
          ],
          [
            {
              text: "📦 商品列表",
              callback_data: JSON.stringify({
                action: "products_list",
                botName: displayData.botName,
              }),
            },
          ],
          [
            {
              text: "💹 代理分销",
              callback_data: JSON.stringify({
                action: "anylisis_service",
                data: "",
              }),
            },
          ],
          [
            {
              text: "🚮 删除列表",
              callback_data: JSON.stringify({
                action: "delete_bot",
                data: "",
              }),
            },
          ],
          [
            {
              text: "🔙 返回",
              callback_data: JSON.stringify({
                action: "back",
              }),
            },
          ],
        ],
      },
    });
  });
}

function runBotMessage(displayData, chatId, messageId) {
  Bot.findOneAndUpdate(
    { botName: displayData.botName },
    { $set: { onoffState: true } }
  ).then(async (res) => {

    let potential;
    
    if (isEmpty(res.serviceUser)) {
        potential = "未设置"
    } else {
        const user = await getUserInfo(res.serviceUser);
        potential = `${user.firstName} (${res.serviceUser})`;
    }

    const textParas = {
      botNameId: displayData.botName,
      potential,
      switch: "开启",
      state: "已启动",
    };
    const bindBotMessage = getBindBotMessage(textParas);
    bot.editMessageText(bindBotMessage, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "⛔ 停止",
              callback_data: JSON.stringify({
                action: "stop_bot",
                botName: displayData.botName,
              }),
            },
            {
              text: "🔑 更新 Token",
              callback_data: JSON.stringify({
                action: "update_bot",
                data: "",
              }),
            },
          ],
          [
            {
              text: "💁‍♀️ 设置客服",
              callback_data: JSON.stringify({
                action: "set_servicer",
                botName: displayData.botName,
              }),
            },
          ],
          [
            {
              text: "🎉 欢迎消息",
              url: `http://t.me/${displayData.botName}`,
            },
          ],
          [
            {
              text: "📦 商品列表",
              callback_data: JSON.stringify({
                action: "products_list",
                botName: displayData.botName,
              }),
            },
          ],
          [
            {
              text: "💹 代理分销",
              callback_data: JSON.stringify({
                action: "anylisis_service",
                data: "",
              }),
            },
          ],
          [
            {
              text: "🚮 删除列表",
              callback_data: JSON.stringify({
                action: "delete_bot",
                data: "",
              }),
            },
          ],
          [
            {
              text: "🔙 返回",
              callback_data: JSON.stringify({
                action: "back",
              }),
            },
          ],
        ],
      },
    });
  });
}

async function getBotInfo(token) {
  const url = `https://api.telegram.org/bot${token}/getMe`;

  try {
    const response = await axios.get(url);
    if (response.data.ok) {
      console.log("Bot Information:");
      console.log(`ID: ${response.data.result.id}`);
      console.log(`First Name: ${response.data.result.first_name}`);
      console.log(`Username: ${response.data.result.username}`);
      const data = {
        id: response.data.result.id,
        first_name: response.data.result.first_name,
        user_name: response.data.result.username,
      };
      return data;
    } else {
      console.error(
        "Error fetching bot information:",
        response.data.description
      );
    }
  } catch (error) {
    console.error("Error making request:", error.message);
  }
}

function setService(chatId, data) {
    console.log(data)

  const settingServiceMessage = getSettingServiceMessage();
  bot
    .sendMessage(chatId, settingServiceMessage, {
      reply_markup: {
        keyboard: [["选择用户"]],
        resize_keyboard: true,
      },
    })
    .then(() => {
      bot.sendMessage(chatId, "⚠️ 如果是此账号，请点击此消息下方按钮。", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "💁‍♀️ 设置此账号为客服",
                callback_data: JSON.stringify({
                  action: "set_service",
                  botName: data.botName,
                }),
              },
            ],
          ],
          one_time_keyboard: true,
        },
      });
    });
}

async function setMeAsService(data, chatId) {
  console.log("data ==========>", data);
  let myId;
  await Bot.findOne({ botName: data.botName }).then(
    (res) => (myId = res.userId)
  );
  const me = await getUserInfo(myId);
  Bot.findOneAndUpdate(
    { botName: data.botName },
    { $set: { serviceUser: me.userId } }
  ).then((res) => {
    console.log("res =============> ", res);
    // const childBot = setChildBot(res.token);
    bot
      .sendMessage(chatId, `✅ 设置机器人客服成功，客服用户ID: ${me.userId}`)
      .then((rrr) => {
        // childBot
        //   .sendMessage(
        //     chatId,
        //     `您已经被设置为机器人 @${res.botName} 的客服，您可以接收该机器人的对话。`
        //   )
        //   .then((child) => childBot.stopPolling());
        bot.sendMessage(chatId, "✅ 向客服发送通知成功").then((resthen) => {
          const bindBotMessage = res.onoffState
            ? setBindBotMessageTurnOn(res.botName, me)
            : setBindBotMessageTurnOff(res.botName, me);
          bot.sendMessage(chatId, bindBotMessage, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "⛔ 停止",
                    callback_data: JSON.stringify({
                      action: "stop_bot",
                      botName: res.botName,
                    }),
                  },
                  {
                    text: "🔑 更新 Token",
                    callback_data: JSON.stringify({
                      action: "update_bot",
                    }),
                  },
                ],
                [
                  {
                    text: "💁‍♀️ 设置客服",
                    callback_data: JSON.stringify({
                      action: "set_servicer",
                      botName: res.botName,
                    }),
                  },
                ],
                [
                  {
                    text: "🎉 欢迎消息",
                    url: `http://t.me/${res.botName}`,
                  },
                ],
                [
                  {
                    text: "📦 商品列表",
                    callback_data: JSON.stringify({
                      action: "products_list",
                      botName: res.botName,
                    }),
                  },
                ],
                [
                  {
                    text: "💹 代理分销",
                    callback_data: JSON.stringify({
                      action: "anylisis_service",
                    }),
                  },
                ],
                [
                  {
                    text: "🚮 删除列表",
                    callback_data: JSON.stringify({
                      action: "delete_bot",
                    }),
                  },
                ],
                [
                  {
                    text: "🔙 返回",
                    callback_data: JSON.stringify({
                      action: "back",
                    }),
                  },
                ],
              ],
            },
          });
        });
      });
  });
}

async function getBotList(userId) {
  let botlist;
  await Bot.find({ userId: userId }).then((res) => (botlist = res));
  return botlist;
}

async function checkBotService(botName) {
  let isBotHasService;
  await Bot.findOne({ botName }).then((res) => {
    if (res !== null) {
      isBotHasService = true;
    } else {
      isBotHasService = false;
    }
  });
  return isBotHasService;
}

function validateToken(token, chatId, user, userStates) {
  const tokenRegex = /^[0-9]{8,10}:[A-Za-z0-9_-]{35}$/; // Regex to validate token format

  if (tokenRegex.test(token)) {
    bot
      .getMe()
      .then(() => {
        addRobot(token, chatId, user);
        delete userStates[chatId]; // Clear user state
      })
      .catch((err) => {
        bot.sendMessage(
          chatId,
          "xbvbxcvb机器人 Token 格式错误。发送 /cancel 取消设置。"
        );
      });
  } else {
    bot.sendMessage(chatId, "机器人 Token 格式错误。发送 /cancel 取消设置。");
  }
}

async function goback(chatId, messageId) {
  await bot.deleteMessage(chatId, messageId);
}

async function getBotWebhookState(botToken) {
  const url = new URL(
    `https://api.telegram.org/bot${botToken}/getWebhookInfo`
  );

  return new Promise((resolve, reject) => {
    const req = https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const result = JSON.parse(data).result;
          console.log("Webhook set response:", result.url);
          resolve(result.url)
          if (result.url !== "") {
            state = true;
          }
        });
      })
      .on("error", (err) => console.error(err));
  });
}

async function setWebhook(botToken) {
  const url = new URL(`https://api.telegram.org/bot${botToken}/setWebhook`);
  console.log(process.env.SERVER_URL)
  // url.searchParams.append("url", process.env.SERVER_URL);

  // https
  //   .get(url, (resp) => {
  //     console.log(resp);
  //   })
  //   .on("error", (err) => {
  //     console.error("Error setting webhook:", err.message);
  //   });
}

module.exports = {
  setWebhook,
  getBotWebhookState,
  goback,
  validateToken,
  checkBotService,
  getBotList,
  setService,
  setMeAsService,
  runBotMessage,
  stopBotMessage,
  addRobot,
  getBotInfo,
};
