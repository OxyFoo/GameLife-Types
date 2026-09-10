/**
 * Pure rules of the activity ox economy — no I/O, deterministic.
 *
 * Shipped by the shared package on purpose: the app previews a price, the server applies it, and the
 * two must agree to the ox. Both import this very module, so there is nothing left to keep in sync.
 *
 * Rules (product owner, 2026-09-06):
 * - An activity grants 1 ox per minute iff it grants XP: skill with XP, added at most 48h after
 *   its start, already started, and within the 12h all-or-nothing chronological budget of its
 *   local day.
 * - Deleting or editing an activity settles the ox difference. The first costly operation of the
 *   week (Monday 00:00 UTC) is at base price, every following one costs 50% more (rounded up).
 * - Additions never take a penalty nor the weekly slot, but their signed net is applied (an early
 *   activity can push a later one out of the 12h budget).
 * - Legacy mode (old apps): credits only, never debits, no penalty, no slot.
 */

import { DAY_TIME, GetLocalDayIndex } from '@/Rules/Time';

export const MAX_HOUR_PER_DAY = 12;
export const MAX_MINUTES_PER_DAY = MAX_HOUR_PER_DAY * 60;
export const HOURS_BEFORE_LIMIT = 48;
export const OX_PER_MINUTE = 1;

export interface OxActivity {
    /** Database ID, null for an activity not saved yet */
    id: number | null;
    skillID: number;
    /** Unix timestamp in seconds */
    startTime: number;
    /** Minutes */
    duration: number;
    /** Hours (rounded before use: the database column is a tinyint) */
    timezone: number;
    /** Unix timestamp in seconds */
    addedTime: number;
}

export type OxOpKind = 'add' | 'edit' | 'delete';

export interface OxEdition {
    prev: OxActivity;
    next: OxActivity;
}

export interface OxBatchInput {
    /** Activities as the server holds them before the batch */
    state: OxActivity[];
    additions: OxActivity[];
    editions: OxEdition[];
    deletions: OxActivity[];
    /** Unix timestamp in seconds */
    now: number;
    /** Whether the weekly base-price slot is still available */
    slotAvailable: boolean;
    /** Old app: credits only, no penalty, no slot */
    legacy: boolean;
    /**
     * Identity of the costly edition/deletion the user confirmed at base price (first confirmed
     * while the slot was available). Takes the slot when it is costly; otherwise the largest cost does.
     */
    freeKey?: string | null;
    xpOfSkill: (skillID: number) => number;
    /** First local day taken into account (tests only; every day counts by default) */
    startDay?: number;
}

export interface OxOpResult {
    kind: OxOpKind;
    key: string;
    /** Signed ox change of the operation (before penalty) */
    delta: number;
    /** max(0, -delta) */
    cost: number;
    /** x0.5 of the cost when the weekly slot is not available for this operation */
    penalty: number;
    /** This operation took the weekly base-price slot */
    free: boolean;
}

export interface OxBatchResult {
    ops: OxOpResult[];
    /** Signed ox change per local day (legacy: clamped to >= 0) */
    ledgerByDay: Map<number, number>;
    /** Ox due per touched local day after the batch */
    dueAfterByDay: Map<number, number>;
    /** Sum of the costs of the editions and deletions (negative-balance guard); additions are never blocked */
    totalCost: number;
    /** Sum of the losses caused by additions (an early activity pushing a later one out of the 12h budget) */
    additionsLoss: number;
    totalPenalty: number;
    /** Change to apply to the balance: sum of ledgerByDay minus totalPenalty */
    totalDelta: number;
    /** A costly edition/deletion took the weekly slot in this batch */
    slotConsumed: boolean;
}

/** Added at most 48h after its start, and already started */
export function DoesGrantXP(activity: Pick<OxActivity, 'startTime' | 'addedTime'>, now: number): boolean {
    const deltaHours = (activity.addedTime - activity.startTime) / 3600;
    return deltaHours <= HOURS_BEFORE_LIMIT && activity.startTime <= now;
}

/**
 * Identities (`KeyOf`) of the activities that grant XP: skill with XP, `DoesGrantXP`, and within
 * the 12h chronological all-or-nothing budget of their local day. Rows may span several days.
 * Shared with the raid engine, which only scores useful activities.
 */
