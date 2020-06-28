export function angleToRadians (angle: number): number {
  return angle * (Math.PI / 180);
}

export function polarToCartesian (x: number, y: number, radius: number, angle: number): {
  x: number;
  y: number;
} {
  const radians = angleToRadians(angle);

  return {
    x: x + (radius * Math.cos(radians)),
    y: y + (radius * Math.sin(radians))
  };
}
