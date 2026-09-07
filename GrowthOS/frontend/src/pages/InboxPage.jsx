import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/inbox';

// COLOR PALETTE
const colors = {
  skyBlue: '#A1EAFB',
  white: '#FDFDFD',
  pink: '#FFCEF3',
  lavender: '#CABBE9'
};

const CHANNELS = ['all', 'facebook', 'instagram', 'email', 'sms', 'livechat'];

function InboxPage() {
  const [conversations, setConversations] = useState([]);
  const [activeChannel, setActiveChannel] = useState('all');
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newConvo, setNewConvo] = useState({ contactName: '', channel: 'facebook', firstMessage: '' });

  const fetchConversations = async (channel = activeChannel) => {
    try {
      const url = channel === 'all' ? API_URL : `${API_URL}?channel=${channel}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setConversations(data);

        // Safely refresh selected conversation state if one is active
        if (selectedConvo?._id) {
          const updated = data.find((c) => String(c._id) === String(selectedConvo._id));
          if (updated) setSelectedConvo(updated);
        }
      } else {
        setConversations([]);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setConversations([]);
    }
  };

  useEffect(() => {
    fetchConversations(activeChannel);
  }, [activeChannel]);

  const createConversation = async (e) => {
    e.preventDefault();
    if (!newConvo.contactName.trim() || !newConvo.firstMessage.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConvo)
      });
      const created = await res.json();

      setNewConvo({ contactName: '', channel: 'facebook', firstMessage: '' });
      setShowNewForm(false);
      
      // Refresh list and auto-select the newly created conversation
      await fetchConversations();
      if (created && created._id) {
        setSelectedConvo(created);
      }
    } catch (err) {
      console.error('Error creating conversation:', err);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedConvo?._id) return;
    try {
      await fetch(`${API_URL}/${selectedConvo._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText })
      });
      setReplyText('');
      await fetchConversations();
    } catch (err) {
      console.error('Error sending reply:', err);
    }
  };

  const addNote = async () => {
    if (!noteText.trim() || !selectedConvo?._id) return;
    try {
      await fetch(`${API_URL}/${selectedConvo._id}/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: noteText })
      });
      setNoteText('');
      await fetchConversations();
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const assignTo = async (name) => {
    if (!selectedConvo?._id) return;
    try {
      await fetch(`${API_URL}/${selectedConvo._id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: name })
      });
      setSelectedConvo({ ...selectedConvo, assignedTo: name });
      await fetchConversations();
    } catch (err) {
      console.error('Error assigning user:', err);
    }
  };

  const quickReplies = [
    "Thanks for reaching out! We'll get back to you shortly.",
    "Yes, this is still available!",
    "Could you share more details about what you need?"
  ];

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: `radial-gradient(circle at 20% 20%, ${colors.skyBlue} 0%, ${colors.white} 50%, ${colors.lavender} 100%)`,
      padding: '40px 20px',
      boxSizing: 'border-box',
      display: 'flex',
      gap: '20px',
      fontFamily: 'sans-serif',
      color: '#333'
    }}>

      {/* LEFT: Conversation list */}
      <div style={{
        width: '320px',
        flexShrink: 0,
        backgroundColor: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.7)',
        padding: '16px',
        height: 'fit-content'
      }}>
        <h3 style={{ marginTop: 0 }}>Inbox</h3>

        {/* Channel filter tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {CHANNELS.map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeChannel === ch ? colors.pink : 'rgba(255,255,255,0.6)',
                fontWeight: activeChannel === ch ? 'bold' : 'normal'
              }}
            >
              {ch}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowNewForm(!showNewForm)}
          style={{
            width: '100%', padding: '8px', marginBottom: '10px',
            backgroundColor: colors.skyBlue, border: 'none', borderRadius: '8px',
            fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          {showNewForm ? 'Cancel' : '+ Simulate New Message'}
        </button>

        {showNewForm && (
          <form onSubmit={createConversation} style={{ marginBottom: '14px' }}>
            <input
              placeholder="Contact name"
              value={newConvo.contactName}
              onChange={(e) => setNewConvo({ ...newConvo, contactName: e.target.value })}
              style={{ display: 'block', width: '100%', marginBottom: '6px', padding: '6px', boxSizing: 'border-box' }}
            />
            <select
              value={newConvo.channel}
              onChange={(e) => setNewConvo({ ...newConvo, channel: e.target.value })}
              style={{ display: 'block', width: '100%', marginBottom: '6px', padding: '6px' }}
            >
              {CHANNELS.filter((c) => c !== 'all').map((ch) => (
                <option key={ch} value={ch}>{ch}</option>
              ))}
            </select>
            <input
              placeholder="Message text"
              value={newConvo.firstMessage}
              onChange={(e) => setNewConvo({ ...newConvo, firstMessage: e.target.value })}
              style={{ display: 'block', width: '100%', marginBottom: '6px', padding: '6px', boxSizing: 'border-box' }}
            />
            <button type="submit" style={{ padding: '6px 12px', cursor: 'pointer' }}>Add</button>
          </form>
        )}

        {Array.isArray(conversations) && conversations.map((convo) => (
          <div
            key={convo._id}
            onClick={() => setSelectedConvo(convo)}
            style={{
              padding: '10px',
              marginBottom: '8px',
              borderRadius: '10px',
              cursor: 'pointer',
              backgroundColor: String(selectedConvo?._id) === String(convo._id) ? colors.lavender : 'rgba(255,255,255,0.5)',
              border: convo.status === 'unread' ? `2px solid ${colors.pink}` : '1px solid transparent'
            }}
          >
            <strong>{convo.contactName}</strong>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.6 }}>{convo.channel}</div>
            <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '4px' }}>
              {convo.messages && convo.messages.length > 0
                ? convo.messages[convo.messages.length - 1]?.text?.slice(0, 40)
                : 'No messages'}...
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Conversation detail */}
      <div style={{
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.7)',
        padding: '20px'
      }}>
        {!selectedConvo ? (
          <p style={{ opacity: 0.6 }}>Select a conversation to view it.</p>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0 }}>{selectedConvo.contactName} ({selectedConvo.channel})</h3>
              <select
                value={selectedConvo.assignedTo || ''}
                onChange={(e) => assignTo(e.target.value)}
                style={{ padding: '6px', borderRadius: '6px' }}
              >
                <option value="">Unassigned</option>
                <option value="Alice">Alice</option>
                <option value="Bob">Bob</option>
                <option value="Carol">Carol</option>
              </select>
            </div>

            {/* Message thread */}
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '14px' }}>
              {selectedConvo.messages?.map((msg, i) => (
                <div key={i} style={{
                  textAlign: msg.sender === 'team' ? 'right' : 'left',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    backgroundColor: msg.sender === 'team' ? colors.skyBlue : colors.pink,
                    maxWidth: '70%'
                  }}>
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick reply templates */}
            <div style={{ marginBottom: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => setReplyText(qr)}
                  style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '10px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: 'white' }}
                >
                  {qr.slice(0, 20)}...
                </button>
              ))}
            </div>

            {/* Reply box */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type a reply..."
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
              <button onClick={sendReply} style={{ padding: '10px 20px', backgroundColor: colors.skyBlue, border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Send
              </button>
            </div>

            {/* Internal notes */}
            <h4 style={{ marginBottom: '8px' }}>Internal Notes (team only)</h4>
            {selectedConvo.notes?.map((note, i) => (
              <div key={i} style={{ fontSize: '13px', padding: '6px 10px', backgroundColor: 'rgba(255,206,243,0.3)', borderRadius: '6px', marginBottom: '6px' }}>
                {note.text}
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add internal note..."
                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
              <button onClick={addNote} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: colors.lavender, cursor: 'pointer' }}>
                Add
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default InboxPage;