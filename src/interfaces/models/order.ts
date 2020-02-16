export default interface IOrder {
  id?: number;
  description: string;
  quantity: number;
  value: number;

  createdDate?: Date;
  updatedDate?: Date;
}
