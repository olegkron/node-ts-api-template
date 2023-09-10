import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import dayjs from 'dayjs'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: 'now',
    m: 'a min',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: 'a day',
    dd: '%dd',
    M: 'a month',
    MM: '%dm',
    y: 'a year',
    yy: '%dy',
  },
})
export default dayjs

// Date and time formatting
const formatDate = (date: string | Date, format = 'YYYY-MM-DD'): string => dayjs(date).format(format)

export const formatDateTime = (date: string | Date, format = 'YYYY-MM-DD HH:mm'): string => dayjs(date).format(format)

export const formatTime = (date: string | Date, format = 'HH:mm'): string => dayjs(date).format(format)

export const fromNow = (date: string | Date): string => dayjs(date).fromNow()

export const unixtimeFromNow = (unixtime: number): string => dayjs.unix(unixtime).fromNow()

export const unixTimeFormat = (unixtime: number, format = 'YYYY-MM-DD HH:mm'): string => dayjs.unix(unixtime).format(format)

// Number and currency formatting
export const formatNumber = (num: number, decimalPlaces = 2): string => num.toFixed(decimalPlaces)

export const formatCurrency = (amount: number, currency = 'USD'): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)

// String formatting
export const toTitleCase = (str: string): string => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())

export const toCamelCase = (str: string): string => str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''))

export const toSnakeCase = (str: string): string => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).replace(/^-/, '')

// URL formatting
export const slugify = (str: string): string =>
  str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')

export const getHostname = (url: string): string => new URL(url).hostname

// turns 'https://cointelegraph.com/abcd' into cointelegraph
export const getDomain = (url: string): string => getHostname(url).replace('www.', '').split('.')[0]
// String manipulation

export const truncate = (str: string, length = 100, ending = '...'): string => (str.length > length ? str.substring(0, length - ending.length) + ending : str)

// trucate wallet address to 6 characters on the end
export const truncateWallet = (str: string): string => `${str.slice(0, 6)}...${str.slice(-4)}`

export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

export const removeWhitespace = (str: string): string => str.replace(/\s/g, '')

export const removeNonNumeric = (str: string): string => str.replace(/\D/g, '')

export const removeNonAlphaNumeric = (str: string): string => str.replace(/\W/g, '')

export const addingDecimals = (number: number, decimals: number) => {
  while (number % 1 !== 0) {
    number *= 10
    decimals--
  }

  return number + '0'.repeat(decimals)
}

export const secondsConverter = (seconds: number): string => {
  if (seconds > 60) return `${Math.floor(seconds / 60)}m ${seconds % 60 ? `${(seconds % 60).toString()}s` : ''}`
  return `${seconds}s`
}

export const numberToFormatString = (number: number, decimals = 4, isTransformNeeded = false): string => {
  const result = parseFloat(number?.toFixed(decimals))
  if (isTransformNeeded && result === 0) return '< 0.01'

  return result?.toString()
}

export const roundNumberByDecimals = (number: number, decimals = 4): number => {
  const decimalPart = number.toString().split('.')[1]
  let count = 0
  if (decimalPart) {
    while (decimalPart[count] === '0') count++
    count++
  }
  const factor = Math.max(count, decimals)
  return parseFloat(number?.toFixed(factor))
}

export const addingTokenDecimals = (amount: number, decimals: number): string => {
  return numberToFormatString(amount / Math.pow(10, decimals), 4)
}

export const timestampToLocalTime = (timestamp: number): number => {
  const currentTime = new Date()
  const timeZoneOffsetInSeconds = currentTime.getTimezoneOffset() * 60
  return Number(timestamp) - timeZoneOffsetInSeconds
}
