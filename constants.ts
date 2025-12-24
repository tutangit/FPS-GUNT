
import { Weapon, Vector2 } from './types';

export const COLORS = {
  HUD_GREEN: '#00FF00',
  HUD_BG: 'rgba(0, 0, 0, 0.4)',
  CRITICAL_RED: '#FF0000',
};

// Deterministic Spray Pattern for AK-47 (Simplified)
const AK47_SPRAY: Vector2[] = [
  { x: 0, y: 0 },
  { x: 0.1, y: 0.2 },
  { x: -0.1, y: 0.4 },
  { x: 0.2, y: 0.6 },
  { x: -0.2, y: 0.8 },
  { x: 0.3, y: 1.0 },
  { x: -0.3, y: 1.1 },
  { x: 0.4, y: 1.2 },
  { x: -0.4, y: 1.25 },
  { x: 0, y: 1.3 },
];

export const WEAPONS: Record<string, Weapon> = {
  AK47: {
    id: 'ak47',
    name: 'CV-47',
    price: 2500,
    ammo: 30,
    maxAmmo: 30,
    reserve: 90,
    damage: 36,
    fireRate: 100,
    sprayPattern: AK47_SPRAY,
    recoilResetTime: 500,
  },
  M4A1: {
    id: 'm4a1',
    name: 'Maverick M4A1',
    price: 3100,
    ammo: 30,
    maxAmmo: 30,
    reserve: 90,
    damage: 33,
    fireRate: 90,
    sprayPattern: AK47_SPRAY.map(p => ({ x: p.x * 0.8, y: p.y * 0.8 })),
    recoilResetTime: 400,
  },
  DEAGLE: {
    id: 'deagle',
    name: 'Night Hawk .50C',
    price: 650,
    ammo: 7,
    maxAmmo: 7,
    reserve: 35,
    damage: 54,
    fireRate: 300,
    sprayPattern: [{ x: 0, y: 0 }, { x: 0, y: 1.0 }, { x: 0, y: 2.0 }],
    recoilResetTime: 800,
  }
};

export const PHYSICS = {
  GRAVITY: 800,
  MOVE_SPEED: 250,
  JUMP_FORCE: 300,
  FRICTION: 4,
  ACCELERATION: 10,
  AIR_ACCELERATION: 100,
  STOPSPEED: 100,
  PLAYER_HEIGHT: 72,
  CROUCH_HEIGHT: 36,
};
