import { atom, useAtom } from "jotai";

type Meal = {
  meal?: string;
  drink?: string;
  price: number;
};

type Passenger = {
  meal?: Meal;
  name: string;
};
export const orderAtom = atom<Passenger[]>([
  { name: "Beee" },
  { name: "Niharika" },
]);

export const passengerAtom = atom<string>("Beee");
