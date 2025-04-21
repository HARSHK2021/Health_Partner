//// review card 
import React, { useState } from 'react';
import { Star, Send, Trash2 } from 'lucide-react';


export default function ReviewCard() {
  const [reviews, setReviews] = useState([]);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleStarClick = (rating) => {
    setCurrentRating(rating);
  };

  const handleStarHover = (rating) => {
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentRating === 0) return;

    const newReview= {
      id: Date.now(),
      rating: currentRating,
      comment,
      date: new Date(),
    };

    setReviews([newReview, ...reviews]);
    setCurrentRating(0);
    setComment('');
  };

  const handleDelete = (id) => {
    setReviews(reviews.filter(review => review.id !== id));
  };

  const renderStars = (rating, isInteractive = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const filled = isInteractive 
        ? (hoverRating || currentRating) >= starValue
        : rating >= starValue;

      return (
        <button
          key={index}
          type={isInteractive ? "button" : undefined}
          onClick={isInteractive ? () => handleStarClick(starValue) : undefined}
          onMouseEnter={isInteractive ? () => handleStarHover(starValue) : undefined}
          onMouseLeave={isInteractive ? handleStarLeave : undefined}
          className={`transition-colors ${
            isInteractive ? 'cursor-pointer hover:scale-110' : ''
          }`}
        >
          <Star
            className={`w-6 h-6 ${
              filled
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      );
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-1">
            {renderStars(currentRating, true)}
          </div>
          <div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-32"
            />
          </div>
          <button
            type="submit"
            disabled={currentRating === 0}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            Submit Review
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm text-gray-500">
                  {review.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <button
                onClick={() => handleDelete(review.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-4 text-gray-700">{review.comment}</p>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
}