export interface Dish {
  id: string;
  name: string;
  description: string;
  cookingTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  isVeg: boolean;
}

export interface Recipe {
  dishName: string;
  ingredients: string[];
  servings: number;
  cookingTime: string;
  difficulty: string;
  cuisine: string;
  isVeg: boolean;
  prepSteps: string[];
  cookSteps: string[];
  tips: string[];
  extraIngredients: string[];
  image?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  url: string;
}

export interface FavoriteRecipe {
  dishName: string;
  savedAt: number;
  ingredients: string[];
  description?: string;
  cookingTime?: string;
  difficulty?: string;
  cuisine?: string;
  isVeg?: boolean;
}
