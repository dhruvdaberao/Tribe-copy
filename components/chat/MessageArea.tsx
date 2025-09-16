

// // import React, { useState, useRef, useEffect } from 'react';
// // import { Conversation, User, Message } from '../../types';
// // import UserAvatar from '../common/UserAvatar';

// // interface MessageAreaProps {
// //   conversation: Conversation;
// //   messages: Message[];
// //   currentUser: User;
// //   userMap: Map<string, User>;
// //   isSending: boolean;
// //   onSendMessage: (text: string) => void;
// //   onBack: () => void;
// //   onViewProfile: (user: User) => void;
// // }

// // const MessageArea: React.FC<MessageAreaProps> = ({ conversation, messages, currentUser, userMap, isSending, onSendMessage, onBack, onViewProfile }) => {
// //   const [inputText, setInputText] = useState('');
// //   const otherParticipantId = conversation.participants.find(p => p.id !== currentUser.id)?.id;
// //   const otherParticipant = otherParticipantId ? userMap.get(otherParticipantId) : null;
// //   const messagesEndRef = useRef<HTMLDivElement>(null);

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   }, [messages]);

// //   const handleSendMessage = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (inputText.trim()) {
// //       onSendMessage(inputText);
// //       setInputText('');
// //     }
// //   };

// //   if (!otherParticipant) {
// //       return (
// //           <div className="flex flex-col h-full bg-surface">
// //               <div className="flex items-center p-3 border-b border-border flex-shrink-0">
// //                   <button onClick={onBack} className="md:hidden p-2 mr-2 text-primary">
// //                       <BackIcon />
// //                   </button>
// //                   <h2 className="text-lg font-bold text-primary">Error</h2>
// //               </div>
// //               <div className="flex-1 flex items-center justify-center p-4 text-center">
// //                   <p className="text-secondary">Could not load conversation. The user may no longer exist.</p>
// //               </div>
// //           </div>
// //       );
// //   }

// //   return (
// //     <div className="flex flex-col h-full bg-background">
// //       <div className="flex items-center p-3 border-b border-border bg-surface flex-shrink-0">
// //         <button onClick={onBack} className="md:hidden p-2 mr-2 text-primary">
// //             <BackIcon />
// //         </button>
// //         <div 
// //             className="flex items-center cursor-pointer overflow-hidden"
// //             onClick={() => onViewProfile(otherParticipant)}
// //         >
// //             <UserAvatar user={otherParticipant} className="w-10 h-10 rounded-full mr-3 flex-shrink-0" />
// //             <div className="min-w-0">
// //                 <h2 className="text-lg font-bold text-primary leading-tight hover:underline truncate">{otherParticipant.name}</h2>
// //                 <p className="text-sm text-secondary leading-tight truncate">@{otherParticipant.username}</p>
// //             </div>
// //         </div>
// //       </div>

// //       <div className="flex-1 overflow-y-auto p-4">
// //         <div className="flex flex-col space-y-2">
// //           {messages.map(message => {
// //             const isCurrentUser = message.senderId === currentUser.id;
// //             const sender = isCurrentUser ? currentUser : userMap.get(message.senderId);
// //             const sentAt = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
// //             return (
// //               <div key={message.id} className={`flex items-end gap-2.5 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
// //                 {!isCurrentUser && (
// //                     <div className="w-8 h-8 rounded-full flex-shrink-0 self-start">
// //                       <UserAvatar user={sender || null} />
// //                     </div>
// //                 )}
// //                 <div className={`flex flex-col w-full max-w-xs lg:max-w-md ${isCurrentUser ? 'items-end' : 'items-start'}`}>
// //                     <div className={`px-4 py-2.5 rounded-xl break-words ${isCurrentUser ? 'bg-accent text-accent-text' : 'bg-surface text-primary shadow-sm'}`}>
// //                         <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
// //                     </div>
// //                     <p className="text-xs text-secondary mt-1.5 px-1">{sentAt}</p>
// //                 </div>
// //               </div>
// //             );
// //           })}
// //            {messages.length === 0 && (
// //              <div className="text-center text-secondary p-8">
// //                   <p>This is the beginning of your conversation with {otherParticipant.name}.</p>
// //               </div>
// //            )}
// //            {isSending && otherParticipant.id !== 'ember-ai' && (
// //              <div className="flex justify-end">
// //                 <p className="text-xs text-secondary mt-1.5 px-1 italic">Sending...</p>
// //              </div>
// //            )}
// //            <div ref={messagesEndRef} />
// //         </div>
// //       </div>

// //       <div className="p-4 border-t border-border bg-surface flex-shrink-0">
// //         <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
// //           <input
// //             type="text"
// //             value={inputText}
// //             onChange={(e) => setInputText(e.target.value)}
// //             placeholder="Type a message..."
// //             className="flex-1 bg-background border border-border rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent text-primary min-w-0"
// //           />
// //           <button type="submit" className="bg-accent text-accent-text rounded-full w-11 h-11 flex-shrink-0 flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-50" disabled={!inputText.trim() || isSending}>
// //             {isSending ? <div className="w-5 h-5 border-2 border-accent-text border-t-transparent rounded-full animate-spin"></div> : <SendIcon />}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;
// // const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;

