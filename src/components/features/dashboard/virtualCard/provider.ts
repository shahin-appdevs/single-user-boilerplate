/**
 * Virtual-card provider switch. Each provider (sudo, strow, …) has its own
 * implementation under `./<provider>/`. The active provider is resolved here
 * so route components can render the matching UI conditionally.
 */
export type CardProvider = "sudo" | "strow";

// TODO: derive from the user's account / card-settings API.
export const CARD_PROVIDER: CardProvider = "sudo";
