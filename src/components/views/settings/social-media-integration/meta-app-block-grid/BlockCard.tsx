import React from "react";
import  style from"./BlockCard.module.css"
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

export interface BlockCardProps {
  id: number;
  name: string;
  description: string;
  logo: LucideIcon | IconType; // image URL
  onClick?: (id: number) => void;
}

const BlockCard: React.FC<BlockCardProps> = ({
  id,
  name,
  description,
  logo : Logo,
  onClick,
}) => {
  return (
    <div
      className={style.blockCard}
      onClick={() => onClick?.(id)}
    >
      <div className={style.blockLogoWrapper}>
        <Logo size={20} className={style.logoColor}/>
        {/* <img src={logo} alt={name} className="block-logo" /> */}
      </div>

      <div className={style.blockContent}>
        <h3 className={style.blockTitle}>{name}</h3>
        <p className={style.blockDescription}>{description}</p>
      </div>
    </div>
  );
};

export default BlockCard;