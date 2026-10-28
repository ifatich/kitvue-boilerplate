/**
 * Formats a Date instance or ISO timestamp string into a localized dynamic table timestamp.
 * Example output: "27/08/2026, 10.15 PM"
 *
 * @param date - Date object, ISO timestamp string, or milliseconds number
 * @returns Formatted timestamp string (DD/MM/YYYY, hh.mm AM/PM)
 */
export function formatTableTimestamp(date: Date | string | number = new Date()): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  if (isNaN(d.getTime())) {
    return ''
  }

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  // Midnight/noon land on 0 after the modulo; 12-hour clocks show 12.
  hours = hours || 12
  const formattedHours = String(hours).padStart(2, '0')

  return `${day}/${month}/${year}, ${formattedHours}.${minutes} ${ampm}`
}
