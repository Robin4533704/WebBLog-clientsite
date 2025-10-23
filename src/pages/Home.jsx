import React from 'react';
import HeroSection from './Herosection';
import NewsLetter from './NewsLetter';
import ActivityCard from '../components/ActivityCard';
import CategoryBlogs from '../components/DhasBord/CategoryBlogs';

const Home = () => {
    return (
        <div>
            <HeroSection/>
            <CategoryBlogs/>
             <ActivityCard/>
            <NewsLetter/>
           
        </div>
    );
};

export default Home;