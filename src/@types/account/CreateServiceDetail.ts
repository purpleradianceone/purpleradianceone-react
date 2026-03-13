type CreateServiceDetail = {
  service_booking_date: string;
  service_booking_time: string;
  location_address: string;
  service_notes: string;
  cancellation_reason: string;
  customer_rating?: number;
  customer_feedback?: string;
  next_service_due_date?: string;
  is_follow_up_required?: boolean;
};

export default CreateServiceDetail;
