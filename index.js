/*
JSONDATA
*/
const arrdata = "abcdefghijklmnopqrstuvwxyz".split(""),
dbset = async objct =>await db.set(objct.data.in.guild.id,objct.rid),
select_menu = select_data => {
  let i = 0,
 num = select_data.num;
   const data = select_data.arr.map(data => {
    num++
    const datas = {
       "label": String(num),
       "value": `${arrdata[i++]}${data.replace(/[^0-9]/g, '')}`,
       "description": `${num}番目のロール`
     }
     return datas;
   }),
   fotdata = {
     "components": [{
       "custom_id": customid||`BURISELECTJOB`,
       "placeholder": select_data.title || "Nothing selected",
       "options": data,
       "type": 3
     }],
     "type": 1
   };
   return fotdata;
 };
 let db,
 customid;
 module.exports = {
  couston_id:c=>customid=c,
 /*
 1=mongo(nosql)
 0=keyv(sql)
 */
 db_type:dbs=> {
   if (dbs.id) {
 const mongo = require("aurora-mongo");
 mongo.connect(dbs.key)
 db = new mongo.Database(dbs.label)
   } else {
 const Keyv = require('keyv');
 db = new Keyv(`sqlite://${dbs.label}.sqlite`, { table: dbs.label });
   }
 },
 /*
 role=arr
 new message
 */
 create_panel:data=> {
   if (!data.role[0])return 1;
   for(let i=0; i < data.role.length; i++)if(!data.in.guild.roles.cache.get(data.role[i].replace(/[^0-9]/g, ''))) return 2;
    let n = 1;
    const content = data.role.map(roles=>{return`${n++}:${data.in.guild.roles.cache.get(roles.replace(/[^0-9]/g, ''))}`});
    dbset({data:data,rid:JSON.stringify(content)});
     let s = content.length/25,
    dataselect=[],
    datacontent=[];
     for(i=0; i < s; i++){
   const select=select_menu({title:data.title,arr:data.role.slice((((i+1)*25)-25),25*(i+1)),num:(((i+1)*25)-25)});
    datacontent.push(content.slice((((i+1)*25)-25),25*(i+1)));
    dataselect.push(select);
    };
   return {content:datacontent,select:dataselect}
 },
   /*
 new select
 data=interaction
 bol=false:既にある,true:ない
   */
   select: data=>{
     if(data.customId!==(customid||"BURISELECTJOB")) return 1;
     const info = data.values[0].slice(1);
      if(data.member._roles?.includes(info))return {bol:false,info:info};
        return {bol:true,info:info};
   },
/*
パネルを編集して追加
*/
 add_panel:async data=>{
  if (!data.role[0])return 1;
  const message =await db.get(data.in.guild.id);
   if(!message) return 2;
  const messagearr=data.role.concat(JSON.parse(message)).map(arr=>arr.slice(2));
  for(let i=0; i < messagearr.length; i++)if(!data.in.guild.roles.cache.get(messagearr[i].replace(/[^0-9]/g, ''))) return 3;
   let n = 1;
   const content = messagearr.map(roles=>{return `${n++}:${data.in.guild.roles.cache.get(roles.replace(/[^0-9]/g, ''))}`});
   dbset({data:data,rid:JSON.stringify(content)});
  let s = content.length/25,
    dataselect=[],
    datacontent=[];
     for(i=0; i < s; i++){
   const select=select_menu({title:data.title,arr:messagearr.slice((((i+1)*25)-25),25*(i+1)),num:(((i+1)*25)-25)});
    datacontent.push(content.slice((((i+1)*25)-25),25*(i+1)));
    dataselect.push(select);
};
  return {content:datacontent,select:dataselect};
 },
   /*
   すべてのデータを消す
*/
clear_db:async ()=>{
  await db.clear();
},
remove_panel:async data=>{
  const dbcontent = await db.get(data.in.guild.id);
  if(!dbcontent) return 1;
  const message =JSON.parse(dbcontent),
  number = Number(data.num)-1;
  if(!(Math.floor(message.length/25)*25<=number&&number<message.length)) return 2;
  const fotmsg = message.filter(elm =>elm !== message[number]);
  let num = Math.floor(fotmsg.length/25)*25;  
  const msg = fotmsg.slice(num),
  content=msg.map(roles=>{return `${(num++)+1}:${data.in.guild.roles.cache.get(roles.slice(2).replace(/[^0-9]/g, ''))}`});
  dbset({data:data,rid:JSON.stringify(fotmsg)});
  const select = select_menu({title:data.title,arr:content.map(role=>role.slice(2)),num:Math.floor(fotmsg.length/25)*25});
  if(!content) return 3;
  return{content:content,select:select};
},
   delete_db:async data=>{
     const check = await db.get(data);
     if(!check) return 1;
     await db.delete(data);
     return 2;
   }
 }