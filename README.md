# RecipeForge

RecipeForge is an intuitive recipe management tool designed to help users track ingredient inventory, perform intelligent synthesis calculations, and provide clear visual feedback with a responsive design.

## Features

- **Ingredient Inventory Tracking**: Keep track of your available ingredients and their quantities.
- **Smart Synthesis Calculation**: Automatically calculate the required materials for creating recipes.
- **Clear Visual Feedback**: User-friendly interface with visual indicators for inventory levels and synthesis requirements.
- **Responsive Design**: Optimized for various devices, ensuring a seamless experience on desktops, tablets, and mobile phones.

## Project Structure

```
RecipeForge
├── src
│   ├── components
│   │   ├── Recipe
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── RecipeForm.jsx
│   │   │   └── RecipeList.jsx
│   │   ├── Inventory
│   │   │   ├── InventoryItem.jsx
│   │   │   ├── InventoryManager.jsx
│   │   │   └── StockTracker.jsx
│   │   ├── Calculator
│   │   │   ├── CraftingCalculator.jsx
│   │   │   └── MaterialRequirement.jsx
│   │   ├── UI
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Toast.jsx
│   │   └── Layout
│   │       └── MainLayout.jsx
│   ├── hooks
│   │   ├── useInventory.js
│   │   ├── useRecipes.js
│   │   └── useCalculator.js
│   ├── store
│   │   ├── index.js
│   │   ├── recipeSlice.js
│   │   └── inventorySlice.js
│   ├── utils
│   │   ├── calculations.js
│   │   ├── storage.js
│   │   └── validators.js
│   ├── styles
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── responsive.css
│   ├── data
│   │   ├── mockRecipes.js
│   │   └── mockInventory.js
│   ├── App.jsx
│   └── main.jsx
├── public
│   ├── icons
│   └── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/RecipeForge.git
   ```
2. Navigate to the project directory:
   ```
   cd RecipeForge
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.