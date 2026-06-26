import React from "react";
import BlockCard, { BlockCardProps } from "./BlockCard";

import style from "./BlockCard.module.css"
import {  useNavigate } from "react-router-dom";
import ROUTES_URL from "../../../../../constants/Routes";
interface BlockGridProps {
  blocks: BlockCardProps[];
}

const BlockGrid: React.FC<BlockGridProps> = ({ blocks }) => {
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    switch (id) {
        case  1 :
            navigate(ROUTES_URL.SETTING_META_APP_INTEGRATION_FACEBOOK)
            break;  
        // case 2 : 
        //     navigate(ROUTES_URL.SETTING_META_APP_INTEGRATION_WHATSAPP)
        //     break;
        default : 
            break;          
    }
  };

  return (

    <div className={style.grid}>
      {blocks.map((block) => (
        <BlockCard
          key={block.id}
          {...block}
          onClick={handleClick}
        />
      ))}
    </div>
  );
};

export default BlockGrid;