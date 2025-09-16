// // // import React, { useState, useRef, useEffect } from 'react';
// // // import { Tribe, User, TribeMessage } from '../../types';
// // // import UserAvatar from '../common/UserAvatar';
// // // import { useSocket } from '../../contexts/SocketContext';

// // // interface TribeDetailPageProps {
// // //   tribe: Tribe;
// // //   currentUser: User;
// // //   onSendMessage: (tribeId: string, text: string, imageUrl?: string) => void;
// // //   onBack: () => void;
// // //   onViewProfile: (user: User) => void;
// // //   onEditTribe: (tribe: Tribe) => void;
// // //   onJoinToggle: (tribeId: string) => void;
// // // }

// // // const TribePlaceholderIcon = () => (
// // //      <div className="w-10 h-10 rounded-full mr-3 bg-background border border-border flex items-center justify-center text-secondary p-2">
// // //         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
// // //             <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
// // //             <circle cx="9" cy="7" r="4"></circle>
// // //             <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
// // //             <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
// // //         </svg>
// // //     </div>
// // // );


// // // const TribeDetailPage: React.FC<TribeDetailPageProps> = ({ tribe, currentUser, onSendMessage, onBack, onViewProfile, onEditTribe, onJoinToggle }) => {
// // //   const [inputText, setInputText] = useState('');
// // //   const [imagePreview, setImagePreview] = useState<string | null>(null);
// // //   const fileInputRef = useRef<HTMLInputElement>(null);
// // //   const messagesEndRef = useRef<HTMLDivElement>(null);
// // //   const isMember = tribe.members.includes(currentUser.id);
// // //   const socket = useSocket();

// // //   // Join and leave socket room for this tribe
// // //   useEffect(() => {
// // //     if (socket && isMember) {
// // //       socket.emit('joinRoom', tribe.id);
      
// // //       return () => {
// // //         socket.emit('leaveRoom', tribe.id);
// // //       };
// // //     }
// // //   }, [socket, tribe.id, isMember]);


// // //   useEffect(() => {
// // //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // //   }, [tribe.messages]);

// // //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const file = e.target.files?.[0];
// // //     if (file) {
// // //       const reader = new FileReader();
// // //       reader.onloadend = () => {
// // //         setImagePreview(reader.result as string);
// // //       };
// // //       reader.readAsDataURL(file);
// // //     }
// // //   };

// // //   const removeImage = () => {
// // //       setImagePreview(null);
// // //       if(fileInputRef.current) {
// // //           fileInputRef.current.value = "";
// // //       }
// // //   }

// // //   const handleSendMessage = (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     if (inputText.trim() || imagePreview) {
// // //       onSendMessage(tribe.id, inputText, imagePreview || undefined);
// // //       setInputText('');
// // //       removeImage();
// // //     }
// // //   };
  
// // //   return (
// // //     <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-5rem)] bg-surface rounded-2xl border border-border shadow-md overflow-hidden">
// // //       {/* Header (Fixed) */}
// // //       <div className="flex items-center p-3 border-b border-border flex-shrink-0">
// // //         <button onClick={onBack} className="p-2 mr-2 text-primary">
// // //             <BackIcon />
// // //         </button>
// // //         {tribe.avatarUrl ? (
// // //             <img src={tribe.avatarUrl} alt={tribe.name} className="w-10 h-10 rounded-full mr-3 object-cover"/>
// // //         ) : (
// // //             <TribePlaceholderIcon />
// // //         )}
// // //         <div className="flex-1 min-w-0">
// // //             <h2 className="text-lg font-bold text-primary truncate">{tribe.name}</h2>
// // //             <p className="text-sm text-secondary truncate">{tribe.members.length} members</p>
// // //         </div>
// // //         <div className="ml-auto flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
// // //              {isMember && currentUser.id !== tribe.owner && (
// // //                  <button onClick={() => onJoinToggle(tribe.id)} className="font-semibold text-sm px-3 py-1.5 rounded-lg transition-colors bg-surface text-red-500 border border-border hover:bg-red-500/10">
// // //                     Leave
// // //                  </button>
// // //              )}
// // //             {currentUser.id === tribe.owner && (
// // //                 <button 
// // //                     onClick={() => onEditTribe(tribe)} 
// // //                     className="p-2 text-secondary hover:text-primary rounded-full hover:bg-background"
// // //                     aria-label="Edit Tribe"
// // //                 >
// // //                     <EditIcon />
// // //                 </button>
// // //             )}
// // //         </div>
// // //       </div>

