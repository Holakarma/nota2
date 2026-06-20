export const normalizeStreamName = (name: string) =>
    name.trim().replace(/\s+/g, ' ').toLocaleLowerCase();