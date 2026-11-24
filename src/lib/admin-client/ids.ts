let seq = 0;
/** Client-side temporary ids for rows that have not been persisted yet (server assigns the real id on save). */
export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${(seq++).toString(36)}`;
