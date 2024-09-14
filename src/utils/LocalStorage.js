export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}
export const getLocalStorage = (key) => {
  const value = localStorage.getItem(key)
  if (value) return JSON.parse(value)
  return null
}
export const removeLocalStorage = (key) => {
  localStorage.removeItem(key)
}
