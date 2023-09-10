// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  return emailRegex.test(email)
}

// Phone number validation (simplified, may not cover all cases)
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-()]{7,}$/
  return phoneRegex.test(phoneNumber)
}

// Password validation (example: at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number)
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return passwordRegex.test(password)
}

// Password strength level (0-4)
export const passwordStrengthLevel = (password: string): number => {
  let strength = 0
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) strength++
  return strength
}

// Non-empty string validation
export const isNotEmpty = (str: string): boolean => str.length > 0

// Numeric validation
export const isNumeric = (num: string): boolean => !isNaN(parseFloat(num)) && isFinite(Number(num))

export const isDigit = (num: string): boolean => /^\d+$/.test(num)

// Float validation
export const isFloat = (num: string): boolean => {
  const floatRegex = /^-?\d*(\.\d+)?$/
  return floatRegex.test(num)
}

export const isFloatInput = (num: string): boolean => {
  const floatRegex = /^(?!00)\d+(\.\d*)?$/
  return floatRegex.test(num)
}
// Non-numeric validation
export const isNotNumeric = (str: string): boolean => !/\d/.test(str)

// URL validation
export const isValidURL = (url: string): boolean => {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  return urlRegex.test(url)
}

// IP address validation
export const isValidIPAddress = (ipAddress: string): boolean => {
  const ipAddressRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/
  return ipAddressRegex.test(ipAddress)
}

// Credit card validation
export const isValidCreditCard = (creditCard: string): boolean => {
  const creditCardRegex = /^([0-9]{4}-){3}[0-9]{4}$/
  return creditCardRegex.test(creditCard)
}

// Hex color validation
export const isValidHexColor = (hexColor: string): boolean => {
  const hexColorRegex = /^#([0-9a-f]{3}){1,2}$/i
  return hexColorRegex.test(hexColor)
}