// // export default MessageArea;





// import React, { useState, useRef, useEffect } from 'react';
// import { Conversation, User, Message } from '../../types';
// import UserAvatar from '../common/UserAvatar';

// interface MessageAreaProps {
//   conversation: Conversation;
//   messages: Message[];
//   currentUser: User;
//   userMap: Map<string, User>;
//   isSending: boolean;
//   onSendMessage: (text: string) => void;
//   onBack: () => void;
//   onViewProfile: (user: User) => void;
// }

// const MessageArea: React.FC<MessageAreaProps> = ({ conversation, messages, currentUser, userMap, isSending, onSendMessage, onBack, onViewProfile }) => {
//   const [inputText, setInputText] = useState('');
//   const otherParticipantId = conversation.participants.find(p => p.id !== currentUser.id)?.id;
//   const otherParticipant = otherParticipantId ? userMap.get(otherParticipantId) : null;
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (inputText.trim()) {
//       onSendMessage(inputText);
//       setInputText('');
//     }
//   };

//   if (!otherParticipant) {
//       return (
//           <div className="flex flex-col h-full bg-surface">
//               <div className="flex items-center p-3 border-b border-border flex-shrink-0">
//                   <button onClick={onBack} className="md:hidden p-2 mr-2 text-primary">
//                       <BackIcon />
//                   </button>
//                   <h2 className="text-lg font-bold text-primary">Error</h2>
//               </div>
//               <div className="flex-1 flex items-center justify-center p-4 text-center">
//                   <p className="text-secondary">Could not load conversation. The user may no longer exist.</p>
//               </div>
//           </div>
//       );
//   }

//   return (
//     <div className="flex flex-col h-full bg-background">
//       <div className="flex items-center p-3 border-b border-border bg-surface flex-shrink-0">
//         <button onClick={onBack} className="md:hidden p-2 mr-2 text-primary">
//             <BackIcon />
//         </button>
//         <div 
//             className="flex items-center cursor-pointer overflow-hidden"
//             onClick={() => onViewProfile(otherParticipant)}
//         >
//             <UserAvatar user={otherParticipant} className="w-10 h-10 rounded-full mr-3 flex-shrink-0" />
//             <div className="min-w-0">
//                 <h2 className="text-lg font-bold text-primary leading-tight hover:underline truncate">{otherParticipant.name}</h2>
//                 <p className="text-sm text-secondary leading-tight truncate">@{otherParticipant.username}</p>
//             </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4">
//         <div className="flex flex-col space-y-2">
//           {messages.map(message => {
//             const isCurrentUser = message.senderId === currentUser.id;
//             const sender = isCurrentUser ? currentUser : userMap.get(message.senderId);
//             const sentAt = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
//             return (
//               <div key={message.id} className={`flex items-end gap-2.5 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
//                 {!isCurrentUser && (
//                     <div className="w-8 h-8 rounded-full flex-shrink-0 self-start">
//                       <UserAvatar user={sender || null} />
//                     </div>
//                 )}
//                 <div className={`flex flex-col w-full max-w-xs lg:max-w-md ${isCurrentUser ? 'items-end' : 'items-start'}`}>
//                     <div className={`px-4 py-2.5 rounded-xl break-words ${isCurrentUser ? 'bg-accent text-accent-text' : 'bg-surface text-primary shadow-sm'}`}>
//                         {message.imageUrl && (
//                           <img src={message.imageUrl} alt="Shared content" className="mb-2 rounded-lg w-full" />
//                         )}
//                         <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
//                     </div>
//                     <p className="text-xs text-secondary mt-1.5 px-1">{sentAt}</p>
//                 </div>
//               </div>
//             );
//           })}
//            {messages.length === 0 && (
//              <div className="text-center text-secondary p-8">
//                   <p>This is the beginning of your conversation with {otherParticipant.name}.</p>
//               </div>
//            )}
//            {isSending && otherParticipant.id !== 'ember-ai' && (
//              <div className="flex justify-end">
//                 <p className="text-xs text-secondary mt-1.5 px-1 italic">Sending...</p>
//              </div>
//            )}
//            <div ref={messagesEndRef} />
//         </div>
//       </div>

//       <div className="p-4 border-t border-border bg-surface flex-shrink-0">
//         <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
//           <input
//             type="text"
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1 bg-background border border-border rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent text-primary min-w-0"
//           />
//           <button type="submit" className="bg-accent text-accent-text rounded-full w-11 h-11 flex-shrink-0 flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-50" disabled={!inputText.trim() || isSending}>
//             {isSending ? <div className="w-5 h-5 border-2 border-accent-text border-t-transparent rounded-full animate-spin"></div> : <SendIcon />}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;
// const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;

// export default MessageArea;





import React, { useState, useRef, useEffect, useContext } from 'react';
import { Conversation, User, Message } from '../../types';
import UserAvatar from '../common/UserAvatar';
import { SocketContext } from '../../contexts/SocketContext';

interface MessageAreaProps {
  conversation: Conversation;
  messages: Message[];
  currentUser: User;
  userMap: Map<string, User>;
  isSending: boolean;
  typingUsers: User[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
  onViewProfile: (user: User) => void;
}

const MessageArea: React.FC<MessageAreaProps> = ({ conversation, messages, currentUser, userMap, isSending, typingUsers, onSendMessage, onBack, onViewProfile }) => {
  const [inputText, setInputText] = useState('');
  const otherParticipantId = conversation.participants.find(p => p.id !== currentUser.id)?.id;
  const otherParticipant = otherParticipantId ? userMap.get(otherParticipantId) : null;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socket = useContext(SocketContext);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!socket || !otherParticipantId) return;

    if (!typingTimeoutRef.current) {
        socket.emit('start-typing', { roomId: otherParticipantId, user: currentUser });
    } else {
        clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop-typing', { roomId: otherParticipantId, user: currentUser });
        typingTimeoutRef.current = null;
    }, 2000); // 2 seconds of inactivity
  };
  
   useEffect(() => {
    // Cleanup timeout on component unmount
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (!otherParticipant) {
      return (
          <div className="flex flex-col h-full bg-surface">
              <div className="flex items-center p-3 border-b border-border flex-shrink-0">
                  <button onClick={onBack} className="md:hidden p-2 mr-2 text-primary">
                      <BackIcon />
                  </button>
                  <h2 className="text-lg font-bold text-primary">Error</h2>
              </div>
              <div className="flex-1 flex items-center justify-center p-4 text-center">
                  <p className="text-secondary">Could not load conversation. The user may no longer exist.</p>
              </div>
          </div>
      );
  }

  const isOtherUserTyping = typingUsers.some(u => u.id === otherParticipant?.id);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center p-3 border-b border-border bg-surface flex-shrink-0">
        <button onClick={onBack} className="md:hidden p-2 mr-2 text-primary">
            <BackIcon />
        </button>
        <div 
            className="flex items-center cursor-pointer overflow-hidden"
            onClick={() => onViewProfile(otherParticipant)}
        >
            <UserAvatar user={otherParticipant} className="w-10 h-10 rounded-full mr-3 flex-shrink-0" />
            <div className="min-w-0">
                <h2 className="text-lg font-bold text-primary leading-tight hover:underline truncate">{otherParticipant.name}</h2>
                <p className="text-sm text-secondary leading-tight truncate">@{otherParticipant.username}</p>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-2">
          {messages.map(message => {
            const isCurrentUser = message.senderId === currentUser.id;
            const sender = isCurrentUser ? currentUser : userMap.get(message.senderId);
            const sentAt = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            return (
              <div key={message.id} className={`flex items-end gap-2.5 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                {!isCurrentUser && (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 self-start">
                      <UserAvatar user={sender || null} />
                    </div>
                )}
                <div className={`flex flex-col w-full max-w-xs lg:max-w-md ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-2.5 rounded-xl break-words ${isCurrentUser ? 'bg-accent text-accent-text' : 'bg-surface text-primary shadow-sm'}`}>
                        {message.imageUrl && (
                          <img src={message.imageUrl} alt="Shared content" className="mb-2 rounded-lg w-full" />
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    </div>
                    <p className="text-xs text-secondary mt-1.5 px-1">{sentAt}</p>
                </div>
              </div>
            );
          })}
           {messages.length === 0 && (
             <div className="text-center text-secondary p-8">
                  <p>This is the beginning of your conversation with {otherParticipant.name}.</p>
              </div>
           )}
           {isOtherUserTyping && (
             <div className="flex items-end gap-2.5 justify-start">
                <div className="w-8 h-8 rounded-full flex-shrink-0 self-start">
                    <UserAvatar user={otherParticipant || null} />
                </div>
                 <div className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-surface text-primary shadow-sm">
                    <div className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"></span>
                    </div>
                </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-border bg-surface flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <button type="button" className="text-secondary hover:text-accent p-2" aria-label="Send a GIF or sticker" onClick={() => alert('GIF/Sticker functionality coming soon!')}>
            <GifIcon />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 bg-background border border-border rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent text-primary min-w-0"
          />
          <button type="submit" className="bg-accent text-accent-text rounded-full w-11 h-11 flex-shrink-0 flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-50" disabled={!inputText.trim() || isSending}>
            {isSending ? <div className="w-5 h-5 border-2 border-accent-text border-t-transparent rounded-full animate-spin"></div> : <SendIcon />}
          </button>
        </form>
      </div>
    </div>
  );
};

const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const GifIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


export default MessageArea;