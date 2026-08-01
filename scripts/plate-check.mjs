import assert from 'node:assert/strict';
import { HEX, MISSIONS, buildPlate, polyArea } from '../src/lib/plate.mjs';

const total = MISSIONS.reduce((n, m) => n + m.mois, 0);
const hex = polyArea(HEX);
let covered = 0;

for (const parcel of buildPlate()) {
  const m = MISSIONS.find((x) => x.id === parcel.id);
  const got = polyArea(parcel.poly) / hex;
  const want = m.mois / total;
  assert.ok(
    Math.abs(got - want) < 0.005,
    `${parcel.id} occupe ${(got * 100).toFixed(2)} % de la planche, attendu ${(want * 100).toFixed(2)} %`,
  );
  covered += got;
}

assert.ok(
  Math.abs(covered - 1) < 0.005,
  `les parcelles couvrent ${(covered * 100).toFixed(2)} % de la planche, attendu 100 %`,
);

console.log(`planche : ${MISSIONS.length} parcelles, aires conformes aux durées`);
