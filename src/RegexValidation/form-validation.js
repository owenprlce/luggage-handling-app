// File Containing Necesarry Form Validation
    // Using Regex

export const nameRegex = input => /^[A-Za-z]{2,}$/.test(input)

export const alphaRegex = input => /^[A-Za-z\s\-,.&]+$/.test(input)

export const airlineCodeRegex = input => /^[A-Z]{2,}$/.test(input)

export const flightNumberRegex = input => /^[1-9]\d{0,}$/.test(input)

export const terminalRegex = input => /^[A-Z]{1,}$/.test(input)

export const gateNumberRegex = input => /^[1-9]\d{0,}$/.test(input)

export const counterNumberRegex = input => /^[1-9]\d{0,}$/.test(input)

export const usernameRegex = input => /^[A-Za-z]{2,}\d{2}$/.test(input)

export const passwordRegex = input => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(input)

export const emailRegex = input => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)

export const phoneNumberRegex = input => /^[1-9]\d{9}$/.test(input)

export const flightIdRegex = input => /^[A-Z]{2}\d{4}$/.test(input)

export const ticketNumberRegex = input => /^\d{10}$/.test(input)

export const identificationRegex = input => /^\d{6}$/.test(input)
