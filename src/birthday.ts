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

export const processBirthday = async () => {
    const users = await getUsers();
    const wishes = await getWishes();
    console.log({wishes})

    const momBirthdays = getTodayBirthdays(users);
    const childBirthdays = getTodayBirthdays(users.map((user) => user.child));

    console.log('momBirthdays', momBirthdays)
    console.log('childBirthdays', childBirthdays)
    
    

}