const mineflayer = require('mineflayer')
const aiChatTurbot3 = require('./ai-chat-turbot3')
const {Natto} = require('./ai-chat')
const Intermediate = require("./chat-intermediate")
const pathfind = require("./pathfind")
const goto = require("./goto")

const natto = new Natto("Minecraft")
const inter = new Intermediate("Minecraft", natto)
let repl = require("repl");

var FISHING_ROD = 346, RAW_FISH = 349;

var FISHING_INTERVAL = 200;

const bot = mineflayer.createBot({
  host: '',//"localhost", // // minecraft server ip
  username: 'Nattochan', // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  auth: 'offline', // for offline mode servers, you can set this to 'offline'
  port: 5555              // set if you need a port that isn't 25565
  // version: false,           // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
  // password: '12345678'      // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
})

bot.on('chat', async (username, message) => {
  if (username === bot.username) return
  // let mes = await aiChatTurbot3.execute(message, "Minecraft", username)
  // let mes = await natto.gen_speech(message, username)
  if (username == "Knilios" && message=="fish"){
    fishing()
  }
  let mes = await inter.gen_speech(message, username)
  console.log("mes: ", mes)
  if(mes[0].trim() != "") bot.chat(mes[0])
  console.log("username", mes[1].trim().match(/(?<=\().*(?=\))/g)[0])
  // assuming nothing errors
  if(mes[1].trim() == "donothing()") return
  if(mes[1].trim().match(/.*(?=\()/g)[0] == "follow"){
    let name = mes[1].trim().match(/(?<=\().*(?=\))/g)[0]
    pathfind(bot, name, natto)
  }
  else if(mes[1].trim().match(/.*(?=\()/g)[0] == "goto"){
    let pos = mes[1].trim().match(/(?<=\().*(?=\))/g)[0].split(",")
    goto(bot, natto, pos[0], pos[1])
  }
  console.log(mes[0])
  
})

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)

bot.on('playerCollect', function(collector, collected){
  if(collector.username === '<username>'){
    console.log("Now have ", collected.displayName , ".");
  }
});


// bad code here
var fishing = function(){
  // No fishing rods left.
  if(bot.inventory.count(FISHING_ROD) <= 0){
    console.error("No fishing rods now.");
    return;

  // Fishing rod broken, switch to fishing rod then continue fishing.
  }else if(!( bot.heldItem && bot.heldItem.type === FISHING_ROD)){
    var rod = bot.inventory.findInventoryItem(FISHING_ROD);
    bot.equip(rod, 'hand', function(err){
      if(err) throw err;
      console.log(bot.inventory.count(FISHING_ROD) , "fishing rods left.");
    });
  }else{
    // Just fish.
    bot.activateItem();
  }
  setTimeout(fishing, FISHING_INTERVAL);
}