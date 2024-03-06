const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow
const GoalBlock = goals.GoalBlock
const Nattochan_mananger = "Nattochan-internal-system"



async function followPlayer(bot, person, natto) {
    bot.loadPlugin(pathfinder)
    const playerCI = bot.players[person]

    if (!playerCI || !playerCI.entity) {
        reply = await natto.gen_speech("You are too far from that person to follow.", Nattochan_mananger)
        bot.chat(reply)
        return
    }

    const mcData = require('minecraft-data')(bot.version)
    const movements = new Movements(bot, mcData)
    movements.scafoldingBlocks = []

    bot.pathfinder.setMovements(movements)

    const goal = new GoalFollow(playerCI.entity, 1)
    bot.pathfinder.setGoal(goal, true)
}

module.exports = followPlayer