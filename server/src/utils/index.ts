import * as md5 from 'md5';
export const generateRandomNumber = (digits: number = 6): string => {
  let result = '';
  for (let i = 0; i < digits; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    result += randomDigit.toString();
  }
  return result;
};

export const hashPassword = (password: string, salt: string) => {
  return md5(password + salt);
};

export const wait = (timeout = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeout);
  });
};
