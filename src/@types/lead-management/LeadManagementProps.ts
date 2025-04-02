
type Lead = {
    id?: number,
    leadNo?: string,
    name: string,
    email: string,
    phone?: string,
    remark? : string,
    status: string,
    createdOn?: string,
    updatedOn?: string,
    createdBy? : string,
    updatedBy? : string,
    assignedTo?: string,
    source? : string,
}

export default Lead;