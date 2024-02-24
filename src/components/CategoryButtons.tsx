// // CategoryButtons.tsx
// interface CategoryButtonsProps {
//   categories: string[];
//   canLockInScore: (category: string) => boolean;
//   isUsed: (category: string) => boolean;
//   currentCategoryScore: (category: string) => number;
//   onLockInScore: (category: string) => void;
// }

// const CategoryButtons: React.FC<CategoryButtonsProps> = ({ categories, canLockInScore, isUsed, currentCategoryScore, onLockInScore }) => (
//   <div className="flex flex-wrap space-x-2 max-w-3xl mx-auto justify-center">
//     {categories.map((category) => {
//       if (!canLockInScore(category) || isUsed(category)) return null;
      
//       const score = currentCategoryScore(category);
//       const buttonClass = getButtonClass(score); // Assuming getButtonClass is a utility function that returns a className based on the score
      
//       return (
//         <button
//           key={category}
//           className={buttonClass}
//           onClick={() => onLockInScore(category)}
//         >
//           {category.replace(/([A-Z])/g, ' $1').trim()}
//         </button>
//       );
//     })}
//   </div>
// );

// export default CategoryButtons
export {}