type AccountProduct ={
    companyId : number,
	accountId : number ,
	companyProductId : number,
	quantity : number,
	purchaseDate : string,
	deliveryDate : string ,
	deliveryAddress : string,
	billingAddress : string,
	installationDate : string,
	installedBy:  number,
	warrantyIntervalTypeId : number,
	warranty : number,
	warrantyStartDate : string,
	warrantyEndDate : string,
	warrantyTerms : string,
	amcCycleIntervalTypeId : number,
	amcCycle : number,
	amcCycleStartDate : string,
	amcCycleEndDate : string,
	createdby : number
}

export default AccountProduct;