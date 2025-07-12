export interface EquipmentRentalCustomer {
  id: string;
  fullName: string;
  email?: string;
}

export interface EquipmentRental {
  customer?: EquipmentRentalCustomer;
  // add other fields if needed
}

export interface Equipment {
  id: string;
  type: string;
  sku?: string;
  make?: string;
  brand?: string;
  model?: string;
  serialNumber: string;
  size?: string;
  location?: string;
  quantity?: number;
  minQuantity?: number;
  availableQuantity?: number;
  itemValue?: number;
  rentalRate?: number | string;
  rentalTimeframe?: string;
  purchaseDate?: string;
  lastService?: string;
  nextService?: string;
  usageCount?: number;
  usageLimit?: number;
  rentedToId?: string;
  rentedTo?: {
    id: string;
    name: string;
    email?: string;
  } | null;
  rentPrice?: number;
  rentFrom?: string;
  rentTo?: string;
  rentedQuantity?: number;
  status: string;
  condition: string;
  notes?: string;
  diveCenterId?: string;
  // UI-specific fields for demo/mock data
  inUseBy?: string;
  inUseSince?: string;
  expectedReturn?: string;
  rentedToEmail?: string;
  rentedSince?: string;
  rentedUntil?: string;
  issue?: string;
  maintenanceSince?: string;
  expectedCompletion?: string;
  assignedTo?: string;
  lastInspection?: string;
  nextInspection?: string;
  trackUsage?: boolean;
  equipmentRentals?: EquipmentRental[];
}

export interface EquipmentFormValues {
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  lastServiceDate: string;
  nextServiceDate: string;
  status: string;
} 