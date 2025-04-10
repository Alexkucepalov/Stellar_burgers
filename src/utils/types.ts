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
}
