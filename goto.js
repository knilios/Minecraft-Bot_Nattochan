const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow
const GoalBlock = goals.GoalBlock
const GoalXZ =goals.GoalXZ
const Nattochan_mananger = "Nattochan-internal-system"



function goto(bot, natto, x, z) {
    bot.loadPlugin(pathfinder)

    const mcData = require('minecraft-data')(bot.version)
    const movements = new Movements(bot, mcData)
    movements.scafoldingBlocks = []

    bot.pathfinder.setMovements(movements)

    const goal = new GoalXZ(x,z)
    bot.pathfinder.setGoal(goal, true)
}

module.exports = goto