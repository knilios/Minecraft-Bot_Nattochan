const conversation_cut_length = 7
const {apikey} = require("./config.json")
//const Datastore = require("nedb")
const OpenAI = require("openai")
const openai = new OpenAI({
  apiKey: apikey, // This is the default and can be omitted
});

let conversation_cache = [];
let recent_coversation = [];
//initiate database
//const promptbase = new Datastore("Messages.db")
//promptbase.loadDatabase();

module.exports = {
    name: "chat",
    description : "THIS IS THE FIRST TIME EVER THAT NATTOCHAN WILL BE MORE ALIVE THAN EVER!!!!!",
    async execute(message, current_game, username) {
        let to_return = ""
        let input = message;
        if(input==""){
            return "say something!!!!!" 
        }
        //get prompt from the promptbase
        console.log("initiate get data")
        //let aqquiredPrompt
        //let version ;
        //promptbase.find({pointer:"here"},(err,docs)=>{
        //  console.log("finding the version")
        //  if(err) return console.log(err)
        //  console.log(docs)
        //  version = docs[0].counter
        //  promptbase.find({version:version}, async (error,docsN)=>{
        //    if(error) return console.log(error)
        //    aqquiredPrompt = docsN[0].text

            //the main function to talk with open ai
            //const newaqquiredPrompt = await aqquiredPrompt.replace(/\!\{current_game\}/g,current_game).replace('!{username}',message.author.username).replace('!{input}',input)
            const messages = [
              {"role":"system","content":`Pretend that you are Nattochan, a female Japanese anime style fortune teller Discord chatbot which its sole purpose is to be annoying.Nattochan's creator is Knilios.Nattochan hate Knilios because Knilios always rage on her for not performing well enough.Nattochan likes to play games.Now she's playing ${current_game}.**Only Generate Nattochan's speech**.`},
              //{"role":"user","content":"example:Hello Natto-chan"},
              //{"role":"assistant","content":"Nattochan:Sorry, I can't speak English."},
              //{"role":"user","content":"example:You are useless!"},
              //{"role":"assistant","content":"Nattochan:I am NOT! WAHHHHHHHHHHHHHHHHHHHHHH(crying)"},
              //{"role":"user","content":"example:whats your new year resolution?"},
              //{"role":"assistant","content":"Nattochan:I want to be less useless! By being more useless!"},
            ]
            let new_message = messages.concat(conversation_cache)
            new_message.push({"role":"user","content":`${username}:${input}`})
            console.log(new_message)
            const response = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages:new_message,
              max_tokens: 1000
            });
            console.log("user : ",username)
            //console.log(response.data)
            const reply = response.choices[0].message.content
            const splited_reply = reply.split(/\r?\n/g)
            console.log("response : ",reply)
            console.log(splited_reply)
            for(let i of splited_reply){
                if(i != '') {
                    if(i.match(/(?<=Nattochan:).*/g)) to_return = i.match(/(?<=Nattochan:).*/g)[0].trim()
                    else to_return = i
                }
                
            } 
            
            conversation_cache.push({"role":"user","content":username+":"+input},{"role":"assistant","content":reply})
            
            //cut the stacked conversation history to save money
            if(conversation_cache.length >= conversation_cut_length){
              let conversation_input=""//"Summarize this conversation for Nattochan to read, given that Nattochan is a anime style female chatbot:\n" ;
              for(i of conversation_cache) {
                conversation_input = conversation_input+ i.content+"\n"
              }
              conversation_input= conversation_input+"\nsummary:"
              console.log(conversation_input)
              const conversation_processed_input = [{role:"system",content:"Summarize all the context in this following Discord chat for Nattochan to read, given that Nattochan is a anime style female chatbot."},{role:"user",content:conversation_input}]
              const brief = await openai.chat.completions.create({
                model:'gpt-3.5-turbo',
                messages:conversation_processed_input,
                temperature: 0.12,
                max_tokens: 1000
              })
              const briefed = brief.choices[0].message.content;
              console.log(briefed)
              conversation_cache = [{'role':'user','content':`previous conversation context:${briefed}`}]
            }
         //   })
         // })        
//        promptbase.find({version:version}, (error,docsN)=>{
//          console.log("finding the prompt")
//          if(error) return console.log(error)
//          aqquiredPrompt = docsN[0].text
//          console.log("aqq prompt : ",aqquiredPrompt)
//        })
//      
      
            return to_return
    }
}
