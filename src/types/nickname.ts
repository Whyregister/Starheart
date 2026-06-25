export type NicknameInput = {
  zodiacId: string;
  mbtiType: string;
  style: string;
  count: number;
};

export type NicknameResult = {
  value: string;
  source: {
    zodiac: string;
    mbti: string;
    style: string;
  };
};
