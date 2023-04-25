export const formatCurrency = (value: string | number | undefined): string | undefined => {
  if (value !== undefined) {
    // Add comma for thousand
    let seperated = String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    // Add dollar icon
    return `$ ${seperated}`
  }
  return undefined
}
