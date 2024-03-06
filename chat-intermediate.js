const {apikey} = require("./config.json")
//const Datastore = require("nedb")
const {Natto} = require("./ai-chat")
const OpenAiHandler = require("./openai_handler")

class Intermediate{
    constructor(game, natto=new Natto(game)){
        this.natto = natto
        this.handler = new OpenAiHandler("You are a Minecraft bot action decider of a Minecraft bot called Nattochan . You job is to read a conversation of in Minecraft and decide what should Nattochan execute based on Nattochan's speech . This is what you should output:\nfollow({player name})\ngoto({Minecraft Coordinate})\ndonothing()\nIf Nattochan's action is not in the specified list above, for example if users ask Nattochan to build a house and Nattochan agrees to do it, output this:error()")
    }
    async gen_speech(message, username){
        console.log("here")
        let reply = await this.natto.gen_speech(message, username)
        if(reply == "") return ["", "donothing()"]
        let todo = await this.handler.generate([{'role':'user','content':`${username}:${message}`}, {'role':'assistant','content':`Nattochan:${reply}`}])
        console.log(todo)
        return [reply, todo]
    }
}

module.exports = Intermediate