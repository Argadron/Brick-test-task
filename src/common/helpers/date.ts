/**
 * Check the mins time from dateTwo to current and return boolean
 * @param date - Date to check
 * @param mins - Mins, from dateTwo to current
 * @returns boolean - True if success check
 */
export function checkMinsTimeFromDateToCurrent(date: Date, mins: number): boolean {
    return parseInt(((new Date().getTime() - date.getTime()) / 1000 / 60).toFixed(1)) > mins
}