import React, { useEffect, useState } from "react";
import useAxios from "../hook/useAxios";
import ReviewCard from "./ReviewCard";
import Loading from "../pages/Loading";

const AllReviews = () => {
  const { sendRequest, loading } = useAxios();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await sendRequest("/reviews"); // নতুন API
        setReviews(res || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((rev, idx) => <ReviewCard key={idx} review={rev} />)
      )}
    </div>
  );
};

export default AllReviews;
