
import * as THREE from 'three';
import { PHYSICS } from '../constants';

export class PhysicsController {
  velocity: THREE.Vector3 = new THREE.Vector3();
  isGrounded: boolean = false;

  update(
    position: THREE.Vector3,
    input: { forward: boolean; backward: boolean; left: boolean; right: boolean; jump: boolean; crouch: boolean },
    rotation: THREE.Euler,
    delta: number
  ) {
    const moveDir = new THREE.Vector3();
    if (input.forward) moveDir.z -= 1;
    if (input.backward) moveDir.z += 1;
    if (input.left) moveDir.x -= 1;
    if (input.right) moveDir.x += 1;
    moveDir.normalize();

    // Rotate moveDir to face player orientation
    moveDir.applyEuler(new THREE.Euler(0, rotation.y, 0));

    if (this.isGrounded) {
      this.applyFriction(delta);
      this.accelerate(moveDir, PHYSICS.MOVE_SPEED, PHYSICS.ACCELERATION, delta);
      
      if (input.jump) {
        this.velocity.y = PHYSICS.JUMP_FORCE;
        this.isGrounded = false;
      }
    } else {
      // Air strafing logic
      this.accelerate(moveDir, PHYSICS.MOVE_SPEED, PHYSICS.AIR_ACCELERATION, delta);
      this.velocity.y -= PHYSICS.GRAVITY * delta;
    }

    // Apply movement
    const nextPos = position.clone().add(this.velocity.clone().multiplyScalar(delta));
    
    // Simple ground collision
    if (nextPos.y <= 0) {
      nextPos.y = 0;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    // Rough map bounds
    nextPos.x = Math.max(-500, Math.min(500, nextPos.x));
    nextPos.z = Math.max(-500, Math.min(500, nextPos.z));

    return nextPos;
  }

  private applyFriction(delta: number) {
    const speed = this.velocity.length();
    if (speed < 0.1) {
      this.velocity.set(0, this.velocity.y, 0);
      return;
    }

    const drop = Math.max(speed, PHYSICS.STOPSPEED) * PHYSICS.FRICTION * delta;
    const newSpeed = Math.max(0, speed - drop);
    const factor = newSpeed / speed;
    
    this.velocity.x *= factor;
    this.velocity.z *= factor;
  }

  private accelerate(wishDir: THREE.Vector3, wishSpeed: number, accel: number, delta: number) {
    const currentSpeedInWishDir = this.velocity.dot(wishDir);
    const addSpeed = wishSpeed - currentSpeedInWishDir;

    if (addSpeed <= 0) return;

    const accelSpeed = accel * delta * wishSpeed;
    const finalAccelSpeed = Math.min(accelSpeed, addSpeed);

    this.velocity.x += wishDir.x * finalAccelSpeed;
    this.velocity.z += wishDir.z * finalAccelSpeed;
  }
}
