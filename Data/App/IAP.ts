/**
 * In-App Purchase configuration
 */
export interface IAP {
    /** SKU identifier (e.g., "ox_100", "ox_500") */
    SKU: string;

    /** Amount of Ox granted by this purchase */
    OxAmount: number;

    /** Display order */
    Order: number;

    /** Whether this IAP is currently enabled */
    Enabled: boolean;
}
