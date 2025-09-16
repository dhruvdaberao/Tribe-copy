// // import React from 'react';
// // import { Post, User } from '../../types';
// // import PostCard from './PostCard';

// // interface FeedPageProps {
// //   posts: Post[];
// //   currentUser: User;
// //   onLikePost: (postId: string) => void;
// //   onCommentPost: (postId: string, text: string) => void;
// //   onDeletePost: (postId: string) => void;
// //   onDeleteComment: (postId: string, commentId: string) => void;
// //   onViewProfile: (user: User) => void;
// // }

// // const FeedPage: React.FC<FeedPageProps> = ({ posts, currentUser, onLikePost, onCommentPost, onDeletePost, onDeleteComment, onViewProfile }) => {
// //   return (
// //     <div>
// //       <h1 className="text-2xl font-bold text-primary mb-6 font-display">Home Feed</h1>
// //       <div>
// //         {posts.map(post => (
// //           <PostCard
// //             key={post.id}
// //             post={post}
// //             currentUser={currentUser}
// //             onLike={onLikePost}
// //             onComment={onCommentPost}
// //             onDeletePost={onDeletePost}
// //             onDeleteComment={onDeleteComment}
// //             onViewProfile={onViewProfile}
// //           />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default FeedPage;



// import React from 'react';
// import { Post, User, Tribe } from '../../types';
// import PostCard from './PostCard';

// interface FeedPageProps {
//   posts: Post[];
//   currentUser: User;
//   allUsers: User[];
//   allTribes: Tribe[];
//   onLikePost: (postId: string) => void;
//   onCommentPost: (postId: string, text: string) => void;
//   onDeletePost: (postId: string) => void;
//   onDeleteComment: (postId: string, commentId: string) => void;
//   onViewProfile: (user: User) => void;
//   onSharePost: (post: Post, destination: { type: 'tribe' | 'user', id: string }) => void;
// }

// const FeedPage: React.FC<FeedPageProps> = (props) => {
//   const { posts, currentUser, allUsers, allTribes, onLikePost, onCommentPost, onDeletePost, onDeleteComment, onViewProfile, onSharePost } = props;
//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-primary mb-6 font-display">Home Feed</h1>
//       <div>
//         {posts.map(post => (
//           <PostCard
//             key={post.id}
//             post={post}
//             currentUser={currentUser}
//             allUsers={allUsers}
//             allTribes={allTribes}
//             onLike={onLikePost}
//             onComment={onCommentPost}
//             onDeletePost={onDeletePost}
//             onDeleteComment={onDeleteComment}
//             onViewProfile={onViewProfile}
//             onSharePost={onSharePost}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FeedPage;




import React, { useState, useEffect, useCallback } from 'react';
import { Post, User, Tribe } from '../../types';
import PostCard from './PostCard';
import * as api from '../../api';

interface FeedPageProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  currentUser: User;
  allUsers: User[];
  allTribes: Tribe[];
  onLikePost: (postId: string) => void;
  onCommentPost: (postId: string, text: string) => void;
  onDeletePost: (postId: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onViewProfile: (user: User) => void;
  onSharePost: (post: Post, destination: { type: 'tribe' | 'user', id: string }) => void;
}

const FeedPage: React.FC<FeedPageProps> = (props) => {
  const { posts, setPosts, currentUser, allUsers, allTribes, onLikePost, onCommentPost, onDeletePost, onDeleteComment, onViewProfile, onSharePost } = props;
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeedPosts = useCallback(async () => {
    setIsLoading(true);
    try {
        const { data: postsData } = await api.fetchPosts();
        const userMap = new Map(allUsers.map((user: User) => [user.id, user]));
        
        const populatedPosts = postsData.map((post: any) => ({
            ...post,
            author: userMap.get(post.user),
            comments: post.comments ? post.comments.map((comment: any) => ({
                ...comment,
                author: userMap.get(comment.user),
            })).filter((c: any) => c.author) : [],
        })).filter((p: Post) => p.author);

        setPosts(populatedPosts);
    } catch (error) {
        console.error("Failed to fetch posts for feed:", error);
    } finally {
        setIsLoading(false);
    }
  }, [allUsers, setPosts]);

  useEffect(() => {
    if (allUsers.length > 0) {
        fetchFeedPosts();
    }
  }, [fetchFeedPosts, allUsers.length]);

  const feedPosts = React.useMemo(() => {
    if (!currentUser) return [];
    return posts.filter(p => 
        (currentUser.following.includes(p.author.id) || p.author.id === currentUser.id) &&
        !currentUser.blockedUsers.includes(p.author.id) && 
        !p.author.blockedUsers?.includes(currentUser.id)
    );
  }, [posts, currentUser]);

  if (isLoading) {
    return (
        <div className="text-center p-8">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6 font-display">Home Feed</h1>
      <div>
        {feedPosts.length > 0 ? feedPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            allUsers={allUsers}
            allTribes={allTribes}
            onLike={onLikePost}
            onComment={onCommentPost}
            onDeletePost={onDeletePost}
            onDeleteComment={onDeleteComment}
            onViewProfile={onViewProfile}
            onSharePost={onSharePost}
          />
        )) : (
            <div className="bg-surface p-8 text-center rounded-2xl border border-border">
                <p className="text-secondary">Your feed is quiet.</p>
                <p className="text-sm text-secondary mt-1">Follow people to see their posts here, or head to Discover to find new content.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;