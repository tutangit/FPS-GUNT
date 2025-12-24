
import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { PhysicsController } from './services/physicsService';
import { WEAPONS, PHYSICS, COLORS } from './constants';
import { GameState, PlayerStats, Weapon } from './types';
import { Crosshair } from './components/Crosshair';
import { Radar } from './components/Radar';
import { BuyMenu } from './components/BuyMenu';

const App: React.FC = () => {
  // Game State
  const [gameState, setGameState] = useState<GameState>(GameState.ROUND_ACTIVE);
  const [stats, setStats] = useState<PlayerStats>({
    hp: 100,
    armor: 100,
    money: 800,
    kills: 0,
    deaths: 0,
  });
  const [currentWeapon, setCurrentWeapon] = useState<Weapon>(WEAPONS.DEAGLE);
  const [timer, setTimer] = useState(120);
  const [isBuyMenuOpen, setIsBuyMenuOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  // Refs for 3D and Logic
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const physicsRef = useRef<PhysicsController>(new PhysicsController());
  const inputRef = useRef({ forward: false, backward: false, left: false, right: false, jump: false, crouch: false });
  const mouseRef = useRef({ x: 0, y: 0 });
  const playerPosRef = useRef(new THREE.Vector3(0, 10, 0));
  const playerRotRef = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const frameIdRef = useRef<number>(0);

  // Round Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setTimer(t => (t > 0 ? t - 1 : 0));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Initial Scene Setup
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue (CS sky style)
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: false }); // Disable anti-alias for pixelated look
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 0.75 : 1); // Slight downscale for performance/vibe
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(100, 200, 100);
    scene.add(sunLight);

    // Geometry - "de_dust2" vibe blocks
    const floorGeo = new THREE.PlaneGeometry(1000, 1000);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xc2b280, roughness: 1 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Walls/Obstacles
    const boxGeo = new THREE.BoxGeometry(40, 80, 40);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 1 });
    
    // Random crates
    for(let i=0; i<20; i++) {
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.position.set(
        (Math.random() - 0.5) * 800,
        40,
        (Math.random() - 0.5) * 800
      );
      scene.add(box);
    }

    // Pointer Lock
    const handleLock = () => {
      renderer.domElement.requestPointerLock();
    };
    canvasRef.current.addEventListener('click', handleLock);

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === renderer.domElement) {
        playerRotRef.current.y -= e.movementX * 0.002;
        playerRotRef.current.x -= e.movementY * 0.002;
        playerRotRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, playerRotRef.current.x));
      }
    };
    document.addEventListener('mousemove', handleMouseMove);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w') inputRef.current.forward = true;
      if (e.key === 's') inputRef.current.backward = true;
      if (e.key === 'a') inputRef.current.left = true;
      if (e.key === 'd') inputRef.current.right = true;
      if (e.key === ' ') inputRef.current.jump = true;
      if (e.key === 'Shift') inputRef.current.crouch = true;
      if (e.key === 'b' && !isBuyMenuOpen) setIsBuyMenuOpen(true);
      if (e.key === 'Escape') setIsBuyMenuOpen(false);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w') inputRef.current.forward = false;
      if (e.key === 's') inputRef.current.backward = false;
      if (e.key === 'a') inputRef.current.left = false;
      if (e.key === 'd') inputRef.current.right = false;
      if (e.key === ' ') inputRef.current.jump = false;
      if (e.key === 'Shift') inputRef.current.crouch = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game Loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!isBuyMenuOpen) {
        // Update Physics
        playerPosRef.current = physicsRef.current.update(
          playerPosRef.current,
          inputRef.current,
          playerRotRef.current,
          delta
        );

        // Update Camera
        camera.position.copy(playerPosRef.current);
        camera.position.y += inputRef.current.crouch ? PHYSICS.CROUCH_HEIGHT : PHYSICS.PLAYER_HEIGHT;
        camera.quaternion.setFromEuler(playerRotRef.current);
      }

      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      canvasRef.current?.removeEventListener('click', handleLock);
    };
  }, [isBuyMenuOpen]);

  const handleBuy = (weapon: Weapon) => {
    setStats(prev => ({ ...prev, money: prev.money - weapon.price }));
    setCurrentWeapon(weapon);
    setIsBuyMenuOpen(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-screen">
      {/* 3D Canvas */}
      <div ref={canvasRef} className="w-full h-full" />

      {/* Crosshair */}
      <Crosshair />

      {/* HUD - HP & Armor */}
      <div className="fixed bottom-8 left-8 flex items-end space-x-12 select-none">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-green-500/60 uppercase">Health</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-6xl font-black text-green-500 font-mono tracking-tighter">{stats.hp}</span>
            <div className="w-8 h-8 border-2 border-green-500 flex items-center justify-center font-bold">+</div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-green-500/60 uppercase">Armor</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-6xl font-black text-green-500 font-mono tracking-tighter">{stats.armor}</span>
            <div className="w-8 h-8 border-2 border-green-500 flex items-center justify-center">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-green-500 stroke-[3px]">
                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
               </svg>
            </div>
          </div>
        </div>
      </div>

      {/* HUD - Round Timer */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2">
        <div className="bg-black/40 border-b-2 border-green-500/40 px-8 py-2">
          <span className="text-4xl font-black text-green-500 font-mono">{formatTime(timer)}</span>
        </div>
      </div>

      {/* HUD - Money */}
      <div className="fixed top-1/2 right-8 -translate-y-1/2 flex flex-col items-end">
        <span className="text-xs font-bold text-green-500/60 uppercase">Cash</span>
        <span className="text-5xl font-black text-green-500 font-mono leading-none">${stats.money}</span>
      </div>

      {/* HUD - Ammo & Weapon */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end">
        <span className="text-xl font-bold text-green-500 uppercase tracking-widest mb-1">{currentWeapon.name}</span>
        <div className="flex items-baseline space-x-2">
          <span className="text-6xl font-black text-green-500 font-mono">{currentWeapon.ammo}</span>
          <span className="text-3xl font-bold text-green-500/40 font-mono">/ {currentWeapon.reserve}</span>
        </div>
      </div>

      {/* Radar */}
      <Radar 
        playerPosition={{ x: playerPosRef.current.x, y: playerPosRef.current.y, z: playerPosRef.current.z }} 
        playerRotation={playerRotRef.current.y} 
      />

      {/* Buy Menu Overlay */}
      {isBuyMenuOpen && (
        <BuyMenu 
          money={stats.money} 
          onBuy={handleBuy} 
          onClose={() => setIsBuyMenuOpen(false)} 
        />
      )}

      {/* Controls Help */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-green-500/30 uppercase font-bold tracking-[0.2em] pointer-events-none">
        WASD: Move | SPACE: Jump | SHIFT: Crouch | B: Buy | MOUSE1: Fire
      </div>
    </div>
  );
};

export default App;