// // //       {/* Messages (Scrollable) */}
// // //       <div className="flex-1 overflow-y-auto p-4 bg-background">
// // //         <div className="flex flex-col space-y-2">
// // //           {tribe.messages.map(message => {
// // //             const isCurrentUser = message.sender.id === currentUser.id;
// // //             return (
// // //               <div key={message.id} className={`flex items-end gap-2.5 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
// // //                  {!isCurrentUser && (
// // //                      <div 
// // //                         className="w-8 h-8 rounded-full cursor-pointer self-start flex-shrink-0"
// // //                         onClick={() => onViewProfile(message.sender)}
// // //                      >
// // //                         <UserAvatar user={message.sender} className="w-full h-full" />
// // //                      </div>
// // //                  )}
// // //                 <div className={`flex flex-col w-full max-w-xs lg:max-w-md ${isCurrentUser ? 'items-end' : 'items-start'}`}>
// // //                     {!isCurrentUser && (
// // //                         <p 
// // //                             className="text-xs text-secondary mb-1 ml-3 cursor-pointer hover:underline"
// // //                             onClick={() => onViewProfile(message.sender)}
// // //                         >
// // //                             {message.sender.name}
// // //                         </p>
// // //                     )}
// // //                     <div className={`px-4 py-2.5 rounded-xl text-sm break-words ${isCurrentUser ? 'bg-accent text-accent-text' : 'bg-surface text-primary shadow-sm'}`}>
// // //                          {message.imageUrl && (
// // //                           <img src={message.imageUrl} alt="Shared content" className="mb-2 rounded-lg w-full" />
// // //                         )}
// // //                         <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
// // //                     </div>
// // //                     <p className="text-xs text-secondary mt-1.5 px-1">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
// // //                 </div>
// // //               </div>
// // //             );
// // //           })}
// // //           {tribe.messages.length === 0 && (
// // //               <div className="text-center text-secondary p-8">
// // //                   <p>Welcome to #{tribe.name}!</p>
// // //                   <p className="text-sm">Be the first one to send a message.</p>
// // //               </div>
// // //           )}
// // //            <div ref={messagesEndRef} />
// // //         </div>
// // //       </div>

// // //       {/* Input (Fixed) */}
// // //       <div className="p-4 border-t border-border bg-surface flex-shrink-0">
// // //         {imagePreview && (
// // //             <div className="mb-3 relative w-32 h-32">
// // //                 <img src={imagePreview} alt="Preview" className="rounded-lg w-full h-full object-cover" />
// // //                 <button onClick={removeImage} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 leading-none hover:bg-black/80 transition-colors" aria-label="Remove image">
// // //                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
// // //                 </button>
// // //             </div>
// // //         )}
// // //         <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
// // //             <button type="button" onClick={() => fileInputRef.current?.click()} className="text-secondary hover:text-accent p-2 rounded-full transition-colors" aria-label="Add image" disabled={!isMember}>
// // //                 <ImageIcon />
// // //             </button>
// // //             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" disabled={!isMember}/>
// // //           <input
// // //             type="text"
// // //             value={inputText}
// // //             onChange={(e) => setInputText(e.target.value)}
// // //             placeholder={isMember ? `Message #${tribe.name}` : "You must be a member to chat"}
// // //             className="flex-1 bg-background border border-border rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent text-primary min-w-0"
// // //             disabled={!isMember}
// // //           />
// // //           <button type="submit" className="bg-accent text-accent-text rounded-full w-11 h-11 flex-shrink-0 flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-50" disabled={(!inputText.trim() && !imagePreview) || !isMember}>
// // //             <SendIcon />
// // //           </button>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
// // // const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;
// // // const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
// // // const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536l12.232-12.232z" /></svg>;

