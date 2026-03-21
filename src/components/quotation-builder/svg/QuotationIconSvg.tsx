import React from "react";
import { useUserPreference } from "../../../context/user/UserPreference";
import { getCurrencySymbolByCountryId } from "./GetCurrencySymbol";

type CurrencySymbol =
  | "₹"  // Indian Rupee
  | "$"  // Dollar (USD, CAD, AUD, etc.)
  | "€"  // Euro
  | "£"  // British Pound
  | "¥"  // Yen / Yuan
  | "₩"  // South Korean Won
  | "₽"  // Russian Ruble
  | "₺"  // Turkish Lira
  | "₴"  // Ukrainian Hryvnia
  | "₫"  // Vietnamese Dong
  | "₦"  // Nigerian Naira
  | "₱"  // Philippine Peso
  | "฿"  // Thai Baht
  | "₲"  // Paraguayan Guarani
  | "₡"  // Costa Rican Colón
  | "₭"  // Lao Kip
  | "₮"  // Mongolian Tögrög
  | "₸"  // Kazakhstani Tenge
  | "﷼"  // Riyal
  | "₪"  // Israeli Shekel
  | "₨"  // Pakistani Rupee
  | "₾"  // Georgian Lari
  | "₼"  // Azerbaijani Manat
  | "₿"  // Bitcoin
  | "Fr" // Swiss Franc / CFA Franc
  | "kr" // Krona/Krone (Sweden, Norway, Denmark)
  | "zł" // Polish Zloty
  | "Kč" // Czech Koruna
  | "Ft" // Hungarian Forint
  | "R"  // South African Rand
  | "RM" // Malaysian Ringgit
  | "Rp" // Indonesian Rupiah
  | "S/" // Peruvian Sol
  | "Bs."// Bolivian Boliviano
  | "CHF"// Swiss Franc (alt format)
  | "د.إ" // UAE Dirham
  | "ع.د" // Iraqi Dinar
  | "دج"  // Algerian Dinar
  | ".د.ب"// Bahraini Dinar
  | "KSh" // Kenyan Shilling
  | "Br"  // Ethiopian Birr / Belarus Ruble
  | "₵"; // Ghanaian Cedi

type QuotationIconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;

  // currency config
  showCurrency?: boolean;
  currency?: CurrencySymbol;
};

const QuotationIconSvg: React.FC<QuotationIconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className = "text-blue-600",
  showCurrency = false,
  currency = "₹",
}) => {

    const{userPreference}= useUserPreference();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Document */}
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />

      {/* Fold */}
      <path d="M14 2v6h6" />

      {/* Lines */}
      <path d="M8 13h8" />
      <path d="M8 17h5" />

      {/* ✅ Currency Text */}
      {showCurrency && (
        <text
          x="7"
          y="11"
          fontSize="9"
          fill={color}
          stroke="none"
          fontWeight="600"
        >
          {currency??getCurrencySymbolByCountryId(userPreference.countryId)}
        </text>
      )}
    </svg>
  );
};

export default QuotationIconSvg;




