import { LucideIcon } from "lucide-react";
import { summaryCardStyles } from "../../utils/summaryCardStyles";

type CardItem = {
  title: string;
  count: number | string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  graphColor?: string;
  isGradient?: boolean;
};

type SummaryCardsProps = {
  cards: CardItem[];
  showGraph?: boolean;
  width?: string;
  cardCss?: string;
  cardGap?: number;
};

function SummaryCards({
  cards,
  showGraph = false,
  width = "100%",
  cardGap = 12,
  cardCss = `
    bg-white
    h-[78px]
    border
    border-slate-200
    rounded-2xl
    px-3
    shadow-sm
    flex
    items-center
    justify-between
    hover:shadow-md
    transition-all
    min-w-0
    w-full
  `,
}: SummaryCardsProps) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        mb-3
        mt-2
      "
      style={{
        width,
        gap: `${cardGap}px`,
      }}
    >
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className={
              card.isGradient
                ? `${summaryCardStyles.gradientCard} min-w-0 w-full`
                : cardCss
            }
          >
            <div className={summaryCardStyles.leftSection}>
              <div
                className={`
                  ${
                    showGraph
                      ? summaryCardStyles.roundIconBox
                      : summaryCardStyles.iconBox
                  }
                  ${card.iconBg}
                  flex-shrink-0
                `}
              >
                <Icon
                  className={card.isGradient ? "text-white" : card.iconColor}
                  size={20}
                />
              </div>

              <div className={`${summaryCardStyles.content} min-w-0`}>
                <span
                  className={
                    card.isGradient
                      ? summaryCardStyles.whiteTitle
                      : summaryCardStyles.title
                  }
                >
                  {card.title}
                </span>

                <span
                  className={
                    card.isGradient
                      ? summaryCardStyles.whiteCount
                      : summaryCardStyles.count
                  }
                >
                  {card.count}
                </span>

                <span
                  className={
                    card.isGradient
                      ? "text-xs text-white/70 mt-2 truncate"
                      : `${summaryCardStyles.subtitle} truncate`
                  }
                >
                  {card.subtitle}
                </span>
              </div>
            </div>

            {showGraph && !card.isGradient && (
              <div className={summaryCardStyles.graphWrapper}>
                <div
                  className={`${summaryCardStyles.graphBar} h-2 ${card.graphColor} opacity-40`}
                />
                <div
                  className={`${summaryCardStyles.graphBar} h-4 ${card.graphColor} opacity-60`}
                />
                <div
                  className={`${summaryCardStyles.graphBar} h-6 ${card.graphColor} opacity-80`}
                />
                <div
                  className={`${summaryCardStyles.graphBar} h-9 ${card.graphColor}`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SummaryCards;