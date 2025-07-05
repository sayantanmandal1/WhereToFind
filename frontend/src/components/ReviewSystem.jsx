import React, { useState, useEffect } from 'react';
import './ReviewSystem.css';

const ReviewSystem = ({ mediaId, mediaType, mediaTitle }) => {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({
    rating: 0,
    comment: '',
    platform: '',
    price: '',
    experience: 'good'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    platformBreakdown: {}
  });

  useEffect(() => {
    fetchReviews();
  }, [mediaId]);

  const fetchReviews = async () => {
    try {
      // Simulate fetching reviews - in production, this would come from your backend
      const mockReviews = [
        {
          id: 1,
          user: 'MovieLover42',
          rating: 5,
          comment: 'Amazing movie! Found it on Netflix and it was worth every minute.',
          platform: 'Netflix',
          price: 'Free',
          experience: 'excellent',
          timestamp: '2024-01-15T10:30:00Z',
          helpful: 12
        },
        {
          id: 2,
          user: 'GamerPro',
          rating: 4,
          comment: 'Great game, bought it on Steam during the sale. Runs perfectly!',
          platform: 'Steam',
          price: '$29.99',
          experience: 'good',
          timestamp: '2024-01-14T15:45:00Z',
          helpful: 8
        },
        {
          id: 3,
          user: 'BookWorm',
          rating: 5,
          comment: 'Incredible read! Got it from Amazon and couldn\'t put it down.',
          platform: 'Amazon',
          price: '$15.99',
          experience: 'excellent',
          timestamp: '2024-01-13T09:20:00Z',
          helpful: 15
        }
      ];

      setReviews(mockReviews);
      
      // Calculate stats
      const totalReviews = mockReviews.length;
      const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
      const platformBreakdown = mockReviews.reduce((acc, review) => {
        acc[review.platform] = (acc[review.platform] || 0) + 1;
        return acc;
      }, {});

      setStats({ totalReviews, averageRating, platformBreakdown });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleRatingChange = (rating) => {
    setUserReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (userReview.rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReview = {
        id: Date.now(),
        user: 'You',
        ...userReview,
        timestamp: new Date().toISOString(),
        helpful: 0
      };

      setReviews(prev => [newReview, ...prev]);
      setUserReview({ rating: 0, comment: '', platform: '', price: '', experience: 'good' });
      setShowReviewForm(false);
      
      // Update stats
      const newTotalReviews = stats.totalReviews + 1;
      const newAverageRating = ((stats.averageRating * stats.totalReviews) + userReview.rating) / newTotalReviews;
      setStats(prev => ({
        ...prev,
        totalReviews: newTotalReviews,
        averageRating: newAverageRating
      }));
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getExperienceIcon = (experience) => {
    switch (experience) {
      case 'excellent': return '⭐';
      case 'good': return '👍';
      case 'average': return '😐';
      case 'poor': return '👎';
      default: return '👍';
    }
  };

  return (
    <div className="review-system">
      <div className="review-header">
        <h3>💬 Community Reviews</h3>
        <div className="review-stats">
          <div className="rating-display">
            <span className="average-rating">{stats.averageRating.toFixed(1)}</span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={`star ${star <= stats.averageRating ? 'filled' : ''}`}>
                  ⭐
                </span>
              ))}
            </div>
            <span className="total-reviews">({stats.totalReviews} reviews)</span>
          </div>
        </div>
      </div>

      <div className="review-actions">
        <button 
          className="write-review-btn"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          ✍️ Write a Review
        </button>
      </div>

      {showReviewForm && (
        <div className="review-form-container">
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="form-group">
              <label>Your Rating:</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= userReview.rating ? 'selected' : ''}`}
                    onClick={() => handleRatingChange(star)}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Platform:</label>
                <select 
                  value={userReview.platform}
                  onChange={(e) => setUserReview(prev => ({ ...prev, platform: e.target.value }))}
                  required
                >
                  <option value="">Select platform</option>
                  <option value="Netflix">Netflix</option>
                  <option value="Amazon Prime">Amazon Prime</option>
                  <option value="Disney+">Disney+</option>
                  <option value="Steam">Steam</option>
                  <option value="Epic Games">Epic Games</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price:</label>
                <input
                  type="text"
                  placeholder="e.g., $9.99, Free"
                  value={userReview.price}
                  onChange={(e) => setUserReview(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Experience:</label>
              <div className="experience-buttons">
                {[
                  { value: 'excellent', label: 'Excellent', icon: '⭐' },
                  { value: 'good', label: 'Good', icon: '👍' },
                  { value: 'average', label: 'Average', icon: '😐' },
                  { value: 'poor', label: 'Poor', icon: '👎' }
                ].map(exp => (
                  <button
                    key={exp.value}
                    type="button"
                    className={`experience-btn ${userReview.experience === exp.value ? 'selected' : ''}`}
                    onClick={() => setUserReview(prev => ({ ...prev, experience: exp.value }))}
                  >
                    {exp.icon} {exp.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Your Review:</label>
              <textarea
                placeholder="Share your experience with this content..."
                value={userReview.comment}
                onChange={(e) => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
                rows="4"
                required
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">{review.user}</span>
                  <span className="review-date">{formatDate(review.timestamp)}</span>
                </div>
                <div className="review-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={`star ${star <= review.rating ? 'filled' : ''}`}>
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              <div className="review-details">
                <div className="review-platform">
                  <strong>Platform:</strong> {review.platform}
                  {review.price && <span className="review-price"> • {review.price}</span>}
                </div>
                <div className="review-experience">
                  <strong>Experience:</strong> {getExperienceIcon(review.experience)} {review.experience}
                </div>
              </div>

              <div className="review-comment">
                {review.comment}
              </div>

              <div className="review-footer">
                <button className="helpful-btn">
                  👍 Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSystem; 