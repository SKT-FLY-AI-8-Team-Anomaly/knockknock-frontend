export type RentType = 'jeonse' | 'monthly';

export type HomeCard = {
  id: string;
  name: string;
  location: string;
  deposit: string;
  monthlyRent: string;
  maintenanceFee: string;
  rentType: RentType;
  brokerPhone: string;
  dueDate: string;
};

export type NewHomeInput = Omit<HomeCard, 'id'>;
