export type Item = {
  name: string;
  qty: number|"";
  price: number|"";
};

export interface ProfileForm {
  businessName: string;
  ownerName: string;
  gstNo: string;
  phone: string;
  address: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  logo: string;
  signature: string;
}

export interface Bill {
  _id: string;
  clientName: string;
  clientPhone?: string;
  invoiceNumber?: string;
  total: number;
}