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
  gridCols?: number;
  loading?: boolean;
};

function SummaryCards({
  cards,
  showGraph = false,
  width = "100%",
  cardGap = 12,
  gridCols = 4,
  loading = false,
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
      xl:grid-cols-5
      mb-3
      mt-2
    "
    style={{
      width,
      gap: `${cardGap}px`,
      gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
    }}
  >
    {loading
      ? Array.from({ length: gridCols }).map((_, index) => (
          <div
            key={index}
            className="
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
              animate-pulse
            "
          >
            <div className="flex items-center gap-3 w-full">
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0" />

              {/* Content */}
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="h-5 w-10 bg-slate-300 rounded" />
                <div className="h-3 w-24 bg-slate-200 rounded" />
              </div>

              {showGraph && (
                <div className="flex items-end gap-1">
                  <div className="w-1 h-2 bg-slate-200 rounded" />
                  <div className="w-1 h-4 bg-slate-200 rounded" />
                  <div className="w-1 h-6 bg-slate-200 rounded" />
                  <div className="w-1 h-8 bg-slate-300 rounded" />
                </div>
              )}
            </div>
          </div>
        ))
      : cards.map((card, index) => {
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
                  size={18}
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