export function UsefulActivities(rows: OxActivity[], now: number, xpOfSkill: (skillID: number) => number): Set<string> {
    const byDay = new Map<number, OxActivity[]>();
    for (const activity of rows) {
        const day = GetLocalDayIndex(activity);
        const dayRows = byDay.get(day);
        if (dayRows === undefined) {
            byDay.set(day, [activity]);
        } else {
            dayRows.push(activity);
        }
    }

    const useful = new Set<string>();
    for (const dayRows of byDay.values()) {
        const sorted = [...dayRows].sort((a, b) => a.startTime - b.startTime || a.addedTime - b.addedTime);
        let minutesRemain = MAX_MINUTES_PER_DAY;
        for (const activity of sorted) {
            if (!DoesGrantXP(activity, now)) {
                continue;
            }
            if (xpOfSkill(activity.skillID) <= 0) {
                continue;
            }
            minutesRemain -= activity.duration;
            if (minutesRemain < 0) {
                continue;
            }
            useful.add(KeyOf(activity));
        }
    }
    return useful;
}

/**
 * Ox due for one local day: 1 ox per minute of XP-granting activities, 12h budget consumed by
 * skills with XP, chronological and all-or-nothing (the activity that overflows and every
 * following one of the day grant nothing).
 * @param rows Activities of that day, any order
 */
export function DueOxForDay(rows: OxActivity[], now: number, xpOfSkill: (skillID: number) => number): number {
    const useful = UsefulActivities(rows, now, xpOfSkill);
    let due = 0;
    for (const activity of rows) {
        if (useful.has(KeyOf(activity))) {
            due += activity.duration * OX_PER_MINUTE;
        }
    }
    return due;
}

/**
 * Ox the activity is responsible for on its local day: what the day would lose without it.
 *
 * This is NOT its duration. The 12h budget is chronological and all-or-nothing, so removing an
 * early activity can let a later one fit back in: the marginal contribution of a morning activity
 * may be far below its duration, or zero.
 *
 * @param dayRows Every activity of that same local day, the target included
 */
export function MarginalOxOfActivity(
    dayRows: OxActivity[],
    activityID: number,
    now: number,
    xpOfSkill: (skillID: number) => number
): number {
    const withIt = DueOxForDay(dayRows, now, xpOfSkill);
    const withoutIt = DueOxForDay(
        dayRows.filter((activity) => activity.id !== activityID),
        now,
        xpOfSkill
    );
    return Math.max(0, withIt - withoutIt);
}

/**
 * Ox granted by one rewarded ad on an activity: half of what it brought, rounded up, so the
 * activity ends up paying 1.5x. No cap: the 12h daily budget already bounds what an activity can
 * be worth, and one ad may be watched per activity.
 *
 * Same +50% shape and rounding as `PenaltyFor`, on the other side of the ledger.
 */
export function AdBonusOx(marginal: number): number {
    return Math.max(0, Math.ceil(marginal / 2));
}

/** Extra cost of a costly operation beyond the weekly slot: +50%, rounded up */
export function PenaltyFor(cost: number): number {
    return Math.ceil(cost / 2);
}

/** Index of the UTC week (Monday 00:00 to Sunday 23:59) containing a time; week 0 starts Monday 1969-12-29 */
export function WeekIndexUTC(time: number): number {
    return Math.floor((Math.floor(time / DAY_TIME) + 3) / 7);
}

/** First instant after a UTC week: the next Monday 00:00 UTC */
export function WeekEndUTC(weekIndex: number): number {
    return ((weekIndex + 1) * 7 - 3) * DAY_TIME;
}

/** Expiry of the weekly slot taken at `now`: the next Monday 00:00 UTC */
export function SlotExpiryFor(now: number): number {
    return WeekEndUTC(WeekIndexUTC(now));
}

/** Identity of an activity inside a batch: its ID when saved, its (start, added) stamp otherwise */
export function KeyOf(activity: OxActivity): string {
    return activity.id !== null ? `id:${activity.id}` : `add:${activity.startTime}:${activity.addedTime}`;
}

/**
 * Simulate a batch of additions, editions and deletions and attribute to every operation its
 * signed ox change, its cost and its penalty. Pure: nothing is written.
 *
 * Canonical order (independent of the order the user performed them): additions sorted by
 * (startTime, addedTime), then editions sorted by ID, then deletions sorted by ID.
 * The weekly slot goes to the costly edition/deletion designated by `freeKey` (the first one the
 * user confirmed at base price), or to the largest cost when no valid key is given (ties: first).
 */
