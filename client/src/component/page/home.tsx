import React from 'react';
import FoodGrid from '../FoodList/foodgrid'
import Banner from '../Banner/banner'

const Home: React.FC = () => {
  return (
    <>
      <Banner />
      <FoodGrid />
    </>
  )
}

export default Home;