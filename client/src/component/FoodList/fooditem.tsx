import React from 'react';

interface FoodItemProps {
  name: string;
  price: string;
  imageURL: string;
}

const FoodItem: React.FC<FoodItemProps> = ({ name, price, imageURL }) => {
  return (
    <div className="m-auto w-11/12 flex border-b border-gray-200 p-2 pt-4 pb-6 hover:scale-105 transition-transform">
      
      <div className="w-1/3 md:w-1/4 aspect-square overflow-hidden rounded">
        <img src={imageURL} alt={name} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col justify-between flex-1 ml-6">
        <h3 className="text-gray-800 font-semibold text-lg">{name}</h3>
        <p className="text-gray-600 font-medium">{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
