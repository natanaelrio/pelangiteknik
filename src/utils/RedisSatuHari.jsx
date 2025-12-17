export const RedisSatuHari = () => {
  const now = new Date();
  const nowUtc = now.getTime();

  const nextMidnightUtc = new Date();
  nextMidnightUtc.setUTCHours(17, 0, 0, 0); // 00:00 GMT+7 = 17:00 UTC hari ini

  // Jika sekarang sudah lewat jam 17:00 UTC, target ke besok
  if (nowUtc >= nextMidnightUtc.getTime()) {
    nextMidnightUtc.setUTCDate(nextMidnightUtc.getUTCDate() + 1);
  }

  const secondsUntilMidnight = Math.floor((nextMidnightUtc.getTime() - nowUtc) / 1000);
  return Math.max(secondsUntilMidnight, 1); // jaga-jaga TTL minimal 1 detik
};
