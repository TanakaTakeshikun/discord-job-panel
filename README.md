# discord-job-panel

**動作環境**
Discord.jsv13

(v14は未検証)

バグがあった場合は``BURI#9515``まで

interactionイベント検証済み
# sample
```js
const {Client,Intents} = require('discord.js');
 const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
 const discord_job = require("discord-job-panel");
discord_job.db_type({id: 1,label: "db",key:"MONGOkey"});
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
  client.login("YOURTOKEN");
```

# sample(簡易)
```js
const {Client,Intents} = require('discord.js');
const  client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const  discord_job = require("discord-job-panel");
discord_job.db_type({id: 0,label: "db"});
client.on('messageCreate', async message => {
  if (message.content.startsWith("!job")) {
    const args = message.content.split(" ").slice(1);
    const getdata = discord_job.create_panel({role: args,in:message,title: "ロールを選ぼう"});
    if(getdata<=2)return message.reply("入力がなかったまたはロールが見つかりませんでした");
    for(let i=0; i < getdata.content.length; i++)message.reply({content: getdata.content[i].join("\n"),components: [getdata.select[i]]});
  };
  if (message.content.startsWith("!addjob")) {
    const args = message.content.split(" ").slice(1);
    const getdata = await discord_job.add_panel({role: args,in:message,title: "ロールを選ぼう"});
    if(getdata<=3) return message.reply("入力がされていないまたは前回のデータがないまたはロールが見つかりません");
    for(let i=0; i < getdata.content.length; i++)message.reply({content: getdata.content[i].join("\n"),components: [getdata.select[i]]});
  };
  if (message.content == "!deletedb") {
     await discord_job.delete_db(message.guild.id);
     message.reply("完了");
  };
  if(message.content.startsWith("!deletejob")){
    const args = message.content.split(" ")[1]
    const getdata =await discord_job.remove_panel({num:args,title:"ロールを選ぼう",in:message});
    if(getdata <= 3) return message.reply("すべてのコンテンツがないまたは前回のデータがなかったまたは前回のパネルの範囲内の数値を入れてください");
    console.log(getdata)
    message.reply({content: getdata.content.join("\n"),components: [getdata.select]})
  }
  if(message.content == "!cleardb"){
    await discord_job.clear_db();
    message.reply("完了しました");
  }
});
  client.on("interactionCreate", async i => {
  const select = discord_job.select(i);
  if(select !== 1){
      await i.deferReply({ ephemeral: true });
      const role = await i.member.roles.add(select.info).catch(()=>{});
      if(!role) return i.followUp("エラー");
      i.followUp("ロール追加");
  }
});
  client.login("YOURTOKEN");
  ```
# 関数

# create_panel

```js
create_panel({role:roles,in:interaction or message,title:"hoge"})
```


**role**:配列にして渡してください(arr型)

sample

role:[role1,role2,role3]

ロールはIDまたはメンション(string型)にしてください


**in**:取得したデータを入れてください(class型)

(messageクラスやinteractionクラス)

**title**:select_menuのタイトルを入れてください(string型)

ない場合はnothing selectになります

**返り値**

**1**

配列が渡されなかったとき

**2**

ロールが見つからなかったとき


**content**

成功した場合contentにロールの名前が配列(25行区切り)で送られてきます

形は数値:役職名です

例

[[0-25のロールの名前],[26-nのロールの名前]]

**select**

成功した場合selectにcontentと同じく25区切りでselectのJSON型が送られてきます

例

[[0-25のselectのJSON型],[26-nのselectのJSON型]]

# select

このイベントは必ずinteractionCreateにしてください

```js
select(interactionクラス);
```

**select**にはinteractionの情報(class)を入れてください

**返り値**

**1**

カスタムIDが`違う`時に返されます

**bol**

対象ユーザーにすでに該当ロールがついている場合`false`が返ります

ついていない場合は`true`が返ります

**info**

ロールIDが返ります

# add_panel

これは前回のパネルに直接データを追加したものをかえします

```js
add_panel({role:roles,in:interaction message,title:"hoge"})
```


**role**:配列にして渡してください(arr型)

sample

role:[role1,role2,role3]


**in**:取得したデータを入れてください(class型)

(messageクラスやinteractionクラス)

**title**:select_menuのタイトルを入れてください(string型)


**返り値**

**1**

配列が見つからなかったときに返されます

**2**

DBに対象ギルドの前回のデータが見つからなかったときに返されます

**3**

ロールが見つからなかったときに返されます

**content**

数値:ロール名の形で配列が返されます(create_panelと同じ)

**select**

selectのJSON型で配列が返されます(create_panelと同じ)

# remove_panel

```js
remove_panel({num:args,title:"ロールを選ぼう",in:message});
```
**num**:消したい役職の数値を入れてください(int型)

**in**:取得したデータを入れてください(class型)

(messageクラスやinteractionクラス)

**title**:select_menuのタイトルを入れてください(string型)

**返り値**

**1**

DBに対象ギルドのデータがなかった時に返されます

**2**

役職に割り当てられている番号以外の数値が入力されたときに返されます

注意あくまで前回のパネルなので25以上になった時に26,27,28となっているとき25以下は2で返されます

24,27,28の場合26~28までの数値に対応しています


**3**

コンテンツが何もなくなった時に返されます

**content**

数値:ロール名の形でが返されます

この時配列ではなく最後にでたパネルの指定したロールを消した物が返されます

**select**

SelectのJSON型がcontentと同じように返されます

# db_type

これはDBを選択します

```js
db_type({id: 0 or 1,label: "hoge",key:"mongokey"})
 ```


**id**は0がkeyvで1がmongoです(number)

**label**はDBの名前です(string)

**key**にはMONGODBのkeyを入れてください(keyvの場合は省略可)

**返り値**

なし

# delete_db

```js
delete_db(guildId)
```
DBの対象ギルドのデータを消します

**返り値**

**1**

データが見つからなかったときに帰ります

**2**

削除されたときに帰ります

# clear_db

```js
clear_db()
```
すべてのデータを消します

**返り値**

なし
# couston_id

```js
couston_id("HOGE")
```

  カスタムIDを決めれます(ない場合はBURISELECTJOB)

**返り値**

なし