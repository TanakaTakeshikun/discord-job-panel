const {Client,Intents} = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const discord_job = require("./mod.js");
discord_job.db_type({id: 0,label: "db"});
discord_job.couston_id("HOGEHOGE");
client.on('messageCreate', async message => {
  if (message.content.startsWith("!job")) {
    const args = message.content.split(" ").slice(1);
    const getdata = discord_job.create_panel({role: args,in:message,title: "ロールを選ぼう"});
    if (getdata==1) return message.reply("入力されていません");
    if(getdata==2)return message.reply("ロールが見つかりませんでした");
    for(let i=0; i < getdata.content.length; i++)message.reply({embeds:[{description: getdata.content[i].join("\n")}],components: [getdata.select[i]]});
  };
  if (message.content.startsWith("!addjob")) {
    const args = message.content.split(" ").slice(1);
    const getdata = await discord_job.add_panel({role: args,in:message,title: "ロールを選ぼう"});
    if (getdata==1) return message.reply("入力がされていません");
    if(getdata==2) return message.reply("前回のデータが見つかりません");
    if(getdata==3) return message.reply("ロールが見つかりません");
    for(let i=0; i < getdata.content.length; i++)message.reply({embeds:[{description: getdata.content[i].join("\n")}],components: [getdata.select[i]]});
  };
  if (message.content == "!deletedb") {
    const deletedb = await discord_job.delete_db(message.guild.id);
    if(deletedb==1) return message.reply("何も保存されていません");
    if(deletedb==2) return message.reply("完了");
  };
  if(message.content.startsWith("!deletejob")){
    const args = message.content.split(" ")[1]
    const getdata =await discord_job.remove_panel({num:args,title:"ロールを選ぼう",in:message});
    if(getdata == 1) return message.reply("前回のデータが見つかりませんでした");
    if(getdata == 2) return message.reply("前回のパネルの範囲内の数値を入れてください");
    if(getdata == 3) return message.reply("すべてのコンテンツがなくなりました");
    message.reply({embeds:[{description: getdata.content.join("\n")}],components: [getdata.select]});
  }
  if(message.content == "!cleardb"){
    await discord_job.clear_db();
    message.reply("完了しました");
  }
});
  client.on("interactionCreate", async i => {
  if(i.customId=="HOGEHOGE"){
  const select = discord_job.select(i);
    await i.deferReply({ ephemeral: true });
    if (select.bol) {
     const role = await i.member.roles.add(select.info).catch(()=>{});
      if(!role) return i.followUp("エラー");
        i.followUp("ロール追加");
        } else {
     const role = await i.member.roles.remove(select.info).catch(()=>{});
      if(!role) return i.followUp("エラー");
      i.followUp("ロール削除");
    }
  }
});
  client.login(process.env.token);