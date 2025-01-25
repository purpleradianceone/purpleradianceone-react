type  AccessRightsModalProps= {
    isOpen: boolean;
    onClose: () => void;
    users : {
      company_id: number,
      id: number,
      fullname: string,
      email: string,
      mobilenumber: string,
      createdby: string | null,
      isactive: boolean,
      requestedby:string | null,
      generate_password:string | null
    }
  }

  export default AccessRightsModalProps;