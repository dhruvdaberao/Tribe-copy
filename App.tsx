// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { useAuth } from './contexts/AuthContext';
// import { User, Post, Tribe, TribeMessage, Conversation, Message } from './types';
// import * as api from './api';
// import { useSocket } from '@/contexts/SocketContext';

// // Components
// import Sidebar from './components/layout/Sidebar';
// import FeedPage from './components/feed/FeedPage';
// import ProfilePage from './components/profile/ProfilePage';
// import ChatPage from './components/chat/ChatPage';
// import DiscoverPage from './components/discover/DiscoverPage';
// import LoginPage from './components/auth/LoginPage';
// import TribesPage from './components/tribes/TribesPage';
// import TribeDetailPage from './components/tribes/TribeDetailPage';
// import EditTribeModal from './components/tribes/EditTribeModal';
// import CreatePost from './components/feed/CreatePost';

// export type NavItem = 'Home' | 'Discover' | 'Messages' | 'Tribes' | 'Profile' | 'Ember' | 'TribeDetail';

// const EMBER_AI_USER: User = {
//     id: 'ember-ai',
//     name: 'Ember AI',
//     username: 'ember_ai',
//     avatarUrl: '/ember.png',
//     bannerUrl: null,
//     bio: 'Your fiery AI guide. Ask me anything!',
//     followers: [],
//     following: [],
//     blockedUsers: [],
// };

// const App: React.FC = () => {
//     const { currentUser, setCurrentUser, logout } = useAuth();
//     const socket = useSocket();
    
//     // Global State
//     const [users, setUsers] = useState<User[]>([]);
//     const [posts, setPosts] = useState<Post[]>([]);
//     const [tribes, setTribes] = useState<Tribe[]>([]);
//     const [isInitialLoading, setIsInitialLoading] = useState(true);
//     const [isCreatingPost, setIsCreatingPost] = useState(false);

//     // Navigation State
//     const [activeNavItem, setActiveNavItem] = useState<NavItem>('Home');
//     const [viewedUser, setViewedUser] = useState<User | null>(null);
//     const [viewedTribe, setViewedTribe] = useState<Tribe | null>(null);
//     const [editingTribe, setEditingTribe] = useState<Tribe | null>(null);
//     const [chatTarget, setChatTarget] = useState<User | null>(null);

//     const fetchData = useCallback(async () => {
//         if (!currentUser) {
//             setIsInitialLoading(false);
//             return;
//         }
//         try {
//             const [usersData, postsData, tribesData] = await Promise.all([
//                 api.fetchUsers(),
//                 api.fetchPosts(),
//                 api.fetchTribes(),
//             ]);

//             const userMap = new Map(usersData.data.map((user: User) => [user.id, user]));
            
//             const populatedPosts = postsData.data.map((post: any) => ({
//                 ...post,
//                 author: userMap.get(post.user),
//                 comments: post.comments ? post.comments.map((comment: any) => ({
//                     ...comment,
//                     author: userMap.get(comment.user),
//                 })).filter((c: any) => c.author) : [],
//             })).filter((p: Post) => p.author);

//             const populatedTribes = tribesData.data.map((tribe: any) => ({
//                 ...tribe,
//                 messages: tribe.messages ? tribe.messages.map((msg: any) => ({
//                     ...msg,
//                     sender: userMap.get(msg.sender)
//                 })).filter((m: TribeMessage) => m.sender) : []
//             }));

//             setUsers(usersData.data);
//             setPosts(populatedPosts);
//             setTribes(populatedTribes);

//         } catch (error) {
//             console.error("Failed to fetch initial data:", error);
//             if ((error as any)?.response?.status === 401) {
//                 logout(); // If token is invalid, log out
//             }
//         } finally {
//             setIsInitialLoading(false);
//         }
//     }, [currentUser, logout]);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);
    
//     // Real-time listener for tribe messages
//     useEffect(() => {
//         if (!socket) return;

//         socket.on('newTribeMessage', (newMessage: TribeMessage) => {
//             // Check if the message belongs to the currently viewed tribe
//             if (viewedTribe && viewedTribe.id === newMessage.tribeId) {
//                 setViewedTribe(prev => {
//                     if (prev) {
//                         // Avoid adding duplicate messages
//                         if (prev.messages.some(m => m.id === newMessage.id)) {
//                             return prev;
//                         }
//                         return { ...prev, messages: [...prev.messages, newMessage] };
//                     }
//                     return null;
//                 });
//             }
//         });

//         return () => {
//             socket.off('newTribeMessage');
//         };
//     }, [socket, viewedTribe]);

