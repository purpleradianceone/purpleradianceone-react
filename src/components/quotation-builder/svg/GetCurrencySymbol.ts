
export const getCurrencySymbolByCountryId = (id: number): string => {
  return currencyByCountryId[id] || "₹"; // default fallback
};



const currencyByCountryId: Record<number, string> = {
  1: "؋",   // Afghanistan
  2: "L",   // Albania
  3: "دج",  // Algeria
  4: "€",   // Andorra
  5: "Kz",  // Angola
  6: "$",   // Argentina
  7: "֏",   // Armenia
  8: "$",   // Australia
  9: "€",   // Austria
  10: "₼",  // Azerbaijan
  11: "$",  // Bahamas
  12: ".د.ب", // Bahrain
  13: "৳",  // Bangladesh
  14: "Br", // Belarus
  15: "€",  // Belgium
  16: "$",  // Belize
  17: "Fr", // Benin
  18: "Nu.", // Bhutan
  19: "Bs.", // Bolivia
  20: "KM", // Bosnia
  21: "P",  // Botswana
  22: "R$", // Brazil
  23: "$",  // Brunei
  24: "лв", // Bulgaria
  25: "Fr", // Burkina Faso
  26: "Fr", // Burundi
  27: "៛",  // Cambodia
  28: "Fr", // Cameroon
  29: "$",  // Canada
  30: "$",  // Chile
  31: "¥",  // China
  32: "$",  // Colombia
  33: "₡",  // Costa Rica
  34: "€",  // Croatia
  35: "$",  // Cuba
  36: "€",  // Cyprus
  37: "Kč", // Czech
  38: "kr", // Denmark
  39: "$",  // Dominican Republic
  40: "$",  // Ecuador
  41: "£",  // Egypt
  42: "$",  // El Salvador
  43: "€",  // Estonia
  44: "Br", // Ethiopia
  45: "€",  // Finland
  46: "€",  // France
  47: "€",  // Germany
  48: "€",  // Greece
  49: "$",  // Hong Kong
  50: "Ft", // Hungary
  51: "kr", // Iceland
  52: "₹",  // India
  53: "Rp", // Indonesia
  54: "﷼",  // Iran
  55: "ع.د", // Iraq
  56: "€",  // Ireland
  57: "₪",  // Israel
  58: "€",  // Italy
  59: "¥",  // Japan
  60: "KSh", // Kenya
  61: "RM", // Malaysia
  62: "$",  // Mexico
  63: "रु", // Nepal
  64: "€",  // Netherlands
  65: "$",  // New Zealand
  66: "₦",  // Nigeria
  67: "kr", // Norway
  68: "₨",  // Pakistan
  69: "S/", // Peru
  70: "₱",  // Philippines
  71: "zł", // Poland
  72: "€",  // Portugal
  73: "₽",  // Russia
  74: "﷼",  // Saudi Arabia
  75: "R",  // South Africa
  76: "₩",  // South Korea
  77: "€",  // Spain
  78: "Rs", // Sri Lanka
  79: "kr", // Sweden
  80: "CHF",// Switzerland
  81: "฿",  // Thailand
  82: "₺",  // Turkey
  83: "د.إ", // UAE
  84: "£",  // UK
  85: "$",  // USA
  86: "₫",  // Vietnam
};