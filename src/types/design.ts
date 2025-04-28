
import { ReactNode } from "react";

export interface Room {
  id: string;
  name: string;
  icon: ReactNode;
}

export interface Style {
  id: string;
  name: string;
  thumbnail: string;
  description?: string;
}

export interface ColorScheme {
  id: string;
  name: string;
  colors: string[];
  description?: string;
}

export interface GeneratedDesign {
  id: string;
  imageURL: string;
  prompt: string;
  roomType: string;
  style: string;
  colorScheme?: string;
  createdAt: number;
}