//     const handleSelectItem = (item: NavItem) => {
//         setChatTarget(null); // Clear any pending chat target
//         if (item === 'Profile') {
//             setViewedUser(currentUser);
//         } else {
//             setViewedUser(null);
//         }
//         if (item !== 'TribeDetail') {
//             setViewedTribe(null);
//         }
        
//         if (item === 'Ember') {
//             handleStartConversation(EMBER_AI_USER);
//             return;
//         }
        
//         setActiveNavItem(item);
//     };

//     const handleViewProfile = (user: User) => {
//         setViewedUser(user);
//         setActiveNavItem('Profile');
//     };
    
//     const handleStartConversation = (targetUser: User) => {
//         setChatTarget(targetUser);
//         setActiveNavItem('Messages');
//     };

//     // --- Post Handlers ---
//     const handleAddPost = async (content: string, imageUrl?: string) => {
//         if (!currentUser) return;
//         setIsCreatingPost(true);
//         try {
//             const { data: newPostData } = await api.createPost({ content, imageUrl });
//             const newPost: Post = {
//                 ...newPostData,
//                 author: currentUser,
//                 comments: [],
//                 likes: [],
//             };
//             setPosts(prevPosts => [newPost, ...prevPosts]);
//         } catch (error) {
//             console.error("Failed to add post:", error);
//             alert("Could not create post. Please try again.");
//         } finally {
//             setIsCreatingPost(false);
//         }
//     };

//     const handleLikePost = async (postId: string) => {
//         if (!currentUser) return;
//         const originalPosts = [...posts];
//         setPosts(posts.map(p => {
//             if (p.id === postId) {
//                 const isLiked = p.likes.includes(currentUser.id);
//                 const newLikes = isLiked
//                     ? p.likes.filter(id => id !== currentUser.id)
//                     : [...p.likes, currentUser.id];
//                 return { ...p, likes: newLikes };
//             }
//             return p;
//         }));
//         try {
//             await api.likePost(postId);
//         } catch (error) {
//             console.error("Failed to like post:", error);
//             setPosts(originalPosts);
//         }
//     };

//     const handleCommentPost = async (postId: string, text: string) => {
//         if (!currentUser) return;
//         try {
//             const { data: updatedPost } = await api.commentOnPost(postId, { text });
//             const userMap = new Map(users.map((user: User) => [user.id, user]));
//             const populatedPost = {
//                 ...updatedPost,
//                 author: userMap.get(updatedPost.user), // user is an ID here
//                 comments: updatedPost.comments.map((comment: any) => ({
//                     ...comment,
//                     author: comment.user, // comment.user is a populated object from backend
//                 })),
//             };
//             setPosts(posts.map(p => p.id === postId ? populatedPost : p));
//         } catch (error) {
//             console.error("Failed to comment:", error);
//         }
//     };

//     const handleDeletePost = async (postId: string) => {
//         const originalPosts = [...posts];
//         setPosts(posts.filter(p => p.id !== postId));
//         try {
//             await api.deletePost(postId);
//         } catch (error) {
//             console.error("Failed to delete post:", error);
//             setPosts(originalPosts);
//         }
//     };

//     const handleDeleteComment = async (postId: string, commentId: string) => {
//         const originalPosts = JSON.parse(JSON.stringify(posts));
//         setPosts(posts.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p));
//         try {
//             await api.deleteComment(postId, commentId);
//         } catch (error) {
//             console.error("Failed to delete comment:", error);
//             setPosts(originalPosts);
//         }
//     };

//     const handleSharePost = async (post: Post, destination: { type: 'tribe' | 'user', id: string }) => {
//         if (!currentUser) return;
//         const formattedText = `[Shared Post by @${post.author.username}]:\n${post.content}`;
        
//         try {
//             if (destination.type === 'tribe') {
//                 await api.sendTribeMessage(destination.id, { text: formattedText, imageUrl: post.imageUrl });
//                 alert(`Post successfully shared to tribe!`);
//             } else {
//                 await api.sendMessage(destination.id, { message: formattedText, imageUrl: post.imageUrl });
//                 // If a new conversation is started, we need to refresh to see it.
//                 // A better implementation would use sockets or state management.
//                 if (activeNavItem !== 'Messages') {
//                     alert(`Post successfully shared with user! Check your messages.`);
//                 }
//             }
//         } catch (error) {
//             console.error("Failed to share post:", error);
//             alert("Could not share post. Please try again.");
//         }
//     };

//     // --- User Handlers ---
//     const handleUpdateUser = async (updatedUserData: Partial<User>) => {
//         if (!currentUser) return;
//         try {
//             const { data: updatedUser } = await api.updateProfile(updatedUserData);
//             setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
//             if (updatedUser.id === currentUser.id) {
//                 setCurrentUser(updatedUser);
//             }
//             if (viewedUser && viewedUser.id === updatedUser.id) {
//                 setViewedUser(updatedUser);
//             }
//         } catch (error) {
//             console.error("Failed to update user:", error);
//         }
//     };
    
