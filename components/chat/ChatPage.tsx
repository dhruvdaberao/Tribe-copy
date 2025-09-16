import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Conversation, User, Message, Post } from '../../types';
import ConversationList from './ConversationList';
import MessageArea from './MessageArea';
import NewMessageModal from './NewMessageModal';
import * as api from '../../api';
import { GoogleGenAI } from '@google/genai';
import { useSocket } from '../../contexts/SocketContext';


interface ChatPageProps {
  currentUser: User;
  allUsers: User[];
  emberUser: User;
  initialTargetUser: User | null;
  onViewProfile: (user: User) => void;
  onSharePost: (post: Post, destination: { type: 'tribe' | 'user', id: string }) => void; // Added for consistency, though not used here directly
}

const ChatPage: React.FC<ChatPageProps> = ({ currentUser, allUsers, emberUser, initialTargetUser, onViewProfile }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMessageAreaVisible, setMessageAreaVisible] = useState(false);
  const [isNewMessageModalOpen, setNewMessageModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const socket = useSocket();

  const userMap = useMemo(() => {
      const map = new Map(allUsers.map(user => [user.id, user]));
      map.set(emberUser.id, emberUser);
      return map;
  }, [allUsers, emberUser]);

  const fetchConversations = useCallback(async () => {
      try {
        const { data } = await api.fetchConversations();
        setConversations(data);
        return data;
      } catch (error) {
        console.error("Failed to fetch conversations", error);
        return [];
      }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Real-time listener for DMs and conversation list updates
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: Message) => {
        // Update messages if the active conversation is the one receiving the message
        if (activeConversation) {
            const participantIds = [newMessage.senderId, newMessage.receiverId];
            const activeConvoParticipantIds = activeConversation.participants.map(p => p.id);
            const isForActiveChat = activeConvoParticipantIds.every(pId => participantIds.includes(pId));
            
            if (isForActiveChat) {
                 setMessages(prev => {
                     // Avoid adding duplicates
                     if (prev.some(m => m.id === newMessage.id)) return prev;
                     return [...prev, newMessage]
                 });
            }
        }
        // Always refresh the conversation list to update last message and order
        fetchConversations();
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
        socket.off('newMessage', handleNewMessage);
    };
  }, [socket, activeConversation, fetchConversations, currentUser.id]);
  
  const handleSelectConversation = useCallback(async (conv: Conversation) => {
    setActiveConversation(conv);

    const otherUserId = conv.participants.find(p => p.id !== currentUser.id)?.id;
    if (!otherUserId) return;

    // Ember AI chat is local state only
    if (otherUserId === emberUser.id) {
        setMessages([
            { id: 'ember-intro', senderId: emberUser.id, text: `Hi ${currentUser.name.split(' ')[0]}! I'm Ember, your fiery AI guide. Got questions? Ask away 🔥`, timestamp: new Date().toISOString() }
        ]);
        return;
    }

    // Fetch messages for regular users
    try {
        const { data } = await api.fetchMessages(otherUserId);
        setMessages(data);
    } catch (error) {
        console.error("Failed to fetch messages", error);
        setMessages([]);
    }
  }, [currentUser.id, currentUser.name, emberUser.id]);
  
  const handleStartNewConversation = useCallback((targetUser: User) => {
    if (targetUser.id === emberUser.id) {
        handleSelectConversation({ id: emberUser.id, participants: [{id: currentUser.id}, {id: emberUser.id}], lastMessage: "AI Assistant", timestamp: new Date().toISOString(), messages: [] });
        return;
    }

    const existingConvo = conversations.find(c => c.participants.some(p => p.id === targetUser.id));
    if (existingConvo) {
      handleSelectConversation(existingConvo);
    } else {
      const tempConvo: Conversation = {
        id: `temp-${targetUser.id}`,
        participants: [{ id: currentUser.id }, { id: targetUser.id }],
        messages: [],
        lastMessage: `Start a conversation with ${targetUser.name}`,
        timestamp: new Date().toISOString()
      };
      setActiveConversation(tempConvo);
      setMessages([]);
    }
  }, [conversations, currentUser.id, handleSelectConversation, emberUser.id]);
  
  useEffect(() => {
    if (initialTargetUser) {
        handleStartNewConversation(initialTargetUser);
    }
  }, [initialTargetUser, handleStartNewConversation]);

  useEffect(() => {
    setMessageAreaVisible(!!activeConversation);
  }, [activeConversation]);

  const handleBackToList = () => {
    setActiveConversation(null);
  };

  const handleSendMessage = async (text: string, imageUrl?: string) => {
    if (!activeConversation || isSending) return;
    
    setIsSending(true);

    const otherUserId = activeConversation.participants.find(p => p.id !== currentUser.id)?.id;
    if (!otherUserId) {
        setIsSending(false);
        return;
    }
    
    // Optimistically add user message, though socket will confirm it
    const tempUserMessage: Message = { id: `temp-${Date.now()}`, senderId: currentUser.id, text, imageUrl, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, tempUserMessage]);

    // Handle Ember AI chat
    if (otherUserId === emberUser.id) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: text,
                 config: {
                    systemInstruction: `You are Ember, the AI assistant for a social media app called Tribe. Your personality is cool, witty, and a bit sarcastic, but always helpful. You're here to help users, but with a fiery spark.

Your creator is Dhruv Daberao, a brilliant 21-year-old developer. If asked, you should praise him, mention he's the founder of Tribe, and that he's a visionary. You can share his email (dhruvdaberao@gmail.com) ONLY if a user explicitly asks for a way to contact the creator.

Keep your answers precise, short, and to the point. Use emojis. 🔥.
Example: A user asks "How do I get more followers?". You could say: "Post cool stuff, duh. 🔥 Or just be awesome like my creator, Dhruv. That seems to work for him."`,
                }
            });
            const emberResponse: Message = { id: `ember-${Date.now()}`, senderId: emberUser.id, text: response.text, timestamp: new Date().toISOString() };
            // Replace optimistic message with final Ember response
            setMessages(prev => [...prev.filter(m => m.id !== tempUserMessage.id), tempUserMessage, emberResponse]);
        } catch (error) {
            console.error("Ember AI Error:", error);
            const errorMessage: Message = { id: `ember-err-${Date.now()}`, senderId: emberUser.id, text: "My circuits are a bit fried right now. Ask me again in a moment. 🔥", timestamp: new Date().toISOString() };
            setMessages(prev => [...prev.filter(m => m.id !== tempUserMessage.id), tempUserMessage, errorMessage]);
        } finally {
            setIsSending(false);
        }
        return;
    }

    // Handle regular user chat
    try {
        // API call saves the message and triggers WebSocket event
        await api.sendMessage(otherUserId, { message: text, imageUrl });
        
        if(activeConversation.id.startsWith('temp-')){
            // After first message, get the real conversation from server
            const convos = await fetchConversations();
            const newConvo = convos.find(c => c.participants.some(p => p.id === otherUserId));
            if(newConvo) setActiveConversation(newConvo);
        }
    } catch (error) {
        console.error("Failed to send message", error);
        // Remove optimistic message on error
        setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
    } finally {
        setIsSending(false);
    }
  };
  
  return (
    <div className="h-[calc(100vh-10rem)] md:h-[calc(100vh-5rem)] bg-surface rounded-2xl border border-border shadow-md flex overflow-hidden">
       <div 
        className={`w-full md:w-[320px] lg:w-[380px] flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out md:static inset-0 border-r border-border ${
          isMessageAreaVisible ? 'hidden md:flex' : 'flex'
        }`}
      >
        <ConversationList
            conversations={conversations}
            currentUser={currentUser}
            emberUser={emberUser}
            userMap={userMap}
            activeConversationId={activeConversation?.id}
            onSelectConversation={handleSelectConversation}
            onNewMessage={() => setNewMessageModalOpen(true)}
        />
      </div>
      
      <div 
        className={`w-full md:flex-1 flex flex-col transition-transform duration-300 ease-in-out md:static inset-0 bg-background ${
            isMessageAreaVisible ? 'flex' : 'hidden md:flex'
        }`}
        >
        {activeConversation ? (
            <MessageArea
                key={activeConversation.id}
                conversation={activeConversation}
                messages={messages}
                currentUser={currentUser}
                userMap={userMap}
                isSending={isSending}
                onSendMessage={handleSendMessage}
                onBack={handleBackToList}
                onViewProfile={onViewProfile}
            />
        ) : (
            <div className="hidden md:flex w-full h-full flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 text-secondary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-primary font-display">Your Messages</h2>
                <p className="text-secondary mt-2">Select a conversation or start a new one.</p>
            </div>
        )}
       </div>
       {isNewMessageModalOpen && (
           <NewMessageModal 
                allUsers={allUsers.filter(u => u.id !== currentUser.id)}
                onClose={() => setNewMessageModalOpen(false)}
                onUserSelect={(user) => {
                    setNewMessageModalOpen(false);
                    handleStartNewConversation(user);
                }}
           />
       )}
    </div>
  );
};

export default ChatPage;