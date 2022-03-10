/*
JSONDATA
*/
const dbset = async objct =>{
  await db.set(objct.data.in.guild.id,objct.rid)
 },
 dbget = objct =>{
  return db.get(objct)
 };
 const select_menu = select_data => {
   let n = 1,
   i=1;

   let data = select_data.arr.map(data => {
     const num = i++
     const datas = {
       "label": String(num),
       "value": `${String(n++)}${data.replace(/[^0-9]/g, '')}`,
       "description": `${num}番目のロール`,
       "emoji": null,
       "default": false
     }
     return datas;
   });
   const fotdata = {
     "components": [{
       "custom_id": customid||`BURISELECTJOB`,
       "disabled": false,
       "placeholder": select_data.title || "Nothing selected",
       "min_values": null,
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
   if (!data.role[0])return undefined;
    let n = 1;
    const content = data.role.map(roles=>{return `${n++}:${data.in.guild.roles.cache.get(roles.replace(/[^0-9]/g, ''))}`});
    dbset({data:data,rid:JSON.stringify(JSON.stringify(content))});
     let s = content.length/25,
    dataselect=[],
    datacontent=[];
     for(i=0; i < s; i++){
   const selectdata={title:data.title,arr:data.role.slice((((i+1)*25)-25),25*(i+1))};
   const select = select_menu(selectdata);
    datacontent.push(content.slice((((i+1)*25)-25),25*(i+1)));
    dataselect.push(select)
}
   return {content:datacontent,select:dataselect}
 },
   /*
 new select
 data=interaction
 bol=false:既にある,true:ない
   */
   select: data=>{
     if(data.customId!==(customid||"BURISELECTJOB")) return;
    try {
      if(data.member._roles.includes(data.values[0].slice(1))){
        return {bol:false,info:data.values[0].slice(1)}
      }else{
        return {bol:true,info:data.values[0].slice(1)}
      }
    } catch (error) {
      throw new Error(error);
    }
   },
/*
パネルを編集して追加
*/
 add_panel:async data=>{
  if (!data.role[0])return undefined;
  const message =await dbget(data.in.guild.id)
   if(!message) return undefined;
  const messagearr=data.role.concat(JSON.parse(JSON.parse(message))).map(arr=>arr.slice(1).slice(1))
   let n = 1;
   const content = messagearr.map(roles=>{return `${n++}:${data.in.guild.roles.cache.get(roles.replace(/[^0-9]/g, ''))}`});
   dbset({data:data,rid:JSON.stringify(JSON.stringify(content))});
  let s = content.length/25,
    dataselect=[],
    datacontent=[];
     for(i=0; i < s; i++){
   const selectdata={title:data.title,arr:messagearr.slice((((i+1)*25)-25),25*(i+1))};
   const select = select_menu(selectdata);
    datacontent.push(content.slice((((i+1)*25)-25),25*(i+1)));
    dataselect.push(select)
}
  return {content:datacontent,select:dataselect}
 },
delete_db:async ()=>{
  await db.clear()
}
 }