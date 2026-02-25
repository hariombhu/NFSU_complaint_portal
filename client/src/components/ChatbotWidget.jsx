import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, RotateCcw } from 'lucide-react';

// ─── Local FAQ Knowledge Base (works WITHOUT any API key) ──────────────────
const FAQ = [
    // ── How to submit ──────────────────────────────────────────────────────
    {
        patterns: ['how to submit', 'submit complaint', 'file complaint', 'raise complaint', 'new complaint', 'create complaint'],
        answer: `📝 **To submit a complaint:**\n1. Log in as a student\n2. Click **"Submit Complaint"** on your dashboard\n3. Choose a category (Canteen, Academic, Maintenance, etc.)\n4. Fill in the title, description & priority\n5. Attach files if needed, then hit **Submit**\n\nYou'll get a unique Complaint ID to track it! ✅`,
    },
    // ── Track complaint ─────────────────────────────────────────────────────
    {
        patterns: ['track', 'status', 'check complaint', 'where is my complaint', 'complaint status', 'follow up'],
        answer: `🔍 **To track your complaint:**\n1. Go to **"Track Complaints"** from your dashboard\n2. Search by complaint title or ID\n3. Filter by status: Pending / In Progress / Resolved\n\nStatuses explained:\n• 🟡 **Pending** – Received, not yet actioned\n• 🔵 **In Progress** – Department is working on it\n• 🟢 **Resolved** – Issue fixed!\n• 🔴 **Escalated** – Sent to higher authority`,
    },
    // ── Login issues ────────────────────────────────────────────────────────
    {
        patterns: ['login', 'can\'t log in', 'forgot password', 'password reset', 'sign in', 'unable to login', 'login error'],
        answer: `🔐 **Login Help:**\n• Use your **@nfsu.ac.in** email address\n• Passwords are case-sensitive\n• Students: use your registered student email\n• Department staff: use your department email (e.g. canteen@nfsu.ac.in)\n\n**Test credentials:**\n• Student → rahul.sharma@nfsu.ac.in / student123\n• Admin → admin@nfsu.ac.in / admin123\n\nForgot password? Contact the IT helpdesk. 📧`,
    },
    // ── Register ────────────────────────────────────────────────────────────
    {
        patterns: ['register', 'sign up', 'create account', 'new account', 'registration'],
        answer: `📋 **To register a student account:**\n1. Click **"Register"** on the login page\n2. Enter your full name, NFSU email (must end in @nfsu.ac.in)\n3. Enter your **Student ID** (e.g. NFSU2024001)\n4. Create a password (min 6 characters)\n\nDepartment & admin accounts are created by the super-admin. 🏛️`,
    },
    // ── Categories ──────────────────────────────────────────────────────────
    {
        patterns: ['categor', 'department', 'type of complaint', 'canteen', 'academic', 'maintenance', 'auditorium', 'sports', 'administration'],
        answer: `📂 **Complaint Categories available:**\n\n🍽️ **Canteen** – Food quality, hygiene, pricing\n📚 **Academic** – Exams, timetables, curriculum issues\n🔧 **Maintenance** – Repairs, electricity, plumbing\n🎭 **Auditorium** – Facilities, booking, equipment\n🏛️ **Administration** – Fees, documents, general admin\n⚽ **Sports** – Equipment, grounds, scheduling\n📋 **Others** – Anything that doesn't fit above`,
    },
    // ── Priority ────────────────────────────────────────────────────────────
    {
        patterns: ['priority', 'urgent', 'high priority', 'low priority', 'critical'],
        answer: `⚡ **Priority Levels:**\n\n🔴 **High** – Urgent issues affecting studies/safety (e.g. broken lab equipment, health hazard)\n🟡 **Medium** – Moderate issues needing timely action (e.g. slow WiFi, billing error)\n🟢 **Low** – Minor inconveniences (e.g. broken chair, typo in notice)\n\nHigher priority complaints are escalated faster! ⏱️`,
    },
    // ── Escalation ──────────────────────────────────────────────────────────
    {
        patterns: ['escalat', 'not resolved', 'no response', 'delayed', 'too long', 'pending for long', 'auto escalate'],
        answer: `🚨 **Complaint Escalation:**\n\nComplaints that remain **Pending or In-Progress** beyond the deadline are **automatically escalated** to a higher authority by the system each night.\n\nYou can check the escalated status on the Track Complaints page. If still unresolved, contact the Administration department directly. 📩`,
    },
    // ── Anonymous complaints ────────────────────────────────────────────────
    {
        patterns: ['anonymous', 'hide identity', 'secret', 'without name', 'confidential'],
        answer: `🕵️ **Anonymous Complaints:**\nYes! You can submit complaints **anonymously**. Your name will be hidden from the department handling the complaint.\n\nHowever, you still need to be logged in to submit — this ensures one complaint per issue and prevents misuse. Your identity is only visible to the super-admin. 🔒`,
    },
    // ── Attachment / files ──────────────────────────────────────────────────
    {
        patterns: ['attach', 'upload', 'file', 'photo', 'image', 'document', 'pdf', 'evidence'],
        answer: `📎 **Attachments:**\nYou can upload supporting files (images, PDFs, docs) when submitting a complaint.\n\n• Supported: JPG, PNG, PDF, DOC, DOCX\n• Max size: typically 5MB per file\n• These help the department resolve your issue faster! 📸`,
    },
    // ── Department dashboard ────────────────────────────────────────────────
    {
        patterns: ['department dashboard', 'department login', 'manage complaints', 'resolve complaint', 'mark resolved', 'on hold', 'department admin'],
        answer: `🏢 **Department Dashboard:**\nDepartment staff can:\n• View all complaints assigned to their dept\n• Update status → **In Progress / Resolved / On Hold**\n• View attachments & full complaint details\n• Add resolution notes\n\n**Department logins:**\n• canteen@nfsu.ac.in / canteen123\n• academic@nfsu.ac.in / academic123\n• maintenance@nfsu.ac.in / maintenance123\n• sports@nfsu.ac.in / sports123`,
    },
    // ── Admin panel ─────────────────────────────────────────────────────────
    {
        patterns: ['admin', 'super admin', 'admin dashboard', 'admin login', 'analytics', 'all complaints'],
        answer: `👨‍💼 **Admin Panel:**\nThe super-admin can:\n• View **all** complaints across all departments\n• Manage users (create/edit/delete accounts)\n• Access analytics (resolution rates, trends)\n• Manually escalate or reassign complaints\n\n**Admin login:**\n• Email: admin@nfsu.ac.in\n• Password: admin123`,
    },
    // ── Contact / support ───────────────────────────────────────────────────
    {
        patterns: ['contact', 'support', 'helpdesk', 'help desk', 'it support', 'phone', 'email support', 'reach out'],
        answer: `📞 **Contact & Support:**\n• **IT Helpdesk** – For portal technical issues\n• **Administration dept** – For general queries\n• Email your department directly using their @nfsu.ac.in address\n\nFor urgent matters, visit the Administration office on campus. 🏛️`,
    },
    // ── Time to resolve ─────────────────────────────────────────────────────
    {
        patterns: ['how long', 'time to resolve', 'resolution time', 'when will', 'how many days'],
        answer: `⏳ **Resolution Timeline:**\n• 🟢 Low priority – within **7 days**\n• 🟡 Medium priority – within **3 days**\n• 🔴 High priority – within **24 hours**\n\nComplaints not resolved in time are **auto-escalated** to senior administration. You can track progress anytime from the dashboard. 📊`,
    },
    // ── Student credentials ─────────────────────────────────────────────────
    {
        patterns: ['student login', 'student credential', 'test student', 'sample student', 'demo student'],
        answer: `🎓 **Sample Student Credentials (for testing):**\n\n• rahul.sharma@nfsu.ac.in / student123 (ID: NFSU2024001)\n• priya.patel@nfsu.ac.in / student123 (ID: NFSU2024002)\n• amit.kumar@nfsu.ac.in / student123 (ID: NFSU2024003)\n\nUse "Register" to create your own real account! 📝`,
    },
    // ── Greetings ───────────────────────────────────────────────────────────
    {
        patterns: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'hii', 'helo', 'namaste'],
        answer: `👋 Hello! I'm your NFSU Portal Assistant.\n\nI can help you with:\n• Submitting & tracking complaints\n• Login and registration\n• Understanding complaint categories & priorities\n• Department and admin info\n\nWhat would you like to know? 😊`,
    },
    // ── Thank you ───────────────────────────────────────────────────────────
    {
        patterns: ['thank', 'thanks', 'ok thanks', 'great', 'awesome', 'perfect', 'helpful'],
        answer: `😊 You're welcome! Feel free to ask if you have more questions. Good luck with your complaint! 🙏\n\n_I'm always here if you need help._`,
    },
];

