import type { InlineQueryResult } from "telegraf/types"
import crypto from 'crypto';

let foresightsCache: string[] = [];
let cacheAge = 0;

const formatForesights = (foresights: string[]) => {
    return foresights.map((foresight) => {
        let formattedForesight = foresight;

        if(formattedForesight.startsWith('"')) {
            formattedForesight = formattedForesight.slice(1);
        }
        if(formattedForesight.endsWith(',')) {
            formattedForesight = formattedForesight.slice(0, -1);
        }
        if(formattedForesight.endsWith('"')){
            formattedForesight = formattedForesight.slice(0, -1);
        }

        return `${formattedForesight}`;
    });
}

const getForesights = async  () => {
    if(foresightsCache.length > 0 && Date.now() - cacheAge < 1000 * 60 * 60 * 1) {
        return foresightsCache;
    }

    const spreadsheetId = '1y0xDFUp7N9h5Wg-GA1vRzN6TYnRCXw92kim1PVD5aUg'

    const res = await fetch(
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`
    )

    const text = await res.text()

    const json = JSON.parse(text.substring(47).slice(0, -2))

    const rows = json.table.rows

    const [header, ...foresights] = rows.map((row: any) => row.c[1].v)

    const formattedForesights = formatForesights(foresights);

    foresightsCache = formattedForesights;
    cacheAge = Date.now();

    return formattedForesights;
}


export const getRandomForesight = async (name: string):Promise<InlineQueryResult> => {
    const foresights = await getForesights();
    const randomIndex = crypto.randomInt(0, foresights.length - 1);
    const foresight = foresights[randomIndex];

    return {
        type: 'article',
        id: '1',
        title: 'Начаклую....🔮',
        description: 'Дізнайся своє передбачення!',
        input_message_content: {
            message_text: `🔮 Передбачення для ${name}:\n\n${foresight}`
        }
    }
    
}