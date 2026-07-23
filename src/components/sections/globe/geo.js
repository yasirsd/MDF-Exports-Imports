import * as THREE from "three";

/**
 * Convert latitude/longitude to a 3D position on a sphere of `radius`.
 * @returns {THREE.Vector3}
 */
export function latLngToVec3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/**
 * Build a great-circle-ish quadratic arc between two lat/lng points,
 * bowed outward from the sphere for a shipping-lane feel.
 * @returns {THREE.QuadraticBezierCurve3}
 */
export function buildArc(from, to, radius) {
  const start = latLngToVec3(from.lat, from.lng, radius);
  const end = latLngToVec3(to.lat, to.lng, radius);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const distance = start.distanceTo(end);
  // Lift the control point proportionally to the arc length.
  mid.normalize().multiplyScalar(radius + distance * 0.5);
  return new THREE.QuadraticBezierCurve3(start, mid, end);
}
