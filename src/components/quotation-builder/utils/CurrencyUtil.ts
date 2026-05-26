// CurrencyUtil.ts

export default class CurrencyUtil {
  private static readonly units: string[] = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  private static readonly tens: string[] = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  /* ================= MAIN METHOD ================= */
   static formatInr(amount: number): string {
    if (amount === 0) return "Zero Rupees Only";

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);

    let result = `${this.convertToWords(rupees)} Rupees`;

    if (paise > 0) {
      result += ` and ${this.convertToWords(paise)} Paise`;
    }

    result += " Only.";

    return result;
  }

  /* ================= CORE LOGIC ================= */
  private static convertToWords(number: number): string {
    if (number === 0) return "";

    let word = "";

    // Crore
    if (Math.floor(number / 10000000) > 0) {
      word +=
        this.convertToWords(Math.floor(number / 10000000)) + " Crore ";
      number %= 10000000;
    }

    // Lakh
    if (Math.floor(number / 100000) > 0) {
      word +=
        this.convertToWords(Math.floor(number / 100000)) + " Lakh ";
      number %= 100000;
    }

    // Thousand
    if (Math.floor(number / 1000) > 0) {
      word +=
        this.convertToWords(Math.floor(number / 1000)) + " Thousand ";
      number %= 1000;
    }

    // Hundred
    if (Math.floor(number / 100) > 0) {
      word +=
        this.convertToWords(Math.floor(number / 100)) + " Hundred ";
      number %= 100;
    }

    // Tens & Units
    if (number > 0) {
      if (number < 20) {
        word += this.units[number] + " ";
      } else {
        word += this.tens[Math.floor(number / 10)] + " ";

        if (number % 10 > 0) {
          word += this.units[number % 10] + " ";
        }
      }
    }

    return word.trim();
  }

  /* ================= OPTIONAL FORMAT ================= */
  static formatAmount(amount: number): string {
    return `₹ ${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}