export type SummarySalesProps = {
  total_transactions_current_month: number;
  units_sold_current_month: number;
  total_revenue_current_month: number;
  total_customer_served_current_month: number;
};

export type RevenueTrendProps = {
  month_start: string;
  month_year: string;
  total_cost: number;
};

export type TopSaleProductProps = {
  company_product_id: number;
  company_product_name: string;
  total_sales: number;
};
