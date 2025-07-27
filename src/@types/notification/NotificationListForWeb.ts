
 type NotificationListForWeb = {
    count : number ,
    id: number ,
    company_id : number,
    notification_status_id : number ,
    notification_status_name : string ,
    is_read : boolean,
    notification_details : string,
    notification_type_id : number ,
    notification_type_name : string ,
    company_user_id : number ,
    notification_subject : string ,
    notification_body : string ,
    notification_request_date : string ,
    notification_processed_date : string ,
    createdon : string ,
    updatedon : string ,
}

 export default NotificationListForWeb;