'use client';

import { useState } from 'react';
import { Search, Send, Users, User, MoreVertical, ArrowLeft, Paperclip, Smile, Image as ImageIcon } from 'lucide-react';

interface Message {
  id: number;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

interface Conversation {
  id: number;
  type: 'individual' | 'group';
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  online?: boolean;
  members?: string[];
}

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'individual' | 'groups'>('all');
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations: Conversation[] = [
    {
      id: 1,
      type: 'individual',
      name: 'Sarah Mwangi',
      lastMessage: 'That sounds great! When can we meet?',
      lastMessageTime: '2 min ago',
      unread: 2,
      online: true
    },
    {
      id: 2,
      type: 'group',
      name: 'Reforestation Team',
      lastMessage: 'John: We need 50 more volunteers for Saturday',
      lastMessageTime: '15 min ago',
      unread: 5,
      members: ['12 members']
    },
    {
      id: 3,
      type: 'individual',
      name: 'David Ochieng',
      lastMessage: 'Thanks for your help with the project!',
      lastMessageTime: '1 hour ago',
      unread: 0,
      online: false
    },
    {
      id: 4,
      type: 'group',
      name: 'Clean Water Initiative',
      lastMessage: 'Emma: Meeting scheduled for tomorrow at 10 AM',
      lastMessageTime: '2 hours ago',
      unread: 3,
      members: ['8 members']
    },
    {
      id: 5,
      type: 'individual',
      name: 'Grace Wanjiru',
      lastMessage: 'I\'ll share the documents by evening',
      lastMessageTime: '3 hours ago',
      unread: 0,
      online: true
    },
    {
      id: 6,
      type: 'group',
      name: 'Environmental Education',
      lastMessage: 'You: Great work everyone! 👏',
      lastMessageTime: '5 hours ago',
      unread: 0,
      members: ['15 members']
    },
    {
      id: 7,
      type: 'individual',
      name: 'James Kamau',
      lastMessage: 'See you at the event!',
      lastMessageTime: 'Yesterday',
      unread: 0,
      online: false
    },
    {
      id: 8,
      type: 'group',
      name: 'Fundraising Committee',
      lastMessage: 'Alice: Exceeded our goal by 25%! 🎉',
      lastMessageTime: 'Yesterday',
      unread: 1,
      members: ['6 members']
    }
  ];