// // // export default TribeDetailPage;






// // import React, { useState, useRef, useEffect } from "react";
// // import { Tribe, User } from "../../types";
// // import UserAvatar from "../common/UserAvatar";
// // import { useSocket } from "../../contexts/SocketContext";

// // interface TribeDetailPageProps {
// //   tribe: Tribe;
// //   currentUser: User;
// //   onSendMessage: (tribeId: string, text: string, imageUrl?: string) => void;
// //   onBack: () => void;
// //   onViewProfile: (user: User) => void;
// //   onEditTribe: (tribe: Tribe) => void;
// //   onJoinToggle: (tribeId: string) => void;
// // }

// // const TribePlaceholderIcon = () => (
// //   <div className="w-10 h-10 rounded-full mr-3 bg-background border border-border flex items-center justify-center text-secondary p-2">
// //     <svg
// //       viewBox="0 0 24 24"
// //       fill="none"
// //       stroke="currentColor"
// //       strokeWidth="1.5"
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //     >
// //       <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
// //       <circle cx="9" cy="7" r="4"></circle>
// //       <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
// //       <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
// //     </svg>
// //   </div>
// // );

// // const TribeDetailPage: React.FC<TribeDetailPageProps> = ({
// //   tribe,
// //   currentUser,
// //   onSendMessage,
// //   onBack,
// //   onViewProfile,
// //   onEditTribe,
// //   onJoinToggle,
// // }) => {
// //   const [inputText, setInputText] = useState("");
// //   const [imagePreview, setImagePreview] = useState<string | null>(null);
// //   const fileInputRef = useRef<HTMLInputElement>(null);
// //   const messagesEndRef = useRef<HTMLDivElement>(null);
// //   const isMember = tribe.members.includes(currentUser.id);
// //   const socket = useSocket();

// //   // Join and leave socket room
// //   useEffect(() => {
// //     if (socket && isMember) {
// //       socket.emit("joinRoom", tribe.id);

// //       return () => {
// //         socket.emit("leaveRoom", tribe.id);
// //       };
// //     }
// //   }, [socket, tribe.id, isMember]);

// //   // Auto-scroll messages
// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [tribe.messages]);

// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setImagePreview(reader.result as string);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const removeImage = () => {
// //     setImagePreview(null);
// //     if (fileInputRef.current) {
// //       fileInputRef.current.value = "";
// //     }
// //   };

// //   const handleSendMessage = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (inputText.trim() || imagePreview) {
// //       onSendMessage(tribe.id, inputText, imagePreview || undefined);
// //       setInputText("");
// //       removeImage();
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-5rem)] bg-surface rounded-2xl border border-border shadow-md overflow-hidden">
// //       {/* Header */}
// //       <div className="flex items-center p-3 border-b border-border flex-shrink-0">
// //         <button onClick={onBack} className="p-2 mr-2 text-primary">
// //           <BackIcon />
// //         </button>
// //         {tribe.avatarUrl ? (
// //           <img
// //             src={tribe.avatarUrl}
// //             alt={tribe.name}
// //             className="w-10 h-10 rounded-full mr-3 object-cover"
// //           />
// //         ) : (
// //           <TribePlaceholderIcon />
// //         )}
// //         <div className="flex-1 min-w-0">
// //           <h2 className="text-lg font-bold text-primary truncate">
// //             {tribe.name}
// //           </h2>
// //           <p className="text-sm text-secondary truncate">
// //             {tribe.members.length} members
// //           </p>
// //         </div>
// //         <div className="ml-auto flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
// //           {isMember && currentUser.id !== tribe.owner && (
// //             <button
// //               onClick={() => onJoinToggle(tribe.id)}
// //               className="font-semibold text-sm px-3 py-1.5 rounded-lg transition-colors bg-surface text-red-500 border border-border hover:bg-red-500/10"
// //             >
// //               Leave
// //             </button>
// //           )}
// //           {currentUser.id === tribe.owner && (
// //             <button
// //               onClick={() => onEditTribe(tribe)}
// //               className="p-2 text-secondary hover:text-primary rounded-full hover:bg-background"
// //               aria-label="Edit Tribe"
// //             >
// //               <EditIcon />
// //             </button>
// //           )}
// //         </div>
// //       </div>