//     const handleToggleFollow = async (targetUserId: string) => {
//         if (!currentUser) return;
        
//         // Optimistic UI update
//         const isFollowing = currentUser.following.includes(targetUserId);
//         const updatedCurrentUser = {
//             ...currentUser,
//             following: isFollowing
//                 ? currentUser.following.filter(id => id !== targetUserId)
//                 : [...currentUser.following, targetUserId]
//         };
//         setCurrentUser(updatedCurrentUser); // This will persist to localStorage via AuthContext

//         setUsers(users.map(u => {
//             if (u.id === currentUser.id) return updatedCurrentUser;
//             if (u.id === targetUserId) {
//                 const isFollowedByCurrentUser = u.followers.includes(currentUser.id);
//                 return {
//                     ...u,
//                     followers: isFollowedByCurrentUser
//                         ? u.followers.filter(id => id !== currentUser.id)
//                         : [...u.followers, currentUser.id]
//                 };
//             }
//             return u;
//         }));
        
//         try {
//             await api.toggleFollow(targetUserId);
//             // On success, state is already updated.
//         } catch(error) {
//             console.error('Failed to toggle follow', error);
//             // Revert on error
//             fetchData();
//         }
//     };

//     const handleToggleBlock = async (targetUserId: string) => {
//         if (!currentUser) return;

//         const isBlocked = currentUser.blockedUsers.includes(targetUserId);
//         const updatedCurrentUser = {
//             ...currentUser,
//             blockedUsers: isBlocked
//                 ? currentUser.blockedUsers.filter(id => id !== targetUserId)
//                 : [...currentUser.blockedUsers, targetUserId],
//             // If blocking, also unfollow them
//             following: isBlocked ? currentUser.following : currentUser.following.filter(id => id !== targetUserId),
//         };
//         setCurrentUser(updatedCurrentUser);

//         try {
//             await api.toggleBlock(targetUserId);
//             // Refetch all data to ensure consistency after a block/unblock action
//             await fetchData(); 
//         } catch(error) {
//             console.error('Failed to toggle block', error);
//             // Revert on error
//             await fetchData();
//         }
//     };
    
//     const handleDeleteAccount = async () => {
//         if (window.confirm("Are you sure? This action is irreversible.")) {
//             try {
//                 await api.deleteAccount();
//                 alert("Account deleted successfully.");
//                 logout();
//             } catch(error) {
//                 console.error("Failed to delete account:", error);
//                 alert("Could not delete account. Please try again.");
//             }
//         }
//     };

//     // --- Tribe Handlers ---
//     const handleJoinToggle = async (tribeId: string) => {
//         if (!currentUser) return;
//         try {
//             const { data: updatedTribe } = await api.joinTribe(tribeId);
//             setTribes(tribes.map(t => t.id === tribeId ? { ...t, members: updatedTribe.members } : t));
//              if (viewedTribe?.id === tribeId) {
//                 setViewedTribe(prev => prev ? { ...prev, members: updatedTribe.members } : null);
//             }
//         } catch (error) {
//             console.error("Failed to join/leave tribe:", error);
//         }
//     };

//     const handleCreateTribe = async (name: string, description: string, avatarUrl?: string) => {
//         try {
//             const { data: newTribe } = await api.createTribe({ name, description, avatarUrl });
//             setTribes(prev => [{...newTribe, messages: []}, ...prev]);
//         } catch (error) {
//             console.error("Failed to create tribe:", error);
//         }
//     };

//     const handleViewTribe = async (tribe: Tribe) => {
//         try {
//             // Optimistically show tribe, then fetch messages
//             setViewedTribe(tribe);
//             setActiveNavItem('TribeDetail');
            
//             const { data: messages } = await api.fetchTribeMessages(tribe.id);
//             const userMap = new Map(users.map((user: User) => [user.id, user]));
//             const populatedMessages = messages.map((msg: any) => ({
//                 ...msg,
//                 sender: userMap.get(msg.sender)
//             })).filter((m: TribeMessage) => m.sender);

//             setViewedTribe(prev => prev ? { ...prev, messages: populatedMessages } : null);
//         } catch (error) {
//             console.error("Failed to fetch tribe messages:", error);
//         }
//     };

//     const handleEditTribe = async (tribeId: string, name: string, description: string, avatarUrl?: string | null) => {
//       try {
//           const { data: updatedTribeData } = await api.updateTribe(tribeId, { name, description, avatarUrl });
//           setTribes(tribes.map(t => (t.id === tribeId ? { ...t, ...updatedTribeData } : t)));
//           if (viewedTribe && viewedTribe.id === tribeId) {
//               setViewedTribe(prev => prev ? { ...prev, ...updatedTribeData } : null);
//           }
//           setEditingTribe(null);
//       } catch (error) {
//           console.error("Failed to edit tribe:", error);
//       }
//     };
    
