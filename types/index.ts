// types/index.ts
export interface Game {
  id: number;
  title: string;
  slug: string;
  image_url: string;
  patch: string;
  description: string;
  server1: string;
  server2: string;
  is_active: boolean;
  order: number;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
  game_slug: string;
  is_active: boolean;
  order: number;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon_url: string;
  order: number;
}

export interface Product {
  id: number;
  title: string;
  features: string;
  image_url: string;
  price: number;
  description: string;
  currency: string;
  category: string;
  faction: string;
  game_slug: string;
  server_id: number;
}

export interface Server {
  id: number;
  name: string;
  game_slug: string;
}

export interface ProductTemplate {
  id: number;
  category: string;
  title: string;
  description: string;
  how_it_works: string;
  payments_info: string;
  is_active: boolean;
  order: number;
  icon_img: string;
}
