export interface Equipment {
  id: string;
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  lastServiceDate: string;
  nextServiceDate: string;
  status: string;
  center?: string;
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