# discord-job-panel

**動作環境**
Discord.jsv13

(v14は未検証)

バグがあった場合は``BURI#9515``まで

interactionCreateイベントは未検証なのでバグがある可能性大
# sample
```js
const {Client,Intents} = require('discord.js'),
  client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]}),
  discord_job = require("discord-job-panel");
discord_job.db_type({id: 0,label: "db"})
//id=0:keyv,1:mongo
client.on('messageCreate', async message => {
  if (message.content.startsWith("!job")) {
    const args = message.content.split(" ").slice(1);
    const getdata = discord_job.create_panel({role: args,in : message,title: "ロールを選ぼう"});
    if (!getdata) return message.reply("ロールが見つかりませんでした");
    for(let i=0; i < getdata.content.length; i++)message.reply(({content: getdata.content[i].join("\n"),components: [getdata.select[i]]}));
  }
  if (message.content.startsWith("!addjob")) {
    const args = message.content.split(" ").slice(1);
    const getdata = await discord_job.add_panel({role: args,in : message,title: "ロールを選ぼう"});
    if (!getdata) return message.reply("前回のデータが見つかりません");
    for(let i=0; i < getdata.content.length; i++)message.reply(({content: getdata.content[i].join("\n"),components: [getdata.select[i]]}));
  }
  if (message.content == "!deletedb") {
    await discord_job.delete_db()
    message.reply("完了")
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
```

# 関数

# create_panel
messageCreateイベント確認済み

interactionCreateイベント未確認

```js
create_panel({role:roles,in:interaction message,title:"hoge"})
```

**send_object**


**role**:配列にして渡してください(arr)
sample
role:[role1,role2,role3]

ロールはIDまたはメンション(string)にしてください


**in**:取得したデータを入れてください(class)
(messageやinteraction)



**title**:select_menuのタイトルを入れてください(string)

**返り値**

**undefined**

配列でない場合または何もない(undefined)の場合undefinedが返ります

**content**

成功した場合contentにロールの名前が配列(25行区切り)で送られてきます

例

[["hoge","hoge","hoge","hoge"...25],["hoge","hoge","hoge","hoge"...25]]

**select**

成功した場合selectにcontentと同じく25区切りで送られてきます

例

[["hoge","hoge","hoge","hoge"...25],["hoge","hoge","hoge","hoge"...25]]

# select

このイベントは必ずinteractionCreateにしてください

```js
select(i);
```

**select**にはinteractionの情報(class)を入れてください

**返り値**

**bol**

対象ユーザーにすでに該当ロールがついている場合`false`が返ります

ついていない場合は`true`が返ります

**info**

ロールIDが返ります

**error**

何かしらの動作に失敗した場合エラーが返ります

# add_panel

これは前回のパネルに直接データを追加したものをかえします

```js
add_panel({role:roles,in:interaction message,title:"hoge"})
```

**send_object**


**role**:配列にして渡してください(arr)
sample
role:[role1,role2,role3]


**in**:取得したデータを入れてください(class)
(messageやinteraction)



**title**:select_menuのタイトルを入れてください(string)


**返り値**

**undefined**
前回のパネルデータがない場合にundefinedが返ります

**outher**
その他の返り値は`create_panel()`と同じです

# db_type

これはDBを選択します

```js
db_type({id: 0 or 1,label: "hoge",key:"mongokey"})
 ```


**id**は0がkeyvで1がmongoです(number)

**label**はDBの名前です(string)

**key**にはMONGODBのkeyを入れてください(keyvの場合は無くてもよい)

# delete_db
DBのデータを消します

# couston_id

```js
couston_id("HOGE")
```

  カスタムIDを決めれます(ない場合はBURISELECTJOB)
