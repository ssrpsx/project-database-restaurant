import React from 'react';
import FoodGrid from '../FoodList/foodgrid'
import Banner from '../Banner/banner'
import SearchBar from '../search/searchBar'

const Home: React.FC = () => {
  return (
    <>
      <Banner />
      <SearchBar />
      <FoodGrid />
    </>
  )
}

export default Home;