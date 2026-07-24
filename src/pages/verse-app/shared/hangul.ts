const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;
const CHOSEONG_COUNT = 588;

export function toChoseong(text: string): string {
  return Array.from(text)
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code < HANGUL_BASE || code > HANGUL_LAST) return char;
      const choseongIndex = Math.floor((code - HANGUL_BASE) / CHOSEONG_COUNT);
      return CHOSEONG[choseongIndex];
    })
    .join('');
}
