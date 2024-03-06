const {apikey} = require("./config.json")
//const Datastore = require("nedb")
const OpenAI = require("openai")
const openai = new OpenAI({
    apiKey: apikey, // This is the default and can be omitted
});

class Conversation_handler{
    constructor(context){
        this.context = {"role":"system","content":context}
    }
    async generate(message){
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [this.context].concat(message),
            max_tokens: 1000
          });
          const reply = response.choices[0].message.content
            return reply
    }
}

module.exports = Conversation_handler

