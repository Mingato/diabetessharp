/// <reference types="vite/client" />

declare module "*.css" {
  const src: string;
  export default src;
}

declare module "canvas-confetti" {
  interface Options {
    particleCount?: number;
    spread?: number;
    angle?: number;
    origin?: { x?: number; y?: number };
  }
  function confetti(options?: Options): Promise<null>;
  export default confetti;
}
