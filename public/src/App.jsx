import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './index.css';

const SOCKET_URL = 'http://localhost:8000';

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const h = date.getHours() % 12 || 12;
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${mm} ${ampm}`;
}

// ─── Join Screen ───────────────────────────────────────────────────────────────
function JoinScreen({ onJoin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onJoin(name.trim());
  };

  return (
    <div className="app-bg">
      <div className="join-box">
        <div className="join-logo">💬</div>
        <h2>Scalable Chat</h2>
        <p>Enter your name to start chatting</p>
        <form onSubmit={handleSubmit} className="join-form">
          <input
            type="text"
            placeholder="Your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          <button type="submit">Join →</button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Chat App ─────────────────────────────────────────────────────────────
function ChatApp({ username }) {
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState({});   // { socketId: username }
  const [selectedUser, setSelectedUser] = useState(null); // { socketId, username }
  const [conversations, setConversations] = useState({}); // { socketId: [messages] }
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('register', username);
    });

    // Updated online users list from server
    socket.on('users', (users) => {
      // Remove self from the list
      const others = {};
      Object.entries(users).forEach(([sid, uname]) => {
        if (sid !== socket.id) others[sid] = uname;
      });
      setOnlineUsers(others);
    });

    // Incoming private message
    socket.on('private message', (data) => {
      const otherSid = data.from === socket.id ? data.to : data.from;
      setConversations((prev) => ({
        ...prev,
        [otherSid]: [...(prev[otherSid] || []), data],
      }));
    });

    return () => socket.disconnect();
  }, [username]);

  // Load history when selecting a user
  const handleSelectUser = async (sid, uname) => {
    setSelectedUser({ socketId: sid, username: uname });

    // Fetch history from backend
    try {
      const res = await fetch(`http://localhost:8000/messages/${username}/${uname}`);
      const history = await res.json();
      setConversations((prev) => ({
        ...prev,
        [sid]: history.map((m) => ({
          ...m,
          from: m.from === username ? socketRef.current.id : sid,
          to: m.to === username ? socketRef.current.id : sid,
        })),
      }));
    } catch {
      // no history
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedUser]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser) return;
    socketRef.current?.emit('private message', {
      to: selectedUser.socketId,
      message: input.trim(),
    });
    setInput('');
  };

  const currentMessages = selectedUser ? (conversations[selectedUser.socketId] || []) : [];
  const mySocketId = socketRef.current?.id;

  // Count unread (messages in conversations not currently selected)
  const unreadCount = (sid) => {
    if (selectedUser?.socketId === sid) return 0;
    return (conversations[sid] || []).length;
  };

  return (
    <div className="chat-app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="my-avatar">{username[0].toUpperCase()}</div>
          <span className="my-name">{username}</span>
        </div>
        <div className="sidebar-title">Online Users</div>
        {Object.keys(onlineUsers).length === 0 ? (
          <div className="no-users">No one else online yet</div>
        ) : (
          Object.entries(onlineUsers).map(([sid, uname]) => (
            <div
              key={sid}
              className={`user-item ${selectedUser?.socketId === sid ? 'active' : ''}`}
              onClick={() => handleSelectUser(sid, uname)}
            >
              <div className="user-avatar">{uname[0].toUpperCase()}</div>
              <div className="user-info">
                <span className="user-name">{uname}</span>
                <span className="user-status">● online</span>
              </div>
              {unreadCount(sid) > 0 && selectedUser?.socketId !== sid && (
                <span className="unread-badge">{unreadCount(sid)}</span>
              )}
            </div>
          ))
        )}
      </aside>

      {/* Chat Panel */}
      <main className="chat-panel">
        {!selectedUser ? (
          <div className="empty-state">
            <div className="empty-icon">👈</div>
            <p>Select a person from the left to start chatting</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <div className="user-avatar">{selectedUser.username[0].toUpperCase()}</div>
              <div>
                <div className="chat-header-name">{selectedUser.username}</div>
                <div className="chat-header-status">● online</div>
              </div>
            </div>

            <div className="messages-area">
              {currentMessages.length === 0 && (
                <div className="no-messages">No messages yet. Say hi! 👋</div>
              )}
              {currentMessages.map((msg, i) => {
                const isMine = msg.from === mySocketId || msg.fromUsername === username;
                return (
                  <div key={i} className={`msg-row ${isMine ? 'mine' : 'theirs'}`}>
                    <div className="msg-bubble">
                      <p className="msg-text">{msg.message}</p>
                      <span className="msg-time">{formatTime(msg.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form className="input-area" onSubmit={handleSend}>
              <input
                type="text"
                placeholder={`Message ${selectedUser.username}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
              <button type="submit">Send</button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [username, setUsername] = useState(null);
  if (!username) return <JoinScreen onJoin={setUsername} />;
  return <ChatApp username={username} />;
}
