/**
 * Seeded randomness shared by the rules — no I/O, deterministic.
 *
 * A rule that draws (daily deals, item stats, forge) takes a `() => number` uniform in [0, 1): the
 * server seeds it from `crypto.randomInt`, a tool from a hash of the row, a test from a constant.
 * The same seed gives the same sequence everywhere, so a draw can be logged and replayed.
 */

/** Small seeded PRNG (mulberry32): uniform in [0, 1), the same sequence for the same seed everywhere */
export function Mulberry32(seed: number): () => number {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
