export const KONAMI = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

const KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', b: 'b', a: 'a' };

export function keyFromEvent(event) {
  return KEYS[event.key] ?? KEYS[event.key?.toLowerCase()] ?? null;
}

// Keeps the last N keys and compares with the code, so extra keys before it don't matter.
export function createKonami(onSuccess) {
  let buffer = [];
  return {
    press(key) {
      buffer = [...buffer, key].slice(-KONAMI.length);
      if (buffer.join() === KONAMI.join()) {
        buffer = [];
        onSuccess();
      }
    },
  };
}
