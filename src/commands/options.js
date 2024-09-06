// Define menus for different roles
const menus = {
  start: [['🛍 我的店铺', '💹 我的分销', '🌟 我的会员']],
  mercant: [['📦 商品', '🤖 机器人', '👥 会员群'], ['👣 每日访问', '📋 店铺订单', '📈 成交统计'], ['⚙️ 店铺设置', '💹 经营分析', '💰 商家结算']],
  distribution: [['📦 分销商品', '💰 分销结算']],
  setSevice: [['选择用户']]
};

// Function to get the custom keyboard based on user role
module.exports = command => {
  // const role = userRoles[command] || 'start'; // Default to 'guest' if not found
  return {
    reply_markup: {
      keyboard: menus[command],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };
}