  const messageHistory: { [key: number]: Message[] } = {
    1: [
      {
        id: 1,
        senderId: '1',
        senderName: 'Sarah Mwangi',
        text: 'Hi! I saw your post about the tree planting event',
        timestamp: '10:30 AM',
        isMe: false
      },
      {
        id: 2,
        senderId: 'me',
        senderName: 'You',
        text: 'Yes! We\'re organizing it next Saturday. Would you like to join?',
        timestamp: '10:32 AM',
        isMe: true
      },
      {
        id: 3,
        senderId: '1',
        senderName: 'Sarah Mwangi',
        text: 'Absolutely! I have experience with similar projects in Nairobi',
        timestamp: '10:35 AM',
        isMe: false
      },
      {
        id: 4,
        senderId: 'me',
        senderName: 'You',
        text: 'That\'s perfect! We could really use your expertise',
        timestamp: '10:36 AM',
        isMe: true
      },
      {
        id: 5,
        senderId: '1',
        senderName: 'Sarah Mwangi',
        text: 'That sounds great! When can we meet?',
        timestamp: '10:38 AM',
        isMe: false
      }
    ],
    2: [
      {
        id: 1,
        senderId: '5',
        senderName: 'John Kariuki',
        text: 'Good morning team! Hope everyone is ready for Saturday',
        timestamp: '9:00 AM',
        isMe: false
      },
      {
        id: 2,
        senderId: '7',
        senderName: 'Mary Njeri',
        text: 'Yes! I\'ve confirmed 30 volunteers so far',
        timestamp: '9:05 AM',
        isMe: false
      },
      {
        id: 3,
        senderId: 'me',
        senderName: 'You',
        text: 'Great work Mary! I can bring 10 more from my network',
        timestamp: '9:10 AM',
        isMe: true
      },
      {
        id: 4,
        senderId: '5',
        senderName: 'John Kariuki',
        text: 'Excellent! That brings us to 40. We need 50 more volunteers for Saturday',
        timestamp: '9:15 AM',
        isMe: false
      },
      {
        id: 5,
        senderId: '8',
        senderName: 'Peter Maina',
        text: 'I\'ll post on social media to get more people',
        timestamp: '9:20 AM',
        isMe: false
      }
    ],
    4: [
      {
        id: 1,
        senderId: '12',
        senderName: 'Emma Akinyi',
        text: 'Quick update: The water filtration systems have arrived!',
        timestamp: '8:00 AM',
        isMe: false
      },
      {
        id: 2,
        senderId: 'me',
        senderName: 'You',
        text: 'That\'s wonderful news! When can we start installation?',
        timestamp: '8:15 AM',
        isMe: true
      },
      {
        id: 3,
        senderId: '12',
        senderName: 'Emma Akinyi',
        text: 'We\'re planning to start next week. Meeting scheduled for tomorrow at 10 AM',
        timestamp: '8:30 AM',
        isMe: false
      },
      {
        id: 4,
        senderId: '14',
        senderName: 'Robert Otieno',
        text: 'I\'ll arrange transportation for the equipment',
        timestamp: '8:35 AM',
        isMe: false
      }
    ],
    6: [
      {
        id: 1,
        senderId: '20',
        senderName: 'Lucy Wambui',
        text: 'The school presentations went really well today!',
        timestamp: 'Yesterday',
        isMe: false
      },
      {
        id: 2,
        senderId: 'me',
        senderName: 'You',
        text: 'Great work everyone! 👏',
        timestamp: 'Yesterday',
        isMe: true
      },
      {
        id: 3,
        senderId: '22',
        senderName: 'Tom Njuguna',
        text: 'The kids were so engaged. They asked amazing questions!',
        timestamp: 'Yesterday',
        isMe: false
      }
    ]
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'individual' && conv.type === 'individual') ||
                      (activeTab === 'groups' && conv.type === 'group');
    return matchesSearch && matchesTab;
  });

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const messages = selectedConversation ? messageHistory[selectedConversation] || [] : [];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  if (selectedConversation) {
    // Chat View
    return (
      <div className="flex flex-col h-[calc(100vh-7rem)] bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedConversation(null)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-kanyini-primary to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
              {selectedConv?.type === 'group' ? (
                <Users className="w-5 h-5" />
              ) : (
                selectedConv?.name.charAt(0)
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{selectedConv?.name}</h2>
              {selectedConv?.type === 'group' ? (
                <p className="text-xs text-gray-500">{selectedConv.members?.[0]}</p>
              ) : (
                <p className="text-xs text-gray-500">
                  {selectedConv?.online ? (
                    <span className="text-green-600">● Online</span>
                  ) : (
                    'Offline'
                  )}
                </p>
              )}
            </div>
          </div>
          <button className="text-gray-600 hover:text-gray-900">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${message.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!message.isMe && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {message.senderName.charAt(0)}
                  </div>
                )}
                <div className={`flex flex-col ${message.isMe ? 'items-end' : 'items-start'}`}>
                  {!message.isMe && selectedConv?.type === 'group' && (
                    <span className="text-xs text-gray-600 mb-1 px-1">{message.senderName}</span>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.isMe
                        ? 'bg-kanyini-primary text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 px-1">{message.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <button className="text-gray-500 hover:text-gray-700">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
            />
            <button className="text-gray-500 hover:text-gray-700">
              <Smile className="w-5 h-5" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="bg-kanyini-primary text-white p-2 rounded-full hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Conversations List View
  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-600">Connect with your community</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition ${
            activeTab === 'all'
              ? 'bg-kanyini-primary text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All Messages
        </button>
        <button
          onClick={() => setActiveTab('individual')}
          className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition ${
            activeTab === 'individual'
              ? 'bg-kanyini-primary text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <User className="w-4 h-4 inline-block mr-1" />
          Individual
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition ${
            activeTab === 'groups'
              ? 'bg-kanyini-primary text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4 inline-block mr-1" />
          Groups
        </button>
      </div>

      {/* Conversations List */}
      <div className="space-y-2">
        {filteredConversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-kanyini-primary to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {conv.type === 'group' ? (
                      <Users className="w-6 h-6" />
                    ) : (
                      conv.name.charAt(0)
                    )}
                  </div>
                  {conv.online && conv.type === 'individual' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conv.lastMessageTime}</span>
                  </div>
                  {conv.type === 'group' && conv.members && (
                    <p className="text-xs text-gray-500 mb-1">{conv.members[0]}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="ml-2 bg-kanyini-primary text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-kanyini-primary to-green-700 rounded-lg p-4 text-white text-center">
        <p className="text-sm">
          💬 Stay connected with fellow volunteers and project teams
        </p>
      </div>
    </div>
  );
}

