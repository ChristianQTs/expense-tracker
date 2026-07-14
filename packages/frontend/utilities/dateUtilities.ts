export function getDateRange(window: 'monthly' | 'quarterly' | 'yearly' | 'all') {

    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()
    let startDate: Date

    let endDate: Date = new Date(year, month, now.getDate(), 23, 59, 59, 999)

    switch (window) {
        case 'monthly':
            startDate = new Date(year, month, 1, 0, 0, 0, 0)
            break;
        case 'quarterly':
            const quarterStartMonth = Math.floor(month / 3) * 3
            startDate = new Date(year, quarterStartMonth, 1, 0, 0, 0, 0)
            break;
        case 'yearly':
            startDate = new Date(year, 0, 1, 0, 0, 0, 0)
            break;
        case 'all':
        default:
            return {
                start: undefined,
                end: undefined
            }
    }

    return {
        start: startDate.toISOString(),
        end: endDate.toISOString()
    }
}