//     const handleSendTribeMessage = async (tribeId: string, text: string, imageUrl?: string) => {
//         if (!currentUser || !viewedTribe) return;
//         try {
//             // The API call will trigger a socket event that updates the UI
//             await api.sendTribeMessage(tribeId, { text, imageUrl });
//         } catch (error) {
//             console.error("Failed to send tribe message:", error);
//         }
//     };

//     const visiblePosts = useMemo(() => {
//         if (!currentUser) return [];
//         return posts.filter(p => !currentUser.blockedUsers.includes(p.author.id) && !p.author.blockedUsers?.includes(currentUser.id));
//     }, [posts, currentUser]);

//     const visibleUsers = useMemo(() => {
//         if (!currentUser) return [];
//         return users.filter(u => !currentUser.blockedUsers.includes(u.id) && !u.blockedUsers?.includes(currentUser.id));
//     }, [users, currentUser]);
    
//     if (!currentUser) {
//         return <LoginPage />;
//     }
    
//     if (isInitialLoading) {
//         return (
//             <div className="min-h-screen bg-background flex items-center justify-center">
//                 <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
//             </div>
//         );
//     }

//     const renderContent = () => {
//         switch (activeNavItem) {
//             case 'Home':
//                 const feedPosts = visiblePosts.filter(p => currentUser.following.includes(p.author.id) || p.author.id === currentUser.id);
//                 return (
//                     <div className="max-w-2xl mx-auto">
//                         <CreatePost currentUser={currentUser} onAddPost={handleAddPost} isPosting={isCreatingPost}/>
//                         <FeedPage
//                             posts={feedPosts}
//                             currentUser={currentUser}
//                             allUsers={visibleUsers}
//                             allTribes={tribes}
//                             onLikePost={handleLikePost}
//                             onCommentPost={handleCommentPost}
//                             onDeletePost={handleDeletePost}
//                             onDeleteComment={handleDeleteComment}
//                             onViewProfile={handleViewProfile}
//                             onSharePost={handleSharePost}
//                         />
//                     </div>
//                 );
//             case 'Discover':
//                 return <DiscoverPage
//                     posts={visiblePosts}
//                     users={visibleUsers}
//                     tribes={tribes}
//                     currentUser={currentUser}
//                     onLikePost={handleLikePost}
//                     onCommentPost={handleCommentPost}
//                     onDeletePost={handleDeletePost}
//                     onDeleteComment={handleDeleteComment}
//                     onToggleFollow={handleToggleFollow}
//                     onViewProfile={handleViewProfile}
//                     onViewTribe={handleViewTribe}
//                     onJoinToggle={handleJoinToggle}
//                     onEditTribe={(tribe) => setEditingTribe(tribe)}
//                     onSharePost={handleSharePost}
//                 />;
//             case 'Messages':
//                 return <ChatPage 
//                     currentUser={currentUser}
//                     allUsers={visibleUsers}
//                     emberUser={EMBER_AI_USER}
//                     initialTargetUser={chatTarget}
//                     onViewProfile={handleViewProfile}
//                     onSharePost={handleSharePost}
//                 />;
//             case 'Tribes':
//                 return <TribesPage 
//                     tribes={tribes}
//                     currentUser={currentUser}
//                     onJoinToggle={handleJoinToggle}
//                     onCreateTribe={handleCreateTribe}
//                     onViewTribe={handleViewTribe}
//                     onEditTribe={(tribe) => setEditingTribe(tribe)}
//                 />;
//             case 'TribeDetail':
//                 if (!viewedTribe) return <div className="text-center p-8">Tribe not found. Go back to discover more tribes.</div>;
//                 return <TribeDetailPage
//                     tribe={viewedTribe}
//                     currentUser={currentUser}
//                     onSendMessage={handleSendTribeMessage}
//                     onBack={() => setActiveNavItem('Tribes')}
//                     onViewProfile={handleViewProfile}
//                     onEditTribe={(tribe) => setEditingTribe(tribe)}
//                     onJoinToggle={handleJoinToggle}
//                 />;
//             case 'Profile':
//                 if (!viewedUser || currentUser.blockedUsers.includes(viewedUser.id) || viewedUser.blockedUsers?.includes(currentUser.id)) {
//                      return <div className="text-center p-8">User not found or is blocked.</div>;
//                 }
//                 const userPosts = visiblePosts.filter(p => p.author.id === viewedUser.id);
//                 return <ProfilePage
//                     user={viewedUser}
//                     allUsers={visibleUsers}
//                     unfilteredUsers={users}
//                     allTribes={tribes}
//                     posts={userPosts}
//                     currentUser={currentUser}
//                     onLikePost={handleLikePost}
//                     onCommentPost={handleCommentPost}
//                     onDeletePost={handleDeletePost}
//                     onDeleteComment={handleDeleteComment}
//                     onViewProfile={handleViewProfile}
//                     onUpdateUser={handleUpdateUser}
//                     onAddPost={handleAddPost}
//                     onToggleFollow={handleToggleFollow}
//                     onToggleBlock={handleToggleBlock}
//                     onStartConversation={handleStartConversation}
//                     onLogout={logout}
//                     onDeleteAccount={handleDeleteAccount}
//                     onSharePost={handleSharePost}
//                 />;
//             // 'Ember' case is handled by handleSelectItem and redirects to 'Messages'
//             default:
//                 // Fallback for 'Ember' or any other invalid nav item
//                 return <div>Page not found</div>;
//         }
//     };