// ─── Local FAQ matcher (no API needed) ─────────────────────────────────────
function matchLocalFAQ(query) {
    const q = query.toLowerCase().trim();
    for (const entry of FAQ) {
        if (entry.patterns.some(p => q.includes(p))) {
            return entry.answer;
        }
    }
    return null;
}

// ─── Gemini API helper ─────────────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_CONTEXT = `You are a helpful assistant for the NFSU (National Forensic Sciences University) Grievance & Complaint Portal.
You help students, department staff, and admins use the portal.
Key facts:
- Students submit complaints in: Canteen, Academic, Maintenance, Auditorium, Administration, Sports, Others
- Statuses: Pending → In Progress → Resolved (or Escalated / On Hold)
- Department admins manage their department's complaints
- Admin has full access: complaints, users, analytics
- Auto-escalation runs daily for overdue complaints
- Priority: Low (7 days), Medium (3 days), High (24 hrs)
Answer helpfully and concisely in 2-4 sentences. Use emojis occasionally.`;

async function askGemini(history, userMessage) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
        return `🤔 I don't have a specific answer for that.\n\nTry asking about:\n• How to submit a complaint\n• Tracking complaint status\n• Login help\n• Complaint categories\n• Priority levels\n• Contact support\n\n_(Add a Gemini API key to \`client/.env\` for AI-powered answers)_`;
    }

    const contents = [
        { role: 'user', parts: [{ text: SYSTEM_CONTEXT }] },
        { role: 'model', parts: [{ text: 'Understood! Ready to help NFSU portal users. 😊' }] },
        ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: userMessage }] },
    ];

    const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
}

