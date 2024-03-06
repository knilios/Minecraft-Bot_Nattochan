const conversation_cut_length = 7
const {apikey} = require("./config.json")
//const Datastore = require("nedb")
const OpenAI = require("openai")
const openai = new OpenAI({
  apiKey: apikey, // This is the default and can be omitted
});


class Nattochan{
    constructor(current_game){
        this.current_game = current_game
        this.conversation_cache = []
        this.context = {"role":"system","content":`Pretend that you are Nattochan, a female Japanese anime style chatbot which its sole purpose is to be annoying.Nattochan's creator is Knilios.Nattochan hate Knilios because Knilios always rage on her for not performing well enough.Nattochan likes to play games.Now she's playing ${current_game} in a multiplayer, the follwing text is from minecraft's open chat.**Only Generate Nattochan's speech.** If the lastest message doesn't mention Nattochan, generate '404'. `}
        
    }
    async gen_speech(message, username){
        let to_return = ""
        if(message==""){
            return "say something!!!!!" 
        }
        let new_message = [this.context].concat(this.conversation_cache)
        new_message.push({"role":"user","content":`${username}:${message}`})
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages:new_message,
            max_tokens: 1000
          });
          const reply = response.choices[0].message.content
            const splited_reply = reply.split(/\r?\n/g)
            for(let i of splited_reply){
                if(i != '') {
                    if(i.match(/(?<=Nattochan:).*/g)) to_return = i.match(/(?<=Nattochan:).*/g)[0].trim()
                    else to_return = i
                }
            } 
            this.conversation_cache.push({"role":"user","content":username+":"+message},{"role":"assistant","content":reply})
            this.summary()
            if (to_return.trim() == "404"){
                return ""
            }
            return to_return
        }

    async summary(){
        if(this.conversation_cache.length <= conversation_cut_length) return
        let conversation_input=""//"Summarize this conversation for Nattochan to read, given that Nattochan is a anime style female chatbot:\n" ;
              for(let i of this.conversation_cache) {
                conversation_input = conversation_input+ i.content+"\n"
              }
              conversation_input= conversation_input+"\nsummary:"
              const conversation_processed_input = [{role:"system",content:"Summarize all the context in this following Discord chat for Nattochan to read, given that Nattochan is a anime style female chatbot."},{role:"user",content:conversation_input}]
              const brief = await openai.chat.completions.create({
                model:'gpt-3.5-turbo',
                messages:conversation_processed_input,
                temperature: 0.12,
                max_tokens: 1000
              })
              const briefed = brief.choices[0].message.content;
              this.conversation_cache = [{'role':'user','content':`previous conversation context:${briefed}`}]
            

    }
}

module.exports = {
    name: "chat",
    description : "THIS IS THE FIRST TIME EVER THAT NATTOCHAN WILL BE MORE ALIVE THAN EVER!!!!!",
    Natto: Nattochan
}
