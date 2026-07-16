// src/utils/progress.ts
import type { ActivityEntry } from '../types/progress';

/**
 * Cuenta días consecutivos con actividad (minutes_spent > 0), empezando
 * desde hoy hacia atrás. Si hoy todavía no tiene actividad registrada
 * (ej. el usuario apenas entró y el ping aún no corre), la racha se
 * cuenta desde ayer para no romperla injustamente.
 */
export const calculateStreak = (activity: ActivityEntry[]): number => {
  const activeDates = new Set(
    activity.filter((a) => a.minutes_spent > 0).map((a) => a.activity_date)
  );

  if (activeDates.size === 0) return 0;

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  const todayStr = cursor.toISOString().split('T')[0];
  if (!activeDates.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (true) {
    const dateStr = cursor.toISOString().split('T')[0];
    if (!activeDates.has(dateStr)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

/** Suma todos los minutos y los convierte a horas con 1 decimal. */
export const sumStudyHours = (activity: ActivityEntry[]): number => {
  const totalMinutes = activity.reduce((sum, a) => sum + a.minutes_spent, 0);
  return Math.round((totalMinutes / 60) * 10) / 10;
};