// //       {/* Messages */}
// //       <div className="flex-1 overflow-y-auto p-4 bg-background">
// //         <div className="flex flex-col space-y-2">
// //           {tribe.messages.map((message) => {
// //             const isCurrentUser = message.sender.id === currentUser.id;
// //             return (
// //               <div
// //                 key={message.id}
// //                 className={`flex items-end gap-2.5 ${
// //                   isCurrentUser ? "justify-end" : "justify-start"
// //                 }`}
// //               >
// //                 {!isCurrentUser && (
// //                   <div
// //                     className="w-8 h-8 rounded-full cursor-pointer self-start flex-shrink-0"
// //                     onClick={() => onViewProfile(message.sender)}
// //                   >
// //                     <UserAvatar user={message.sender} className="w-full h-full" />
// //                   </div>
// //                 )}
// //                 <div
// //                   className={`flex flex-col w-full max-w-xs lg:max-w-md ${
// //                     isCurrentUser ? "items-end" : "items-start"
// //                   }`}
// //                 >
// //                   {!isCurrentUser && (
// //                     <p
// //                       className="text-xs text-secondary mb-1 ml-3 cursor-pointer hover:underline"
// //                       onClick={() => onViewProfile(message.sender)}
// //                     >
// //                       {message.sender.name}
// //                     </p>
// //                   )}
// //                   <div
// //                     className={`px-4 py-2.5 rounded-xl text-sm break-words ${
// //                       isCurrentUser
// //                         ? "bg-accent text-accent-text"
// //                         : "bg-surface text-primary shadow-sm"
// //                     }`}
// //                   >
// //                     {message.imageUrl && (
// //                       <img
// //                         src={message.imageUrl}
// //                         alt="Shared content"
// //                         className="mb-2 rounded-lg w-full"
// //                       />
// //                     )}
// //                     <p className="leading-relaxed whitespace-pre-wrap">
// //                       {message.text}
// //                     </p>
// //                   </div>
// //                   <p className="text-xs text-secondary mt-1.5 px-1">
// //                     {new Date(message.timestamp).toLocaleTimeString([], {
// //                       hour: "2-digit",
// //                       minute: "2-digit",
// //                     })}
// //                   </p>
// //                 </div>
// //               </div>
// //             );
// //           })}
// //           {tribe.messages.length === 0 && (
// //             <div className="text-center text-secondary p-8">
// //               <p>Welcome to #{tribe.name}!</p>
// //               <p className="text-sm">Be the first one to send a message.</p>
// //             </div>
// //           )}
// //           <div ref={messagesEndRef} />
// //         </div>
// //       </div>

