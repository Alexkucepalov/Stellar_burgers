export interface Ingredient {
	_id: string;
	name: string;
	type: string;
	image: string;
	price: number;
	calories: number;
	proteins: number;
	fat: number;
	carbohydrates: number;
	uniqueId?: string;
	count?: number;
}

export interface IOrder {
	_id: string;
	ingredients: string[];
	status: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	number: number;
}

export interface IWsMessagePayload {
	success: boolean;
	orders: IOrder[];
	total: number;
	totalToday: number;
	message?: string;
}
