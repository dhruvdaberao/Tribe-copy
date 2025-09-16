// import React from 'react';
// import { User } from '../../types';

// interface UserAvatarProps {
//   user: User | null;
//   className?: string;
// }

// const UserPlaceholderIcon = ({ className = '' }: { className?: string }) => (
//     <div className={`bg-background border border-border rounded-full flex items-center justify-center text-secondary ${className}`}>
//         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3/5 h-3/5">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
//         </svg>
//     </div>
// );


// const UserAvatar: React.FC<UserAvatarProps> = ({ user, className = '' }) => {
//     // If there's an avatar URL, wrap the image in a div to enforce the circular shape.
//     if (user?.avatarUrl) {
//         return (
//             <div className={`rounded-full overflow-hidden bg-background ${className}`}>
//                 <img 
//                     src={user.avatarUrl} 
//                     alt={user.name}
//                     className="w-full h-full object-cover"
//                 />
//             </div>
//         );
//     }
    
//     // Otherwise, use the placeholder component which is already styled correctly.
//     // Also handles the case where the user object is null.
//     return <UserPlaceholderIcon className={className} />;
// };

// export default UserAvatar;







import React from 'react';
import { User } from '../../types';

interface UserAvatarProps {
  user: User | null;
  className?: string;
}

const UserPlaceholderIcon = ({ className = '' }: { className?: string }) => (
    <div className={`bg-background border border-border rounded-full flex items-center justify-center text-secondary ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3/5 h-3/5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    </div>
);

const UserAvatar: React.FC<UserAvatarProps> = ({ user, className = 'w-10 h-10' }) => {
  if (!user) {
    return <UserPlaceholderIcon className={`${className} rounded-full`} />;
  }

  return (
    <div className={`${className} rounded-full`}>
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <UserPlaceholderIcon className="w-full h-full" />
      )}
    </div>
  );
};

export default UserAvatar;