// ─── Quick suggestion chips ─────────────────────────────────────────────────
const QUICK_CHIPS = [
    { label: '📝 Submit complaint', q: 'How to submit a complaint?' },
    { label: '🔍 Track complaint', q: 'How do I track my complaint?' },
    { label: '🔐 Login help', q: 'I need login help' },
    { label: '📂 Categories', q: 'What are the complaint categories?' },
    { label: '⚡ Priority levels', q: 'Explain priority levels' },
    { label: '🚨 Escalation', q: 'What is complaint escalation?' },
    { label: '👨‍💼 Admin access', q: 'How to access the admin panel?' },
    { label: '📞 Contact support', q: 'How do I contact support?' },
];

// ─── Typing dots ────────────────────────────────────────────────────────────
const TypingDots = () => (
    <div className="flex items-center space-x-1 px-4 py-3">
        {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-2 h-2 rounded-full bg-blue-400"
                animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }} />
        ))}
    </div>
);

// ─── FAB button ─────────────────────────────────────────────────────────────
const ChatbotFAB = ({ onClick, hasUnread }) => (
    <motion.button onClick={onClick}
        className="relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center overflow-hidden focus:outline-none"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        aria-label="Open chatbot"
    >
        <motion.div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(99,102,241,0.6)' }}
            animate={{ scale: [1, 1.5, 1.5], opacity: [0.8, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }} />
        <motion.div className="absolute inset-0 rounded-full" style={{ border: '2px solid rgba(59,130,246,0.5)' }}
            animate={{ scale: [1, 1.7, 1.7], opacity: [0.6, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }} />
        <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
            <Bot className="w-8 h-8 text-white" />
        </motion.div>
        {hasUnread && (
            <motion.span className="absolute top-1 right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-white"
                initial={{ scale: 0 }} animate={{ scale: 1 }} />
        )}
    </motion.button>
);

// ─── Message bubble ─────────────────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
    const isUser = msg.role === 'user';
    // Convert **bold** markdown to styled spans
    const formatText = (text) => {
        const lines = text.split('\n');
        return lines.map((line, i) => {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return (
                <span key={i}>
                    {parts.map((part, j) => j % 2 === 1
                        ? <strong key={j} className="font-bold text-white">{part}</strong>
                        : <span key={j}>{part}</span>
                    )}
                    {i < lines.length - 1 && <br />}
                </span>
            );
        });
    };

    return (
        <motion.div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {!isUser && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
            )}
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isUser ? 'text-white rounded-br-sm' : 'text-white/90 rounded-bl-sm border border-white/10'}`}
                style={isUser
                    ? { background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }
                    : { background: 'rgba(255,255,255,0.06)' }
                }>
                {formatText(msg.text)}
            </div>
        </motion.div>
    );
};

// ─── Main Widget ────────────────────────────────────────────────────────────
const ChatbotWidget = () => {
    const [open, setOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);
    const [messages, setMessages] = useState([{
        role: 'bot',
        text: '👋 Hi! I\'m your **NFSU Portal Assistant**.\nI can answer your questions instantly — no API key needed!\n\nWhat can I help you with?'
    }]);
    const [input, setInput] = useState('');
    const [thinking, setThinking] = useState(false);
    const [showChips, setShowChips] = useState(true);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, thinking]);
    useEffect(() => {
        if (open) { setHasUnread(false); setTimeout(() => inputRef.current?.focus(), 300); }
    }, [open]);

    const sendMessage = async (text = input.trim()) => {
        if (!text || thinking) return;
        setShowChips(false);
        setMessages(prev => [...prev, { role: 'user', text }]);
        setInput('');
        setThinking(true);

        // Simulate tiny delay for feel
        await new Promise(r => setTimeout(r, 350));

        // 1️⃣ Try local FAQ first (no API needed)
        const localAnswer = matchLocalFAQ(text);
        if (localAnswer) {
            setMessages(prev => [...prev, { role: 'bot', text: localAnswer }]);
            setThinking(false);
            return;
        }

        // 2️⃣ Fall back to Gemini AI
        try {
            const history = messages.slice(1); // skip greeting
            const reply = await askGemini(history, text);
            setMessages(prev => [...prev, { role: 'bot', text: reply }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'bot',
                text: `🤔 I couldn't find an answer for that.\n\nTry asking:\n• "How to submit a complaint"\n• "Track my complaint status"\n• "Login help"\n• "What are complaint categories"\n• "Priority levels explained"`
            }]);
        } finally {
            setThinking(false);
        }
    };

    const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
    const clearChat = () => { setMessages([{ role: 'bot', text: '👋 Chat cleared! What can I help you with?' }]); setShowChips(true); };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            {/* Chat window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="mb-4 w-[370px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-2xl border border-white/15 flex flex-col"
                        style={{ height: 520, background: 'rgba(8,12,35,0.96)', backdropFilter: 'blur(24px)' }}
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.22), rgba(99,102,241,0.18))' }}>
                            <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                                        <Bot className="w-5 h-5 text-white" />
                                    </motion.div>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm leading-tight">NFSU Assistant</p>
                                    <div className="flex items-center space-x-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-green-400 text-xs">Always available</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1">
                                <motion.button onClick={clearChat} title="Clear chat"
                                    className="p-1.5 text-white/40 hover:text-white/80 hover:bg-white/10 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <RotateCcw className="w-4 h-4" />
                                </motion.button>
                                <motion.button onClick={() => setOpen(false)}
                                    className="p-1.5 text-white/40 hover:text-white/80 hover:bg-white/10 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <X className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

                            {/* Typing indicator */}
                            {thinking && (
                                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0"
                                        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                                        <Sparkles className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="bg-white/6 border border-white/10 rounded-2xl rounded-bl-sm">
                                        <TypingDots />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Quick chips — shown at start and after clear */}
                        <AnimatePresence>
                            {showChips && (
                                <motion.div className="px-4 pb-3 flex flex-wrap gap-1.5"
                                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                    {QUICK_CHIPS.map(chip => (
                                        <button key={chip.label}
                                            onClick={() => sendMessage(chip.q)}
                                            className="text-xs px-2.5 py-1.5 bg-blue-500/15 text-blue-300 border border-blue-500/25 rounded-full hover:bg-blue-500/28 transition-colors whitespace-nowrap">
                                            {chip.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input */}
                        <div className="flex items-end gap-2 px-4 py-3 border-t border-white/10 flex-shrink-0">
                            <textarea ref={inputRef} value={input}
                                onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                                placeholder="Ask me anything about the portal…" rows={1} disabled={thinking}
                                className="flex-1 resize-none bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/30 transition-all leading-snug"
                                style={{ maxHeight: 96 }} />
                            <motion.button onClick={() => sendMessage()} disabled={!input.trim() || thinking}
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
                                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Send className="w-4 h-4 text-white" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* "May I help you?" tooltip */}
            <AnimatePresence>
                {!open && (
                    <motion.div className="mb-3"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }} transition={{ delay: 1.2 }}>
                        <motion.div className="px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg border border-white/15"
                            style={{ background: 'rgba(8,12,35,0.88)', backdropFilter: 'blur(12px)' }}
                            animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                            💬 May I help you?
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB */}
            <ChatbotFAB onClick={() => setOpen(o => !o)} hasUnread={hasUnread} />
        </div>
    );
};

export default ChatbotWidget;