//     return (
//         <div className="bg-background min-h-screen text-primary">
//             <Sidebar 
//                 activeItem={activeNavItem} 
//                 onSelectItem={handleSelectItem} 
//                 currentUser={currentUser}
//             />
//             <main className="pt-20 pb-20 md:pb-4 px-4 md:px-6 max-w-7xl mx-auto">
//                 {renderContent()}
//             </main>
//             {editingTribe && (
//               <EditTribeModal
//                 tribe={editingTribe}
//                 onClose={() => setEditingTribe(null)}
//                 onSave={handleEditTribe}
//               />
//             )}
//         </div>
//     );
// };

// export default App;



import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useAuth } from './contexts/AuthContext';
import { User, Post, Tribe, TribeMessage, Conversation } from './types';
import * as api from './api';
import { SocketContext } from './contexts/SocketContext';

// Components
import Sidebar from './components/layout/Sidebar';
import FeedPage from './components/feed/FeedPage';
import ProfilePage from './components/profile/ProfilePage';
import ChatPage from './components/chat/ChatPage';
import DiscoverPage from './components/discover/DiscoverPage';
import LoginPage from './components/auth/LoginPage';
import TribesPage from './components/tribes/TribesPage';
import TribeDetailPage from './components/tribes/TribeDetailPage';
import EditTribeModal from './components/tribes/EditTribeModal';
import CreatePost from './components/feed/CreatePost';

export type NavItem = 'Home' | 'Discover' | 'Messages' | 'Tribes' | 'Profile' | 'Ember' | 'TribeDetail';

const EMBER_AI_USER: User = {
    id: 'ember-ai',
    name: 'Ember AI',
    username: 'ember_ai',
    avatarUrl: '/ember.png',
    bannerUrl: null,
    bio: 'Your fiery AI guide. Ask me anything!',
    followers: [],
    following: [],
    blockedUsers: [],
};