// //       {/* Input */}
// //       <div className="p-4 border-t border-border bg-surface flex-shrink-0">
// //         {imagePreview && (
// //           <div className="mb-3 relative w-32 h-32">
// //             <img
// //               src={imagePreview}
// //               alt="Preview"
// //               className="rounded-lg w-full h-full object-cover"
// //             />
// //             <button
// //               onClick={removeImage}
// //               className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 leading-none hover:bg-black/80 transition-colors"
// //               aria-label="Remove image"
// //             >
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 className="h-4 w-4"
// //                 fill="none"
// //                 viewBox="0 0 24 24"
// //                 stroke="currentColor"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth={2}
// //                   d="M6 18L18 6M6 6l12 12"
// //                 />
// //               </svg>
// //             </button>
// //           </div>
// //         )}
// //         <form
// //           onSubmit={handleSendMessage}
// //           className="flex items-center space-x-3"
// //         >
// //           <button
// //             type="button"
// //             onClick={() => fileInputRef.current?.click()}
// //             className="text-secondary hover:text-accent p-2 rounded-full transition-colors"
// //             aria-label="Add image"
// //             disabled={!isMember}
// //           >
// //             <ImageIcon />
// //           </button>
// //           <input
// //             type="file"
// //             ref={fileInputRef}
// //             onChange={handleFileChange}
// //             accept="image/*"
// //             className="hidden"
// //             disabled={!isMember}
// //           />
// //           <input
// //             type="text"
// //             value={inputText}
// //             onChange={(e) => setInputText(e.target.value)}
// //             placeholder={
// //               isMember
// //                 ? `Message #${tribe.name}`
// //                 : "You must be a member to chat"
// //             }
// //             className="flex-1 bg-background border border-border rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent text-primary min-w-0"
// //             disabled={!isMember}
// //           />
// //           <button
// //             type="submit"
// //             className="bg-accent text-accent-text rounded-full w-11 h-11 flex-shrink-0 flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-50"
// //             disabled={(!inputText.trim() && !imagePreview) || !isMember}
// //           >
// //             <SendIcon />
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // const ImageIcon = () => (
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     className="h-6 w-6"
// //     fill="none"
// //     viewBox="0 0 24 24"
// //     stroke="currentColor"
// //     strokeWidth={2}
// //   >
// //     <path
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //       d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
// //     />
// //   </svg>
// // );
// // const SendIcon = () => (
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     className="h-6 w-6"
// //     fill="currentColor"
// //     viewBox="0 0 20 20"
// //   >
// //     <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
// //   </svg>
// // );
// // const BackIcon = () => (
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     className="h-6 w-6"
// //     fill="none"
// //     viewBox="0 0 24 24"
// //     stroke="currentColor"
// //   >
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
// //   </svg>
// // );
// // const EditIcon = () => (
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     className="h-5 w-5"
// //     fill="none"
// //     viewBox="0 0 24 24"
// //     stroke="currentColor"
// //   >
// //     <path
// //       strokeLinecap="round"
// //       strokeLinejoin="round"
// //       strokeWidth={2}
// //       d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536l12.232-12.232z"
// //     />
// //   </svg>
// // );

// // export default TribeDetailPage;



// import React, { useState } from 'react';
// import { Tribe, User } from '../../types';
// import TribeCard from './TribeCard';
// import CreateTribeModal from './CreateTribeModal';

// interface TribesPageProps {
//     tribes: Tribe[];
//     currentUser: User;
//     onJoinToggle: (tribeId: string) => void;
//     onCreateTribe: (name: string, description: string, avatarUrl?: string) => void;
//     onViewTribe: (tribe: Tribe) => void;
//     onEditTribe: (tribe: Tribe) => void;
//     onDeleteTribe: (tribeId: string) => void;
// }

// const TribesPage: React.FC<TribesPageProps> = ({ tribes, currentUser, onJoinToggle, onCreateTribe, onViewTribe, onEditTribe, onDeleteTribe }) => {
//     const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    
//     const myTribes = tribes.filter(c => c.members.includes(currentUser.id));
//     const otherTribes = tribes.filter(c => !c.members.includes(currentUser.id));

