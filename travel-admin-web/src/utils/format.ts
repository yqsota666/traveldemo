import dayjs from 'dayjs';

export function formatDateTime(value: unknown) {
  if (!value) return '-';
  const date = dayjs(String(value));
  return date.isValid() ? date.format('YYYY-MM-DD HH:mm') : String(value);
}

export function emptyText(value: unknown) {
  if (value === undefined || value === null || value === '') return '-';
  return String(value);
}
