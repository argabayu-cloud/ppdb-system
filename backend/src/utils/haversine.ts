/**
 * Menghitung jarak antara dua titik koordinat menggunakan rumus Haversine
 * @param lat1 - Latitude titik 1 (dalam derajat)
 * @param lon1 - Longitude titik 1 (dalam derajat)
 * @param lat2 - Latitude titik 2 (dalam derajat)
 * @param lon2 - Longitude titik 2 (dalam derajat)
 * @returns Jarak dalam kilometer
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Radius bumi dalam kilometer
  const R = 6371;

  // Konversi derajat ke radian
  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  // Bulatkan ke 2 desimal
  return Math.round(distance * 100) / 100;
}