//     return (
//         <div>
//             <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
//                 <h1 className="text-2xl font-bold text-primary font-display">Tribes</h1>
//                 <button 
//                     onClick={() => setCreateModalOpen(true)}
//                     className="bg-accent text-accent-text font-semibold px-5 py-2 rounded-lg hover:bg-accent-hover transition-colors flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
//                 >
//                     <PlusIcon/>
//                     <span>Create Tribe</span>
//                 </button>
//             </div>

//             {myTribes.length > 0 && (
//                  <div className="mb-8">
//                     <h2 className="text-xl font-bold text-primary mb-4 font-display">Your Tribes</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {myTribes.map(tribe => (
//                             <TribeCard 
//                                 key={tribe.id}
//                                 tribe={tribe}
//                                 currentUser={currentUser}
//                                 isMember={true}
//                                 onJoinToggle={onJoinToggle}
//                                 onViewTribe={onViewTribe}
//                                 onEditTribe={onEditTribe}
//                                 onDeleteTribe={onDeleteTribe}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             )}
           
//             <div>
//                 <h2 className="text-xl font-bold text-primary mb-4 font-display">Discover Tribes</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {otherTribes.map(tribe => (
//                         <TribeCard 
//                             key={tribe.id}
//                             tribe={tribe}
//                             currentUser={currentUser}
//                             isMember={false}
//                             onJoinToggle={onJoinToggle}
//                             onViewTribe={onViewTribe}
//                             onEditTribe={onEditTribe}
//                             onDeleteTribe={onDeleteTribe}
//                         />
//                     ))}
//                 </div>
//                  {tribes.length === 0 && (
//                     <div className="bg-surface p-8 text-center rounded-2xl border border-border col-span-full shadow-md">
//                         <p className="text-secondary">No tribes found. Why not create the first one?</p>
//                     </div>
//                  )}
//             </div>

//             {isCreateModalOpen && (
//                 <CreateTribeModal 
//                     onClose={() => setCreateModalOpen(false)}
//                     onCreate={onCreateTribe}
//                 />
//             )}
//         </div>
//     );
// };

// const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

// export default TribesPage;


import React, { useState, useRef, useEffect, useContext } from 'react';
import { Tribe, User, TribeMessage } from '../../types';
import UserAvatar from '../common/UserAvatar';
import { SocketContext } from '../../contexts/SocketContext';
import * as api from '../../api';

interface TribeDetailPageProps {
  tribe: Tribe;
  setTribes: React.Dispatch<React.SetStateAction<Tribe[]>>;
  currentUser: User;
  onBack: () => void;
  onViewProfile: (user: User) => void;
  onEditTribe: (tribe: Tribe) => void;
  onJoinToggle: (tribeId: string) => void;
}

const TribePlaceholderIcon = () => (
     <div className="w-10 h-10 rounded-full mr-3 bg-background border border-border flex items-center justify-center text-secondary p-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    </div>
);


