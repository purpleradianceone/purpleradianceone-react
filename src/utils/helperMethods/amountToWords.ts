export const amountToWords = (num: number): string => {
  if (num === 0) return "Rupees Zero Only";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
    "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const getWords = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + getWords(n % 100) : "")
      );
    return "";
  };

  const convert = (n: number): string => {
    let str = "";

    const crore = Math.floor(n / 10000000);
    n %= 10000000;

    const lakh = Math.floor(n / 100000);
    n %= 100000;

    const thousand = Math.floor(n / 1000);
    n %= 1000;

    if (crore) str += getWords(crore) + " Crore ";
    if (lakh) str += getWords(lakh) + " Lakh ";
    if (thousand) str += getWords(thousand) + " Thousand ";
    if (n) str += getWords(n) + " ";

    return str.trim();
  };

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let result = "Rupees " + convert(rupees);

  if (paise > 0) {
    result += " and " + convert(paise) + " Paise";
  }

  return result + " Only";
};