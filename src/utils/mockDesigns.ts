
export interface MockDesign {
  imageURL: string;
  positivePrompt: string;
  style: string;
  room: string;
}

export const mockDesigns: MockDesign[] = [
  {
    imageURL: "https://images.unsplash.com/photo-1616046229478-9901c5536a45",
    positivePrompt: "A minimalist living room with natural light, wooden accents, and comfortable seating.",
    style: "minimalist",
    room: "living-room"
  },
  {
    imageURL: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92",
    positivePrompt: "A modern kitchen with white cabinets, marble countertops, and stainless steel appliances.",
    style: "modern",
    room: "kitchen"
  },
  {
    imageURL: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0",
    positivePrompt: "A scandinavian bedroom with muted colors, clean lines, and cozy textiles.",
    style: "scandinavian",
    room: "bedroom"
  },
  {
    imageURL: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14",
    positivePrompt: "An industrial home office with exposed brick, metal fixtures, and reclaimed wood furniture.",
    style: "industrial",
    room: "office"
  },
  {
    imageURL: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
    positivePrompt: "A farmhouse dining room with a rustic table, vintage chairs, and warm lighting.",
    style: "farmhouse",
    room: "dining-room"
  },
  {
    imageURL: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd",
    positivePrompt: "A coastal bathroom with white tiles, blue accents, and nautical decor.",
    style: "coastal",
    room: "bathroom"
  },
  {
    imageURL: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87",
    positivePrompt: "A bohemian outdoor patio with colorful textiles, plants, and string lights.",
    style: "bohemian",
    room: "outdoor"
  },
  {
    imageURL: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
    positivePrompt: "A mid-century modern living room with iconic furniture, geometric patterns, and vibrant colors.",
    style: "mid-century",
    room: "living-room"
  }
];

export const getRandomMockDesign = (room?: string, style?: string): MockDesign => {
  let filteredDesigns = mockDesigns;
  
  if (room) {
    filteredDesigns = filteredDesigns.filter(design => design.room === room);
  }
  
  if (style) {
    filteredDesigns = filteredDesigns.filter(design => design.style === style);
  }
  
  // If no matches, return a random design
  if (filteredDesigns.length === 0) {
    return mockDesigns[Math.floor(Math.random() * mockDesigns.length)];
  }
  
  return filteredDesigns[Math.floor(Math.random() * filteredDesigns.length)];
};

export const mockDesignToGeneratedImage = (mockDesign: MockDesign) => {
  return {
    imageURL: mockDesign.imageURL,
    positivePrompt: mockDesign.positivePrompt,
    seed: Math.floor(Math.random() * 1000000),
    NSFWContent: false,
    taskUUID: `mock-${Date.now()}`,
    imageUUID: `mock-${Date.now()}`
  };
};
