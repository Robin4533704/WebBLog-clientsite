import React from 'react';
import HeroSection from './Herosection';
import ReviewMarquee from '../components/DhasBord/ReviewMarquee';
import LatestBlogCard from './LatestBLogs';
import CategoryBlogs from '../components/DhasBord/CategoryBlogs';

import ActivityLog from './activityIcons';




const Home = () => {
    return (
        <div>
            <HeroSection/>
            <LatestBlogCard/>
            <ReviewMarquee/>
            <CategoryBlogs/>
          <ActivityLog/>
            
             
           
        </div>
    );
};

export default Home;