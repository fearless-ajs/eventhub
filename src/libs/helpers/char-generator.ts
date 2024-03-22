import { randomInt } from 'crypto';

export const generateSixDigitToken = () => {
  const token = randomInt(100000, 999999);
  const tokenString = token.toString();

  if (tokenString.length != 6){
    return generateSixDigitToken();
  }

  return token;
}