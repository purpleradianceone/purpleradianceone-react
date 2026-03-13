type CreateAccountSubscriptionProps = {
  start_date: string;
  end_date: string;
  is_renewal?: boolean;
  renewal_account_subscription_id?: number;
};

export default CreateAccountSubscriptionProps;
