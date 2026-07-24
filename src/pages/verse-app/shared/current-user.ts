import {
  CHALLENGE_ITEMS_DATA,
  USER_STUDY_STATS_DATA,
  VERSE_ITEMS_DATA,
  WEEKLY_STREAK_DATA,
} from '@/pages/verse-management/shared';

export const CURRENT_USER = USER_STUDY_STATS_DATA[0];

export const CURRENT_STREAK_DAYS = WEEKLY_STREAK_DATA;

export const FEATURED_VERSE = VERSE_ITEMS_DATA.find((verse) => verse.reference === '계 2:4')!;

export const TODAY_REVIEW_REFERENCES = ['계 1:4', '계 1:5', '계 2:2'];

export const TODAY_REVIEW_VERSES = VERSE_ITEMS_DATA.filter((verse) =>
  TODAY_REVIEW_REFERENCES.includes(verse.reference),
);

export const MY_CHALLENGE = CHALLENGE_ITEMS_DATA.find((challenge) => challenge.status === '진행중')!;

export function getDDay(endDate: string, today = '2026-07-22') {
  const diff = Math.round(
    (new Date(endDate).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff <= 0 ? 'D-Day' : `D-${diff}`;
}
