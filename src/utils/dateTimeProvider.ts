import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export function getDateInEastern() {
    const now = dayjs.tz(dayjs(), 'America/New_York')
    return dayjs(now).format('YYYY-MM-DD')
}

export function getTimeTilMidnightEastern() {
    const today = getDateInEastern()
    return dayjs(today).add(1, 'day').unix()
}