const TribeDetailPage: React.FC<TribeDetailPageProps> = ({ tribe, setTribes, currentUser, onBack, onViewProfile, onEditTribe, onJoinToggle }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMember = tribe.members.includes(currentUser.id);
  const socket = useContext(SocketContext);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tribe.messages]);

  // Socket setup
  useEffect(() => {
    if (!socket || !tribe) return;

    socket.emit('join-room', tribe.id);

    const handleNewTribeMessage = (newMessage: TribeMessage & { sender: User }) => {
        if (newMessage.tribeId === tribe.id) {
             setTribes(prevTribes => prevTribes.map(t => {
                if (t.id === tribe.id) {
                    return { ...t, messages: [...t.messages, newMessage] };
                }
                return t;
            }));
        }
    };
    
    socket.on('new-tribe-message', handleNewTribeMessage);

    return () => {
        socket.emit('leave-room', tribe.id);
        socket.off('new-tribe-message', handleNewTribeMessage);
    };

  }, [socket, tribe, setTribes]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && socket) {
      try {
        const { data: newMessageData } = await api.sendTribeMessage(tribe.id, { text: inputText });
        const newMessage = { ...newMessageData, sender: currentUser, tribeId: tribe.id };

        socket.emit('send-tribe-message', {
            roomId: tribe.id,
            message: newMessage
        });
        
        setInputText('');
      } catch (error) {
        console.error("Failed to send tribe message:", error);
        alert("Could not send message. Please try again.");
      }
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-5rem)] bg-surface rounded-2xl border border-border shadow-md overflow-hidden">
      {/* Header (Fixed) */}
      <div className="flex items-center p-3 border-b border-border flex-shrink-0">
        <button onClick={onBack} className="p-2 mr-2 text-primary">
            <BackIcon />
        </button>
        {tribe.avatarUrl ? (
            <img src={tribe.avatarUrl} alt={tribe.name} className="w-10 h-10 rounded-full mr-3 object-cover"/>
        ) : (
            <TribePlaceholderIcon />
        )}
        <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-primary truncate">{tribe.name}</h2>
            <p className="text-sm text-secondary truncate">{tribe.members.length} members</p>
        </div>
        <div className="ml-auto flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
             {isMember && currentUser.id !== tribe.owner && (
                 <button onClick={() => onJoinToggle(tribe.id)} className="font-semibold text-sm px-3 py-1.5 rounded-lg transition-colors bg-surface text-red-500 border border-border hover:bg-red-500/10">
                    Leave
                 </button>
             )}
            {currentUser.id === tribe.owner && (
                <button 
                    onClick={() => onEditTribe(tribe)} 
                    className="p-2 text-secondary hover:text-primary rounded-full hover:bg-background"
                    aria-label="Edit Tribe"
                >
                    <EditIcon />
                </button>
            )}
        </div>
      </div>

      {/* Messages (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 bg-background">
        <div className="flex flex-col space-y-2">
          {tribe.messages.map(message => {
            const isCurrentUser = message.sender.id === currentUser.id;
            return (
              <div key={message.id} className={`flex items-end gap-2.5 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                 {!isCurrentUser && (
                     <div 
                        className="w-8 h-8 rounded-full cursor-pointer self-start flex-shrink-0"
                        onClick={() => onViewProfile(message.sender)}
                     >
                        <UserAvatar user={message.sender} className="w-full h-full" />
                     </div>
                 )}
                <div className={`flex flex-col w-full max-w-xs lg:max-w-md ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    {!isCurrentUser && (
                        <p 
                            className="text-xs text-secondary mb-1 ml-3 cursor-pointer hover:underline"
                            onClick={() => onViewProfile(message.sender)}
                        >
                            {message.sender.name}
                        </p>
                    )}
                    <div className={`px-4 py-2.5 rounded-xl text-sm break-words ${isCurrentUser ? 'bg-accent text-accent-text' : 'bg-surface text-primary shadow-sm'}`}>
                         {message.imageUrl && (
                          <img src={message.imageUrl} alt="Shared content" className="mb-2 rounded-lg w-full" />
                        )}
                        <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    </div>
                    <p className="text-xs text-secondary mt-1.5 px-1">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            );
          })}
          {tribe.messages.length === 0 && (
              <div className="text-center text-secondary p-8">
                  <p>Welcome to #{tribe.name}!</p>
                  <p className="text-sm">Be the first one to send a message.</p>
              </div>
          )}
           <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input (Fixed) */}
      <div className="p-4 border-t border-border bg-surface flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isMember ? `Message #${tribe.name}` : "You must be a member to chat"}
            className="flex-1 bg-background border border-border rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent text-primary min-w-0"
            disabled={!isMember}
          />
          <button type="submit" className="bg-accent text-accent-text rounded-full w-11 h-11 flex-shrink-0 flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-50" disabled={!inputText.trim() || !isMember}>
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536l12.232-12.232z" /></svg>;

export default TribeDetailPage;