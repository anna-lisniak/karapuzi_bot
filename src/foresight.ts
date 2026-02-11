import type { InlineQueryResult } from "telegraf/types"
import { foresightResults } from "./foresight_results.js"

export const getRandomForesight = (name: string):InlineQueryResult => {
    const randomIndex = Math.floor(Math.random() * foresightResults.length)
    return {
         type: 'article',
    id: '1',
    title: 'Начаклую....🔮',
    description: 'Дізнайся своє передбачення!',
    input_message_content: {
      message_text: `🔮 Передбачення для ${name}:\n\n${foresightResults[randomIndex]}`
    }
    }
    
}