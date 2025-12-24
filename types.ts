
export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Weapon {
  id: string;
  name: string;
  price: number;
  ammo: number;
  maxAmmo: number;
  reserve: number;
  damage: number;
  sprayPattern: Vector2[];
  recoilResetTime: number;
  fireRate: number; // ms between shots
}

export enum GameState {
  MENU = 'MENU',
  BUY_TIME = 'BUY_TIME',
  ROUND_ACTIVE = 'ROUND_ACTIVE',
  ROUND_END = 'ROUND_END'
}

export interface PlayerStats {
  hp: number;
  armor: number;
  money: number;
  kills: number;
  deaths: number;
}
