import { Product } from "../@types/products/ProductsManagementProps";

export const productsData : Product[] = [
    {
      name : "Product 1",
      code: "ABC121",
      description:
        "Product 1 of XYZ Company which is for sell and marketing purpose",
      cost: 10.99,
      hsn: "xxCode1xx",
      sac: "xxCode1xx",
    },
    {
      name : "Product 2",
      code: "ABC122",
      description:
        "Product 2 of XYZ Company which is for sell and marketing purpose",
      cost: 13.85,
      hsn: "xxCode2xx",
      sac: "xxCode2xx",
    },
    {
      name : "Product 3",
      code: "ABC123",
      description:
        "Product 3 of XYZ Company which is for sell and marketing purpose",
      cost: 20.34,
      hsn: "xxCode3xx",
      sac: "xxCode3xx",
    },
    {
      name : "Product 4",
      code: "ABC124",
      description:
        "Product 4 of XYZ Company which is for sell and marketing purpose",
      cost: 11.53,
      hsn: "xxCode4xx",
      sac: "xxCode4xx",
    },
    {
      name : "Product 5",
      code: "XYZ567",
      description: "Product 5 description",
      cost: 15.99,
      hsn: "xxCode5xx",
      sac: "xxCode5xx",
    },
    {
      name : "Product 6",
      code: "PQR890",
      description: "Product 6 description",
      cost: 22.5,
      hsn: "xxCode6xx",
      sac: "xxCode6xx",
    },
    {
      name : "Product 7",
      code: "LMN123",
      description: "Product 7 description",
      cost: 9.75,
      hsn: "xxCode7xx",
      sac: "xxCode7xx",
    },
    {
      name : "Product 8",
      code: "STU456",
      description: "Product 8 description",
      cost: 18.2,
      hsn: "xxCode8xx",
      sac: "xxCode8xx",
    },
    {
      name : "Product 9",
      code: "EFG789",
      description: "Product 9 description",
      cost: 12.35,
      hsn: "xxCode9xx",
      sac: "xxCode9xx",
    },
     {
      name : "Product 10",
      code: "HIJ012",
      description: "Product 10 description",
      cost: 25.8,
      hsn: "xxCode10xx",
      sac: "xxCode10xx",
    },
     {
      name : "Product 11",
      code: "KLM345",
      description: "Product 11 description",
      cost: 14.65,
      hsn: "xxCode11xx",
      sac: "xxCode11xx",
    },
     {
      name : "Product 12",
      code: "NOP678",
      description: "Product 12 description",
      cost: 21.9,
      hsn: "xxCode12xx",
      sac: "xxCode12xx",
    },
     {
      name : "Product 13",
      code: "QRS901",
      description: "Product 13 description",
      cost: 10.5,
      hsn: "xxCode13xx",
      sac: "xxCode13xx",
    },
     {
      name : "Product 14",
      code: "TUV234",
      description: "Product 14 description",
      cost: 17.75,
      hsn: "xxCode14xx",
      sac: "xxCode14xx",
    },
     {
      name : "Product 15",
      code: "WXY567",
      description: "Product 15 description",
      cost: 23.1,
      hsn: "xxCode15xx",
      sac: "xxCode15xx",
    },
     {
      name : "Product 16",
      code: "ZAB890",
      description: "Product 16 description",
      cost: 11.85,
      hsn: "xxCode16xx",
      sac: "xxCode16xx",
    },
    {
      name : "Product 17",
      code: "CDE123",
      description: "Product 17 description",
      cost: 19.5,
      hsn: "xxCode17xx",
      sac: "xxCode17xx",
    },
    {
      name : "Product 18",
      code: "FGH456",
      description: "Product 18 description",
      cost: 16.25,
      hsn: "xxCode18xx",
      sac: "xxCode18xx",
    },
    {
      name : "Product 19",
      code: "IJK789",
      description: "Product 19 description",
      cost: 24.9,
      hsn: "xxCode19xx",
      sac: "xxCode19xx",
    }
  ];



export const ProductsRadioButtonOptions = [
  {
    label : "HSN",
    value : "hsn",
    id : "hsn",
    name : "taxCode",
    checked : true,
  },
  {
    label : "SAC",
    value : "sac",
    id : "sac",
    name : "taxCode",
    checked : false,
  },
  {
    label : "Both",
    value : "all",
    id : "all",
    name : "taxCode",
    checked : false,
  }

]