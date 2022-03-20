const {Client,Intents, MessageReaction} = require('discord.js'),
  client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]}),
  discord_job = require("./mod.js");
discord_job.db_type({id: 0,label: "db"})
//id=0:keyv,1:mongo
discord_job.couston_id("HOGEHOGE")
client.on('messageCreate', async message => {
  if (message.content.startsWith("!job")) {
    const args = message.content.split(" ").slice(1);
    const getdata = discord_job.create_panel({role: args,in:message,title: "ロールを選ぼう"});
    if (!getdata) return message.reply("ロールが見つかりませんでした");
    for(let i=0; i < getdata.content.length; i++)message.reply(({content: getdata.content[i].join("\n"),components: [getdata.select[i]]}));
  }
  if (message.content.startsWith("!addjob")) {
    message.clean
    const args = message.content.split(" ").slice(1);
    const getdata = await discord_job.add_panel({role: args,in:message,title: "ロールを選ぼう"});
    if (!getdata) return message.reply("前回のデータが見つかりません");
    for(let i=0; i < getdata.content.length; i++)message.reply(({content: getdata.content[i].join("\n"),components: [getdata.select[i]]}));
  }
  if (message.content == "!deletedb") {
    await discord_job.delete_db()
    message.reply("完了")
  }
  if(message.content.startsWith("!deletepanel")){
    const args = message.content.split(" ")[1]
    const select = discord_job.delete_panel({num:args,title:"まんこ",in:message})
    message.reply(select)
  }
})
  .on("interactionCreate", async i => {
  if (!i.isSelectMenu()) return;
  const select = discord_job.select(i);
  if (select) {
    if (select.bol) {
      i.member.roles.add(select.info);
      i.reply({content: "ロール追加"});
        } else {
      i.member.roles.remove(select.info)
      i.reply({content: "ロール削除"});
    }
  }
})
  .login(process.env.token);