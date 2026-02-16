import crypto from 'crypto';

export const getRandom = (min: number, max: number) => {
    return crypto.randomInt(min, max + 1);
}