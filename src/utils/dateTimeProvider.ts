import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export function getDateInEastern(addDays = 0) {
    const now = dayjs.tz(dayjs(), 'America/New_York')
    if (addDays) return dayjs(now).add(addDays, 'day').format('YYYY-MM-DD')
    return dayjs(now).format('YYYY-MM-DD')
}

export function getPrevDayCutoffUnix() {
    const now = dayjs.tz(getDateInEastern(), 'America/New_York')
    return now.add(-1, 'day').unix()
}

export function getTimeTilMidnightEastern() {
    const today = getDateInEastern()
    return dayjs(today).add(1, 'day').unix()
}