const App: React.FC = () => {
    const { currentUser, setCurrentUser, logout } = useAuth();
    const socket = useContext(SocketContext);
    
    // Global State
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [tribes, setTribes] = useState<Tribe[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);


    // Navigation State
    const [activeNavItem, setActiveNavItem] = useState<NavItem>('Home');
    const [viewedUser, setViewedUser] = useState<User | null>(null);
    const [viewedTribe, setViewedTribe] = useState<Tribe | null>(null);
    const [editingTribe, setEditingTribe] = useState<Tribe | null>(null);
    const [chatTarget, setChatTarget] = useState<User | null>(null);

    const fetchInitialData = useCallback(async () => {
        if (!currentUser) {
            setIsInitialLoading(false);
            return;
        }
        setIsInitialLoading(true);
        try {
            // Fetch only essential data for app shell. Page-specific data is fetched in components.
            const [usersData, tribesData] = await Promise.all([
                api.fetchUsers(),
                api.fetchTribes(),
            ]);
            setUsers(usersData.data);
            setTribes(tribesData.data.map((t: Tribe) => ({ ...t, messages: [] }))); // Messages are fetched on demand
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            if ((error as any)?.response?.status === 401) {
                logout(); // If token is invalid, log out
            }
        } finally {
            setIsInitialLoading(false);
        }
    }, [currentUser, logout]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);
    
    // Socket.IO listeners
    useEffect(() => {
        if (!socket || !currentUser) return;

        socket.emit('add-user', currentUser.id);

        const handleNewMessage = (newMessage: any) => {
            if (activeNavItem !== 'Messages' || !document.hasFocus()) {
                 setHasUnreadMessages(true);
            }
        };
        
        const handleNewTribeMessage = (newMessage: TribeMessage) => {
            // Add notification logic for tribes if needed
             setTribes(prevTribes => prevTribes.map(tribe => 
                tribe.id === newMessage.tribeId 
                ? { ...tribe, messages: [...(tribe.messages || []), newMessage] } 
                : tribe
            ));
        };

        socket.on('new-message', handleNewMessage);
        socket.on('new-tribe-message', handleNewTribeMessage);

        return () => {
            socket.off('new-message', handleNewMessage);
            socket.off('new-tribe-message', handleNewTribeMessage);
        };
    }, [socket, currentUser, activeNavItem]);

    const handleSelectItem = (item: NavItem) => {
        setChatTarget(null); // Clear any pending chat target
        if (item === 'Profile') {
            setViewedUser(currentUser);
        } else {
            setViewedUser(null);
        }
        if (item !== 'TribeDetail') {
            setViewedTribe(null);
        }
         if (item === 'Messages') {
            setHasUnreadMessages(false);
        }
        
        if (item === 'Ember') {
            handleStartConversation(EMBER_AI_USER);
            return;
        }
        
        setActiveNavItem(item);
    };

    const handleViewProfile = (user: User) => {
        setViewedUser(user);
        setActiveNavItem('Profile');
    };
    
    const handleStartConversation = (targetUser: User) => {
        setChatTarget(targetUser);
        setActiveNavItem('Messages');
    };

    // --- Post Handlers ---
    const handleAddPost = async (content: string, imageUrl?: string) => {
        if (!currentUser) return;
        setIsCreatingPost(true);
        try {
            const { data: newPostData } = await api.createPost({ content, imageUrl });
            const userMap = new Map(users.map((user: User) => [user.id, user]));
            const newPost: Post = {
                ...newPostData,
                author: userMap.get(newPostData.user) || currentUser,
                comments: [],
                likes: [],
            };
            setPosts(prevPosts => [newPost, ...prevPosts]);
        } catch (error) {
            console.error("Failed to add post:", error);
            alert("Could not create post. Please try again.");
        } finally {
            setIsCreatingPost(false);
        }
    };

    const handleLikePost = async (postId: string) => {
        if (!currentUser) return;
        const originalPosts = [...posts];
        setPosts(posts.map(p => {
            if (p.id === postId) {
                const isLiked = p.likes.includes(currentUser.id);
                const newLikes = isLiked
                    ? p.likes.filter(id => id !== currentUser.id)
                    : [...p.likes, currentUser.id];
                return { ...p, likes: newLikes };
            }
            return p;
        }));
        try {
            await api.likePost(postId);
        } catch (error) {
            console.error("Failed to like post:", error);
            setPosts(originalPosts);
        }
    };

    const handleCommentPost = async (postId: string, text: string) => {
        if (!currentUser) return;
        try {
            const { data: updatedPost } = await api.commentOnPost(postId, { text });
            const userMap = new Map(users.map((user: User) => [user.id, user]));
            const populatedPost = {
                ...updatedPost,
                author: userMap.get(updatedPost.user),
                comments: updatedPost.comments.map((comment: any) => ({
                    ...comment,
                    author: userMap.get(comment.user),
                })),
            };
            setPosts(posts.map(p => p.id === postId ? populatedPost : p));
        } catch (error) {
            console.error("Failed to comment:", error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        const originalPosts = [...posts];
        setPosts(posts.filter(p => p.id !== postId));
        try {
            await api.deletePost(postId);
        } catch (error) {
            console.error("Failed to delete post:", error);
            setPosts(originalPosts);
        }
    };

    const handleDeleteComment = async (postId: string, commentId: string) => {
        const originalPosts = JSON.parse(JSON.stringify(posts));
        setPosts(posts.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p));
        try {
            await api.deleteComment(postId, commentId);
        } catch (error) {
            console.error("Failed to delete comment:", error);
            setPosts(originalPosts);
        }
    };

    const handleSharePost = async (post: Post, destination: { type: 'tribe' | 'user', id: string }) => {
        if (!currentUser || !socket) return;
        const formattedText = `[Shared Post by @${post.author.username}]:\n${post.content}`;
        
        try {
            if (destination.type === 'tribe') {
                const { data: newMessage } = await api.sendTribeMessage(destination.id, { text: formattedText, imageUrl: post.imageUrl });
                socket.emit('send-tribe-message', { roomId: destination.id, message: { ...newMessage, sender: currentUser } });
                alert(`Post successfully shared to tribe!`);
            } else {
                 const { data: sentMessage } = await api.sendMessage(destination.id, { message: formattedText, imageUrl: post.imageUrl });
                 socket.emit('send-message', {
                    to: destination.id,
                    message: { ...sentMessage, sender: currentUser }
                });

                if (activeNavItem !== 'Messages') {
                    alert(`Post successfully shared with user! Check your messages.`);
                }
            }
        } catch (error) {
            console.error("Failed to share post:", error);
            alert("Could not share post. Please try again.");
        }
    };

    // --- User Handlers ---
    const handleUpdateUser = async (updatedUserData: Partial<User>) => {
        if (!currentUser) return;
        try {
            const { data: updatedUser } = await api.updateProfile(updatedUserData);
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            if (updatedUser.id === currentUser.id) {
                setCurrentUser(updatedUser);
            }
            if (viewedUser && viewedUser.id === updatedUser.id) {
                setViewedUser(updatedUser);
            }
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };
    
    const handleToggleFollow = async (targetUserId: string) => {
        if (!currentUser) return;
        
        // Optimistic UI update
        const isFollowing = currentUser.following.includes(targetUserId);
        const updatedCurrentUser = {
            ...currentUser,
            following: isFollowing
                ? currentUser.following.filter(id => id !== targetUserId)
                : [...currentUser.following, targetUserId]
        };
        setCurrentUser(updatedCurrentUser); // This will persist to localStorage via AuthContext

        setUsers(users.map(u => {
            if (u.id === currentUser.id) return updatedCurrentUser;
            if (u.id === targetUserId) {
                const isFollowedByCurrentUser = u.followers.includes(currentUser.id);
                return {
                    ...u,
                    followers: isFollowedByCurrentUser
                        ? u.followers.filter(id => id !== currentUser.id)
                        : [...u.followers, currentUser.id]
                };
            }
            return u;
        }));
        
        try {
            await api.toggleFollow(targetUserId);
        } catch(error) {
            console.error('Failed to toggle follow', error);
            // Revert on error
            fetchInitialData();
        }
    };

    const handleToggleBlock = async (targetUserId: string) => {
        if (!currentUser) return;
        try {
            await api.toggleBlock(targetUserId);
            // Refetch all data to ensure consistency after a block/unblock action
            await fetchInitialData(); 
        } catch(error) {
            console.error('Failed to toggle block', error);
            // Revert on error
            await fetchInitialData();
        }
    };
    
    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure? This action is irreversible.")) {
            try {
                await api.deleteAccount();
                alert("Account deleted successfully.");
                logout();
            } catch(error) {
                console.error("Failed to delete account:", error);
                alert("Could not delete account. Please try again.");
            }
        }
    };

    // --- Tribe Handlers ---
    const handleJoinToggle = async (tribeId: string) => {
        if (!currentUser) return;
        try {
            const { data: updatedTribe } = await api.joinTribe(tribeId);
            setTribes(tribes.map(t => t.id === tribeId ? { ...t, members: updatedTribe.members } : t));
             if (viewedTribe?.id === tribeId) {
                setViewedTribe(prev => prev ? { ...prev, members: updatedTribe.members } : null);
            }
        } catch (error) {
            console.error("Failed to join/leave tribe:", error);
        }
    };
    
    const handleDeleteTribe = async (tribeId: string) => {
        if (!window.confirm("Are you sure you want to delete this tribe? This action is permanent and cannot be undone.")) return;
        try {
            await api.deleteTribe(tribeId);
            setTribes(prev => prev.filter(t => t.id !== tribeId));
            if(viewedTribe?.id === tribeId) {
                setViewedTribe(null);
                setActiveNavItem('Tribes');
            }
        } catch (error) {
            console.error("Failed to delete tribe:", error);
            alert("Could not delete tribe. Please try again.");
        }
    };

    const handleCreateTribe = async (name: string, description: string, avatarUrl?: string) => {
        try {
            const { data: newTribe } = await api.createTribe({ name, description, avatarUrl });
            setTribes(prev => [{...newTribe, messages: []}, ...prev]);
        } catch (error) {
            console.error("Failed to create tribe:", error);
        }
    };

    const handleViewTribe = async (tribe: Tribe) => {
        try {
            setViewedTribe(tribe);
            setActiveNavItem('TribeDetail');
            
            const { data: messages } = await api.fetchTribeMessages(tribe.id);
            const userMap = new Map(users.map((user: User) => [user.id, user]));
            const populatedMessages = messages.map((msg: any) => ({
                ...msg,
                sender: userMap.get(msg.sender)
            })).filter((m: TribeMessage) => m.sender);

            setViewedTribe(prev => prev ? { ...prev, messages: populatedMessages } : null);
        } catch (error) {
            console.error("Failed to fetch tribe messages:", error);
        }
    };

    const handleEditTribe = async (tribeId: string, name: string, description: string, avatarUrl?: string | null) => {
      try {
          const { data: updatedTribeData } = await api.updateTribe(tribeId, { name, description, avatarUrl });
          setTribes(tribes.map(t => (t.id === tribeId ? { ...t, ...updatedTribeData } : t)));
          if (viewedTribe && viewedTribe.id === tribeId) {
              setViewedTribe(prev => prev ? { ...prev, ...updatedTribeData } : null);
          }
          setEditingTribe(null);
      } catch (error) {
          console.error("Failed to edit tribe:", error);
      }
    };
    
    const visibleUsers = useMemo(() => {
        if (!currentUser) return [];
        return users.filter(u => !currentUser.blockedUsers.includes(u.id) && !u.blockedUsers?.includes(currentUser.id));
    }, [users, currentUser]);
    
    if (!currentUser) {
        return <LoginPage />;
    }
    
    if (isInitialLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeNavItem) {
            case 'Home':
                return (
                    <div className="max-w-2xl mx-auto">
                        <CreatePost currentUser={currentUser} onAddPost={handleAddPost} isPosting={isCreatingPost}/>
                        <FeedPage
                            posts={posts}
                            setPosts={setPosts}
                            currentUser={currentUser}
                            allUsers={visibleUsers}
                            allTribes={tribes}
                            onLikePost={handleLikePost}
                            onCommentPost={handleCommentPost}
                            onDeletePost={handleDeletePost}
                            onDeleteComment={handleDeleteComment}
                            onViewProfile={handleViewProfile}
                            onSharePost={handleSharePost}
                        />
                    </div>
                );
            case 'Discover':
                return <DiscoverPage
                    users={visibleUsers}
                    tribes={tribes}
                    currentUser={currentUser}
                    onToggleFollow={handleToggleFollow}
                    onViewProfile={handleViewProfile}
                    onViewTribe={handleViewTribe}
                    onJoinToggle={handleJoinToggle}
                    onEditTribe={(tribe) => setEditingTribe(tribe)}
                    onSharePost={handleSharePost}
                />;
            case 'Messages':
                return <ChatPage 
                    currentUser={currentUser}
                    allUsers={visibleUsers}
                    emberUser={EMBER_AI_USER}
                    initialTargetUser={chatTarget}
                    onViewProfile={handleViewProfile}
                />;
            case 'Tribes':
                return <TribesPage 
                    tribes={tribes}
                    currentUser={currentUser}
                    onJoinToggle={handleJoinToggle}
                    onCreateTribe={handleCreateTribe}
                    onViewTribe={handleViewTribe}
                    onEditTribe={(tribe) => setEditingTribe(tribe)}
                    onDeleteTribe={handleDeleteTribe}
                />;
            case 'TribeDetail':
                if (!viewedTribe) return <div className="text-center p-8">Tribe not found. Go back to discover more tribes.</div>;
                return <TribeDetailPage
                    tribe={viewedTribe}
                    setTribes={setTribes}
                    currentUser={currentUser}
                    onBack={() => setActiveNavItem('Tribes')}
                    onViewProfile={handleViewProfile}
                    onEditTribe={(tribe) => setEditingTribe(tribe)}
                    onJoinToggle={handleJoinToggle}
                />;
            case 'Profile':
                if (!viewedUser || currentUser.blockedUsers.includes(viewedUser.id) || viewedUser.blockedUsers?.includes(currentUser.id)) {
                     return <div className="text-center p-8">User not found or is blocked.</div>;
                }
                return <ProfilePage
                    user={viewedUser}
                    allUsers={visibleUsers}
                    allTribes={tribes}
                    posts={posts}
                    setPosts={setPosts}
                    currentUser={currentUser}
                    onLikePost={handleLikePost}
                    onCommentPost={handleCommentPost}
                    onDeletePost={handleDeletePost}
                    onDeleteComment={handleDeleteComment}
                    onViewProfile={handleViewProfile}
                    onUpdateUser={handleUpdateUser}
                    onAddPost={handleAddPost}
                    onToggleFollow={handleToggleFollow}
                    onToggleBlock={handleToggleBlock}
                    onStartConversation={handleStartConversation}
                    onLogout={logout}
                    onDeleteAccount={handleDeleteAccount}
                    onSharePost={handleSharePost}
                />;
            default:
                return <div>Page not found</div>;
        }
    };

    return (
        <div className="bg-background min-h-screen text-primary">
            <Sidebar 
                activeItem={activeNavItem} 
                onSelectItem={handleSelectItem} 
                currentUser={currentUser}
                hasUnreadMessages={hasUnreadMessages}
            />
            <main className="pt-20 pb-20 md:pb-4 px-4 md:px-6 max-w-7xl mx-auto">
                {renderContent()}
            </main>
            {editingTribe && (
              <EditTribeModal
                tribe={editingTribe}
                onClose={() => setEditingTribe(null)}
                onSave={handleEditTribe}
              />
            )}
        </div>
    );
};

export default App;