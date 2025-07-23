const mockRecipes = [
  {
    id: 1,
    name: "Healing Potion",
    ingredients: [
      { name: "Herb", quantity: 2 },
      { name: "Water", quantity: 1 }
    ],
    result: "Healing Potion",
    description: "Restores 50 health points."
  },
  {
    id: 2,
    name: "Mana Potion",
    ingredients: [
      { name: "Mana Herb", quantity: 2 },
      { name: "Crystal Water", quantity: 1 }
    ],
    result: "Mana Potion",
    description: "Restores 30 mana points."
  },
  {
    id: 3,
    name: "Strength Elixir",
    ingredients: [
      { name: "Giant's Blood", quantity: 1 },
      { name: "Herb", quantity: 3 },
      { name: "Water", quantity: 1 }
    ],
    result: "Strength Elixir",
    description: "Increases strength by 10 for 5 minutes."
  },
  {
    id: 4,
    name: "Invisibility Potion",
    ingredients: [
      { name: "Shadow Root", quantity: 2 },
      { name: "Ghost Essence", quantity: 1 }
    ],
    result: "Invisibility Potion",
    description: "Grants invisibility for 30 seconds."
  }
];

export default mockRecipes;