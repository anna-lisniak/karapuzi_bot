import type { InlineQueryResult } from "telegraf/types"
import { foresightResults } from "./foresight_results.js"
import crypto from 'crypto';



export const getRandomForesight = (name: string):InlineQueryResult => {
    const randomIndex = crypto.randomInt(0, foresightResults.length - 1);

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