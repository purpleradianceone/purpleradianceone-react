import { Lead } from "../@types/lead-management/LeadManagementProps";
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

]


export const leadsData:Lead[] = [
  {
    id: 1,
    leadNo: "Lead-9500",
    name: "Mr. Ghorpade",
    email: "ghorpade@example.com",
    phone: "8624003552",
    remark: "Information given, price pitched 18k. Client will let us know.",
    status: "Open",
    createdOn: "Feb 17, 2025 10:53:26",
    updatedOn: "Feb 17, 2025 10:53:26",
    createdBy: "Suraj Darade",
    updatedBy: "Suraj Darade",
    assignedTo: "Suraj Darade",
    source: "Marketing"
  },
  {
    id: 2,
    leadNo: "Lead-9499",
    name: "Mr. Samadhan Tonde",
    email: "samadhan.tonde@example.com",
    phone: "8956024594",
    remark: "Client interested, discussing budget.",
    status: "Open",
    createdOn: "Feb 15, 2025 18:26:32",
    updatedOn: "Feb 15, 2025 18:26:32",
    createdBy: "Suraj Darade",
    updatedBy: "Suraj Darade",
    assignedTo: "Suraj Darade",
    source: "Marketing"
  },
  {
    id: 3,
    leadNo: "Lead-9498",
    name: "Mr. Ashok Rathi",
    email: "ashok.rathi@example.com",
    phone: "7791079777",
    remark: "Information given, price pitched 28k 37k.",
    status: "Open",
    createdOn: "Feb 15, 2025 17:35:55",
    updatedOn: "Feb 15, 2025 17:35:55",
    createdBy: "Suraj Darade",
    updatedBy: "Suraj Darade",
    assignedTo: "Suraj Darade",
    source: "Marketing"
  },
  {
    id: 4,
    leadNo: "Lead-9497",
    name: "Mr. Tarun Chavda",
    email: "tarun.chavda@example.com",
    phone: "7984671703",
    remark: "Client is not receiving the call.",
    status: "Open",
    createdOn: "Feb 17, 2025 10:35:54",
    updatedOn: "Feb 17, 2025 10:35:54",
    createdBy: "Suraj Darade",
    updatedBy: "Suraj Darade",
    assignedTo: "Suraj Darade",
    source: "Marketing"
  },
  {
    id: 5,
    leadNo: "Lead-9496",
    name: "Mr. Nilesh Gaikwad",
    email: "nilesh.gaikwad@example.com",
    phone: "9824850726",
    remark: "Client said he will callback after speaking with his senior.",
    status: "Open",
    createdOn: "Feb 17, 2025 10:53:26",
    updatedOn: "Feb 17, 2025 10:53:26",
    createdBy: "Pravin Whatkar",
    updatedBy: "Pravin Whatkar",
    assignedTo: "Pravin Whatkar",
    source: "Marketing"
  },
  {
    id: 6,
    leadNo: "Lead-9463",
    name: "Mr. Vishal",
    email: "vishal@example.com",
    phone: "9960622953",
    remark: "Information given, price pitched 18k. Client said he will let us know.",
    status: "Open",
    createdOn: "Feb 15, 2025 18:27:12",
    updatedOn: "Feb 15, 2025 18:27:12",
    createdBy: "Pravin Whatkar",
    updatedBy: "Pravin Whatkar",
    assignedTo: "Pravin Whatkar",
    source: "Marketing"
  },
  {
    id: 7,
    leadNo: "Lead-9462",
    name: "Mr. Vishal Sature",
    email: "vishal.sature@example.com",
    phone: "7304312332",
    remark: "Information given, price pitched 28k.",
    status: "Open",
    createdOn: "Feb 14, 2025 13:39:41",
    updatedOn: "Feb 14, 2025 13:39:41",
    createdBy: "Pravin Whatkar",
    updatedBy: "Pravin Whatkar",
    assignedTo: "Pravin Whatkar",
    source: "Marketing"
  },
  {
    id: 8,
    leadNo: "Lead-9461",
    name: "Mr. Bharat Kumar",
    email: "bharat.kumar@example.com",
    phone: "8849362576",
    remark: "Information given, price pitched 18k.",
    status: "Open",
    createdOn: "Feb 14, 2025 13:39:41",
    updatedOn: "Feb 14, 2025 13:39:41",
    createdBy: "Pravin Whatkar",
    updatedBy: "Pravin Whatkar",
    assignedTo: "Pravin Whatkar",
    source: "Marketing"
  },
  {
    id: 9,
    leadNo: "Lead-9460",
    name: "Mr. Vishal More",
    email: "vishal.more@example.com",
    phone: "8832032078",
    remark: "Client requested follow-up next week.",
    status: "Open",
    createdOn: "Feb 12, 2025 18:37:18",
    updatedOn: "Feb 12, 2025 18:37:18",
    createdBy: "Pravin Whatkar",
    updatedBy: "Pravin Whatkar",
    assignedTo: "Pravin Whatkar",
    source: "Marketing"
  },
  {
    id: 10,
    leadNo: "Lead-9517",
    name: "Mr. Pankaj Yadav",
    email: "pankaj.yadav@example.com",
    phone: "9888776655",
    remark: "Exploring options, requested price list.",
    status: "Open",
    createdOn: "Feb 16, 2025 18:00:50",
    updatedOn: "Feb 16, 2025 18:00:50",
    createdBy: "Sandeep Reddy",
    updatedBy: "Sandeep Reddy",
    assignedTo: "Sandeep Reddy",
    source: "LinkedIn"
  }
]


export const interest = []


 