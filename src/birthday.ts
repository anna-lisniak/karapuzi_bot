import type { Context, Telegraf } from "telegraf";
import type { Update } from "telegraf/types";
import { getRandom } from "./random.js";

interface User {
    username: string;
    birthday: `${number}.${number}`;
    child: {
        birthday: `${number}.${number}`;
        name: string;
        gender: 'хлопчик' | 'дівчинка';
    }
}

const getUsers = async () => {
    const spreadsheetId = '1y0xDFUp7N9h5Wg-GA1vRzN6TYnRCXw92kim1PVD5aUg'

    const res = await fetch(
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=ДН`
    )

    const text = await res.text()
    const json = JSON.parse(text.substring(47).slice(0, -2))
    const rows = json.table.rows

    const users = rows.map((row: any) => ({
        username: row.c[0]?.v,
        birthday: row.c[2]?.v,
        child: {
            birthday: row.c[3]?.v,
            name: row.c[4]?.v,
            gender: row.c[5]?.v,
        }
    })).filter(Boolean);

    return users as User[];
}

const getWishes = async () => {
    const spreadsheetId = '1y0xDFUp7N9h5Wg-GA1vRzN6TYnRCXw92kim1PVD5aUg'

    const res = await fetch(
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=ДН`
    )

    const text = await res.text()
    const json = JSON.parse(text.substring(47).slice(0, -2))
    const rows = json.table.rows

    const momWishes = rows.map((row: any) => (row.c[11]?.v)).filter(Boolean);
    const multiMomWishes = rows.map((row: any) => (row.c[12]?.v)).filter(Boolean);
    const babyGirlWishes = rows.map((row: any) => (row.c[13]?.v)).filter(Boolean);
    const babyBoyWishes = rows.map((row: any) => (row.c[14]?.v)).filter(Boolean);
    const multiBabyWishes = rows.map((row: any) => (row.c[15]?.v)).filter(Boolean);

    return {
        momWishes,
        multiMomWishes,
        babyGirlWishes,
        babyBoyWishes,
        multiBabyWishes
    }
}

const getTodayBirthdays = (users: Pick<User, 'birthday'>[]) => {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;

    return users.filter((user) => {
        if(!user.birthday) return false;
        const [day, month] = user.birthday.split('.');
        if(!day || !month) return false;
        return +day === todayDay && +month === todayMonth;
    });
}

export const processBirthday = async (bot:Telegraf<Context<Update>> ) => {
    const users = await getUsers();
    const wishes = await getWishes();
    console.log({wishes})

    const momBirthdays = getTodayBirthdays(users);
    const childBirthdays = getTodayBirthdays(users.map((user) => user.child));

    console.log('momBirthdays', momBirthdays)
    console.log('childBirthdays', childBirthdays)



    let message;

    if(momBirthdays.length === 1) { 
        const mom = momBirthdays[0] as User;
        message =`✨ Сьогодні День народження у прекрасної ${mom.username}!
        
${wishes.momWishes.at(getRandom(0, wishes.momWishes.length - 1))}
        `
    }

    if(momBirthdays.length > 1) {
        
        message = `✨ Сьогодні День народження одразу у кількох неймовірних жінок у нашому чаті: ${(momBirthdays as User[]).map((mom) => `${mom.username}`).join(', ')}!
        
${wishes.multiMomWishes.at(getRandom(0, wishes.multiMomWishes.length - 1))}
        `
    }
    
    if(childBirthdays.length === 1) {
        const child = childBirthdays[0] as User['child'];

        if(child.gender === 'дівчинка') {
            message = `🎀 Сьогодні свято в чарівної ${child.name}!
            
${wishes.babyGirlWishes.at(getRandom(0, wishes.babyGirlWishes.length - 1))}
            `
        }

        if(child.gender === 'хлопчик') {
            message = `🚗 Сьогодні свято в чарівного ${child.name}!
            
${wishes.babyBoyWishes.at(getRandom(0, wishes.babyBoyWishes.length - 1))}
            `
        }
    }

    if(childBirthdays.length > 1) {
        
        message = `🎂 Сьогодні особливий день — одразу кілька Днів народження у наших маленьких карапузиків! 
        Вітаю ${(childBirthdays as User['child'][]).map((child) => child.name).join(', ')}!
        
${wishes.multiBabyWishes.at(getRandom(0, wishes.multiBabyWishes.length - 1))}
        `
    }

    if(message) {
        await bot.telegram.sendMessage(
            -1002122724301,
            message
        )
    }
}