export function SimulateBatch(input: OxBatchInput): OxBatchResult {
    const { now, xpOfSkill, legacy } = input;
    const startDay = input.startDay ?? 0;

    /** Working state, keyed by activity identity */
    const working = new Map<string, OxActivity>();
    for (const activity of input.state) {
        working.set(KeyOf(activity), activity);
    }

    const dueOf = (day: number): number => {
        const rows: OxActivity[] = [];
        for (const activity of working.values()) {
            if (GetLocalDayIndex(activity) === day) {
                rows.push(activity);
            }
        }
        return DueOxForDay(rows, now, xpOfSkill);
    };

    type Op = { kind: OxOpKind; key: string; prev: OxActivity | null; next: OxActivity | null };

    const ops: Op[] = [
        ...[...input.additions]
            .sort((a, b) => a.startTime - b.startTime || a.addedTime - b.addedTime)
            .map((next): Op => ({ kind: 'add', key: KeyOf(next), prev: null, next })),
        ...[...input.editions]
            .sort((a, b) => (a.prev.id ?? 0) - (b.prev.id ?? 0))
            .map((e): Op => ({ kind: 'edit', key: KeyOf(e.prev), prev: e.prev, next: { ...e.next, id: e.prev.id } })),
        ...[...input.deletions]
            .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
            .map((prev): Op => ({ kind: 'delete', key: KeyOf(prev), prev, next: null }))
    ];

    const daysOf = (op: Op): number[] => {
        const days = new Set<number>();
        if (op.prev !== null) days.add(GetLocalDayIndex(op.prev));
        if (op.next !== null) days.add(GetLocalDayIndex(op.next));
        return [...days].filter((day) => day >= startDay);
    };

    // Due of every touched day before the batch
    const dueAtStart = new Map<number, number>();
    for (const op of ops) {
        for (const day of daysOf(op)) {
            if (!dueAtStart.has(day)) {
                dueAtStart.set(day, dueOf(day));
            }
        }
    }

    const results: OxOpResult[] = [];

    for (const op of ops) {
        const days = daysOf(op);
        const before = days.reduce((sum, day) => sum + dueOf(day), 0);

        if (op.kind === 'add' && op.next !== null) {
            working.set(op.key, op.next);
        } else if (op.kind === 'edit' && op.next !== null) {
            working.delete(op.key);
            working.set(op.key, op.next);
        } else if (op.kind === 'delete') {
            working.delete(op.key);
        }

        const after = days.reduce((sum, day) => sum + dueOf(day), 0);
        const delta = after - before;

        results.push({ kind: op.kind, key: op.key, delta, cost: Math.max(0, -delta), penalty: 0, free: false });
    }

    // Weekly slot and penalties (editions and deletions only)
    let slotConsumed = false;
    if (!legacy) {
        const costly = results.filter((r) => r.kind !== 'add' && r.cost > 0);
        if (input.slotAvailable && costly.length > 0) {
            let best = costly.find((r) => r.key === input.freeKey) ?? null;
            if (best === null) {
                best = costly[0];
                for (const r of costly) {
                    if (r.cost > best.cost) best = r;
                }
            }
            best.free = true;
            slotConsumed = true;
        }
        for (const r of costly) {
            if (!r.free) {
                r.penalty = PenaltyFor(r.cost);
            }
        }
    }

    // Ledger per day: due after the batch minus due before (legacy: never negative)
    const ledgerByDay = new Map<number, number>();
    const dueAfterByDay = new Map<number, number>();
    for (const [day, due0] of dueAtStart) {
        const dueAfter = dueOf(day);
        const delta = dueAfter - due0;
        dueAfterByDay.set(day, dueAfter);
        ledgerByDay.set(day, legacy ? Math.max(0, delta) : delta);
    }

    let totalCost = 0;
    let additionsLoss = 0;
    let totalPenalty = 0;
    for (const r of results) {
        if (r.kind === 'add') {
            additionsLoss += r.cost;
        } else {
            totalCost += r.cost;
        }
        totalPenalty += r.penalty;
    }
    let ledgerSum = 0;
    for (const delta of ledgerByDay.values()) {
        ledgerSum += delta;
    }

    return {
        ops: results,
        ledgerByDay,
        dueAfterByDay,
        totalCost,
        additionsLoss,
        totalPenalty,
        totalDelta: ledgerSum - totalPenalty,
        slotConsumed
    };
}
