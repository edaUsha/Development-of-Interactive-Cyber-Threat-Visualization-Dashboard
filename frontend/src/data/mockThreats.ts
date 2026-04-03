export interface ThreatData {
  id: string;
  attackerIp: string;
  targetIp: string;
  port: number;
  attackType: string;
  device: string;
  country: string;
  targetCountry: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  attackerCoords: [number, number]; // [lat, lng]
  targetCoords: [number, number];
}

export const ATTACK_TYPES = ['DDoS', 'SQL Injection', 'XSS', 'Brute Force', 'Phishing', 'Ransomware', 'Man-in-the-Middle', 'Zero-Day Exploit'];
export const COUNTRIES = ['United States', 'Russia', 'China', 'Germany', 'Brazil', 'India', 'United Kingdom', 'Japan', 'South Korea', 'Iran', 'Nigeria', 'Australia'];
export const DEVICES = ['Web Server', 'Firewall', 'Router', 'Workstation', 'IoT Device', 'Database Server', 'Mail Server'];

const COORDS: Record<string, [number, number]> = {
  'United States': [39.8, -98.5],
  'Russia': [61.5, 105.3],
  'China': [35.8, 104.1],
  'Germany': [51.1, 10.4],
  'Brazil': [-14.2, -51.9],
  'India': [20.5, 78.9],
  'United Kingdom': [55.3, -3.4],
  'Japan': [36.2, 138.2],
  'South Korea': [35.9, 127.7],
  'Iran': [32.4, 53.6],
  'Nigeria': [9.0, 8.6],
  'Australia': [-25.2, 133.7],
};

function randomIp(): string {
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateThreat(id?: string): ThreatData {
  const country = randomFrom(COUNTRIES);
  let targetCountry = randomFrom(COUNTRIES);
  while (targetCountry === country) targetCountry = randomFrom(COUNTRIES);

  const severities: ThreatData['severity'][] = ['critical', 'high', 'medium', 'low'];
  const weights = [0.1, 0.25, 0.35, 0.3];
  const r = Math.random();
  let cumulative = 0;
  let severity: ThreatData['severity'] = 'low';
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (r <= cumulative) { severity = severities[i]; break; }
  }

  return {
    id: id || crypto.randomUUID(),
    attackerIp: randomIp(),
    targetIp: randomIp(),
    port: randomFrom([22, 80, 443, 3306, 5432, 8080, 3389, 25, 53, 8443]),
    attackType: randomFrom(ATTACK_TYPES),
    device: randomFrom(DEVICES),
    country,
    targetCountry,
    severity,
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    attackerCoords: COORDS[country],
    targetCoords: COORDS[targetCountry],
  };
}

export const mockThreats: ThreatData[] = Array.from({ length: 50 }, (_, i) => generateThreat(`threat-${i}`));
