import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const BOT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png';
const ADMIN_AVATAR = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
const TEACHER_AVATAR = 'https://cdn-icons-png.flaticon.com/512/1995/1995574.png';
const STUDENT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/236/236831.png';
const GUEST_AVATAR = 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png';

// Quick replies by role
const QUICK_REPLIES = {
  guest: [
    'Tell me about the school',
    'What facilities do you have?',
    'How many staff?',
    'How many students?'
  ],
  admin: [
    'How many students?',
    'Show me the student list',
    'Show me the teacher list',
    'Show me notices',
    'What facilities do you have?',
  ],
  teacher: [
    'My routine',
    'My salary',
    'List my students',
    'Show me notices',
    'School info',
    'What facilities do you have?',
  ],
  student: [
    'My routine',
    'School info',
    'Show me the student list',
    'Show me the teacher list',
    'Show me notices',
    'What facilities do you have?',
  ],
};

// Expanded Q&A database with more flexible, human-like matching
const QA = [
  // Guest (not logged in)
  {
    role: 'guest',
    patterns: [
      { q: /student list|show me the student list|list students|all students|teacher list|show me the teacher list|list teachers|all teachers|notice|show me notices|notices/i, a: "Sorry, as a guest you cannot access lists of students, teachers, or notices. Please log in for more information." },
      { q: /school|about|info|information|contact|address|location|where/i, a: async () => {
        return "Nawatara English School is located in Biratnagar, Nepal. We have over 50 dedicated staff members and more than 500 students. Facilities include science labs, computer labs, library, sports ground, and a cafeteria.";
      } },
      { q: /facilities|facility|services|infrastructure/i, a: async () => {
        return "Our school offers modern facilities including science labs, computer labs, a well-stocked library, a large sports ground, and a clean cafeteria.";
      } },
      { q: /how many staff|staff count|number of staff|dedicated staff/i, a: async () => {
        return "There are over 50 dedicated staff members at Nawatara English School, including teachers and support staff.";
      } },
      { q: /how many students|student count|total students|number of students|kids|children/i, a: async () => {
        return "There are more than 500 students currently enrolled at Nawatara English School.";
      } },
      { q: /hello|hi|hey|namaste/i, a: "Hello! Welcome to Nawatara. How can I help you today?" },
      { q: /good morning/i, a: "Good morning! How can I assist you today?" },
      { q: /good afternoon/i, a: "Good afternoon! How can I help you?" },
      { q: /good evening/i, a: "Good evening! How can I help you?" },
      { q: /thank you|thanks|thank/i, a: "You're welcome! If you have more questions, feel free to ask." },
      { q: /bye|goodbye|see you|take care/i, a: "Goodbye! Have a great day. If you need more information, just ask anytime." },
      { q: /help|what can you do|usage|example|how to use/i, a: "You can ask about the school, its location, staff, students, or facilities!" },
      { q: /.*/, a: "Sorry, as a guest you can only ask about the school, staff, students, or facilities. Try: 'Tell me about the school', 'How many staff?', 'What facilities do you have?'" },
    ]
  },
  // Admin
  {
    role: 'admin',
    patterns: [
      { q: /how many students|student count|total students|number of students|kids|children/i, a: async () => { const res = await axios.get('http://localhost:8000/getStudents', { withCredentials: true }); return `There are ${res.data.length} students.`; } },
      { q: /how many teachers|teacher count|total teachers|number of teachers|staff|dedicated staff/i, a: async () => { const res = await axios.get('http://localhost:8000/getTeachers', { withCredentials: true }); return `There are over 50 teachers at Nawatara English School.`; } },
      { q: /salary|payroll|payment|pay|wages|my pay|teacher pay|teacher salary/i, a: async () => { const res = await axios.get('http://localhost:8000/getSalaryRecords', { withCredentials: true }); return res.data.length ? res.data.slice(0, 5).map(s => `• ${s.teacherName}: Rs. ${s.amount}`).join('\n') : 'No salary records found.'; } },
      { q: /routine|schedule|period|class routine|class schedule|today's routine|today's schedule/i, a: async () => { const res = await axios.get('http://localhost:8000/getRoutine', { withCredentials: true }); return res.data.length ? res.data.slice(0, 5).map(r => `• ${r.time} - ${r.subject} (${r.teacher}, Class ${r.class})`).join('\n') : 'No routine info.'; } },
      { q: /list students|show students|student list/i, a: async () => { const res = await axios.get('http://localhost:8000/getStudents', { withCredentials: true }); return res.data.length ? res.data.slice(0, 5).map(s => `• ${s.name} (Class ${s.class_name})`).join('\n') : 'No students found.'; } },
      { q: /list teachers|show teachers|teacher list/i, a: async () => { const res = await axios.get('http://localhost:8000/getTeachers', { withCredentials: true }); return res.data.length ? res.data.slice(0, 5).map(t => `• ${t.name} (${t.email})`).join('\n') : 'No teachers found.'; } },
      { q: /school|about|info|information|location|where|facilities|facility|staff|student|children|kids|services|infrastructure/i, a: async () => {
        return "Nawatara English School is located in Biratnagar, Nepal. We have over 50 dedicated staff members and more than 500 students. Facilities include science labs, computer labs, library, sports ground, and a cafeteria.";
      } },
      { q: /hello|hi|namaste|hey|good morning|good afternoon|good evening/i, a: "Hello Admin! How can I help you?" },
      { q: /thank/i, a: "You're welcome!" },
      { q: /help|what can you do|usage|example|how to use/i, a: "You can ask about students, staff, teachers, salary, routine, or school info. Try: 'How many students?', 'Show me the teacher list', 'What is today's routine?', 'What facilities do you have?'" },
      { q: /.*/, a: "Sorry, I didn't understand. Try: 'How many students?', 'Show me the teacher list', 'What is today's routine?', 'Tell me about the school', or 'What facilities do you have?'" },
      { q: /remove teacher|edit teacher|teacher management|manage teachers|edit teacher details/i, a: async () => {
        setPendingRedirectUrl('http://localhost:5173/admin/remove-teacher');
        return 'To manage teachers (remove or edit), do you want me to redirect you to the teacher management page?';
      } },
    ]
  },
  // Teacher
  {
    role: 'teacher',
    patterns: [
      { q: /my routine|show my routine|my schedule|my period|my class|my timetable|my today/i, a: async () => {
        try {
          return `<a href='/routine' target='_blank' style='color:#0a66c2;text-decoration:underline;'>Click here to view your full routine</a>`;
        } catch (err) {
          console.error('Routine fetch error:', err);
          return "Sorry, I couldn't fetch your routine right now.";
        }
      } },
      { q: /salary|my pay|my payment|my payroll|my salary|my wages|show my salary/i, a: async () => {
        try {
          return `<a href='/my-salary' target='_blank' style='color:#0a66c2;text-decoration:underline;'>Click here to view your salary details</a>`;
        } catch (err) {
          console.error('Salary fetch error:', err);
          return "Sorry, I couldn't fetch your salary right now.";
        }
      } },
      { q: /student|class|my students|my class|student list|show me the student list|list students|all students/i, a: async () => {
        // Always show the link and trigger redirect, do not fetch students here
        return `<a href='/fetch-students' target='_blank' style='color:#0a66c2;text-decoration:underline;'>Click here to view the student list</a>`;
      } },
      { q: /show me notices|notice|notices/i, a: async () => {
        try {
          return `<a href='/notice' target='_blank' style='color:#0a66c2;text-decoration:underline;'>Click here to view all school notices</a>`;
        } catch (err) {
          console.error('Notices fetch error:', err);
          return "Sorry, I couldn't fetch today's notices right now.";
        }
      } },
      { q: /school|about|info|information|location|where|facilities|facility|staff|student|children|kids|services|infrastructure/i, a: async () => {
        return "Nawatara English School is located in Biratnagar, Nepal. We have over 50 dedicated staff members and more than 500 students. Facilities include science labs, computer labs, library, sports ground, and a cafeteria.";
      } },
      { q: /hello|hi|namaste|hey|good morning|good afternoon|good evening/i, a: "Hello Teacher! How can I help you?" },
      { q: /thank/i, a: "You're welcome!" },
      { q: /help|what can you do|usage|example|how to use/i, a: "You can ask about your routine, salary, students, school info, or facilities. Try: 'Show my routine', 'My salary', 'List my students', 'School info', 'What facilities do you have?'" },
      { q: /.*/, a: "Sorry, I didn't understand. Try: 'Show my routine', 'My salary', 'List my students', 'School info', or 'What facilities do you have?'" },
    ]
  },
  // Student
  {
    role: 'student',
    patterns: [
      { q: /my routine|my schedule|my period|my class|my timetable|my today/i, a: async () => { const res = await axios.get('http://localhost:8000/getRoutine', { withCredentials: true }); return res.data.length ? res.data.slice(0, 5).map(r => `• ${r.time} - ${r.subject} (${r.teacher}, Class ${r.class})`).join('\n') : 'No routine info.'; } },
      { q: /school|about|info|information|location|where|facilities|facility|staff|student|children|kids|services|infrastructure/i, a: async () => {
        return "Nawatara English School is located in Biratnagar, Nepal. We have over 50 dedicated staff members and more than 500 students. Facilities include science labs, computer labs, library, sports ground, and a cafeteria.";
      } },
      { q: /hello|hi|namaste|hey|good morning|good afternoon|good evening/i, a: "Hello Student! How can I help you?" },
      { q: /thank/i, a: "You're welcome!" },
      { q: /help|what can you do|usage|example|how to use/i, a: "You can ask about your routine, school info, or facilities. Try: 'Show my routine', 'School info', 'What facilities do you have?'" },
      { q: /.*/, a: "Sorry, I didn't understand. Try: 'Show my routine', 'School info', or 'What facilities do you have?'" },
    ]
  },
];

// Expanded, typo-tolerant, and natural regexes for all major actions
const NOTICES_REGEX = /(show( me)?|display|list|fetch|get|provide|see|have|want|can (i|you)|what('|')s|any|do (i|we|you)|are there|give me|let me|school|admin|today('|')s|recent|current|important|update|board|announcements?) ?(all |the |my |school |admin |today('|')s |recent |current |important )?notices?|notice board|announcements?([\?\!\.]*)/i;
const STUDENT_LIST_REGEX = /(show( me)?|display|list|fetch|get|provide|see|have|want|can (i|you)|who are|give me|let me|school|class|today('|')s|recent|current|update|directory|roster|students now|students update|students please) ?(all |the |my |school |class |today('|')s |recent |current )?student(s)?( list| directory| roster)?([\?\!\.]*)/i;
const TEACHER_LIST_REGEX = /(show( me)?|display|list|fetch|get|provide|see|have|want|can (i|you)|who are|give me|let me|school|class|today('|')s|recent|current|update|directory|roster|teachers now|teachers update|teachers please) ?(all |the |my |school |class |today('|')s |recent |current )?teacher(s)?( list| directory| roster)?([\?\!\.]*)/i;
const SALARY_REGEX = /(show( me)?|display|list|fetch|get|provide|see|have|want|can (i|you)|i want to see|my|please) ?(my |the )?(salary|pay|payment|payroll|wages)( details)?([\?\!\.]*)/i;
const ROUTINE_REGEX = /(show( me)?|display|list|fetch|get|provide|see|have|want|can (i|you)|i want to see|my|please) ?(my |the |today('|')s |all )?(routine|schedule|period|class routine|class schedule|timetable|my today)( details)?([\?\!\.]*)/i;

function getRole() {
  if (document.cookie.includes('adminToken')) return 'admin';
  if (document.cookie.includes('teacherToken')) return 'teacher';
  if (document.cookie.includes('studentToken')) return 'student';
  return 'guest';
}

function getAvatar(role) {
  if (role === 'admin') return ADMIN_AVATAR;
  if (role === 'teacher') return TEACHER_AVATAR;
  if (role === 'student') return STUDENT_AVATAR;
  return GUEST_AVATAR;
}

const AIChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(getRole());
  const [showMore, setShowMore] = useState({ type: null, data: [] });
  const messagesEndRef = useRef(null);
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState(null);

  // Always update role from cookies
  useEffect(() => {
    const interval = setInterval(() => {
      setRole(getRole());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isOpen]);

  // Handle Q&A
  const handleQA = async (text, showAll = false) => {
    const lower = text.toLowerCase();
    // Admin/Teacher: Student list
    if ((role === 'admin' || role === 'teacher') && STUDENT_LIST_REGEX.test(text)) {
      setPendingRedirectUrl('/fetch-students');
      return `To view the student list, do you want me to redirect you to the page?`;
    }
    // Admin/Teacher: Teacher list
    if ((role === 'admin' || role === 'teacher') && TEACHER_LIST_REGEX.test(text)) {
      setPendingRedirectUrl('http://localhost:5173/admin/remove-teacher');
      return `To view the teacher list, do you want me to redirect you to the page?`;
    }
    // Admin/Teacher: Notices
    if ((role === 'admin' || role === 'teacher') && NOTICES_REGEX.test(text)) {
      setPendingRedirectUrl('/notice');
      return `To view all school notices, do you want me to redirect you to the page?`;
    }
    // Teacher: Salary
    if (role === 'teacher' && SALARY_REGEX.test(text)) {
      setPendingRedirectUrl('/my-salary');
      return `To view your salary details, do you want me to redirect you to the page?`;
    }
    // Teacher: Routine
    if (role === 'teacher' && ROUTINE_REGEX.test(text)) {
      setPendingRedirectUrl('/routine');
      return `To view your routine, do you want me to redirect you to the page?`;
    }
    // Admin: How many students?
    if (role === 'admin' && /how many students|student count|total students|number of students|kids|children/i.test(lower)) {
      try {
        const res = await axios.get('http://localhost:8000/getStudents', { withCredentials: true });
        if (!res.data || !Array.isArray(res.data)) return "Sorry, I couldn't fetch the student count right now. Please try again later or contact support.";
        return `There are ${res.data.length} students enrolled in the school.`;
      } catch (err) {
        return "Sorry, I couldn't fetch the student count right now. Please try again later or contact support.";
      }
    }
    // Admin: How many teachers?
    if (role === 'admin' && /how many teachers|teacher count|total teachers|number of teachers|staff|dedicated staff/i.test(lower)) {
      try {
        const res = await axios.get('http://localhost:8000/getTeachers', { withCredentials: true });
        return `There are over 50 teachers at Nawatara English School.`;
      } catch (err) {
        return "Sorry, I couldn't fetch the teacher count right now.";
      }
    }
    // Teacher: How many students?
    if (role === 'teacher' && /how many students|student count|total students|number of students|kids|children/i.test(lower)) {
      try {
        const res = await axios.get('http://localhost:8000/getStudents', { withCredentials: true });
        if (!res.data || !Array.isArray(res.data)) return "Sorry, I couldn't fetch the student count right now. Please try again later or contact support.";
        return `There are ${res.data.length} students enrolled in the school.`;
      } catch (err) {
        return "Sorry, I couldn't fetch the student count right now. Please try again later or contact support.";
      }
    }
    // Teacher: How many teachers?
    if (role === 'teacher' && /how many teachers|teacher count|total teachers|number of teachers|staff|dedicated staff/i.test(lower)) {
      try {
        const res = await axios.get('http://localhost:8000/getTeachers', { withCredentials: true });
        return `There are over 50 teachers at Nawatara English School.`;
      } catch (err) {
        return "Sorry, I couldn't fetch the teacher count right now.";
      }
    }
    // If user says yes and pendingRedirectUrl is set
    if (/^yes$/i.test(lower) && pendingRedirectUrl) {
      const url = pendingRedirectUrl;
      setPendingRedirectUrl(null);
      setTimeout(() => {
        window.open(url, '_blank');
      }, 1000);
      return 'Redirecting you now...';
    }
    // Real data fetching for lists and notices
    if (/student list|show me the student list|list students|all students/i.test(lower)) {
      const res = await axios.get('http://localhost:8000/getStudents', { withCredentials: true });
      if (!res.data.length) return 'No students found.';
      if (!showAll && res.data.length > 10) {
        setShowMore({ type: 'students', data: res.data });
        return res.data.slice(0, 10).map(s => `• ${s.name} (Class ${s.class_name})`).join('\n') + `\n...and more. Click "Show more students" below.`;
      }
      setShowMore({ type: null, data: [] });
      return res.data.map(s => `• ${s.name} (Class ${s.class_name})`).join('\n');
    }
    if (/teacher list|show me the teacher list|list teachers|all teachers/i.test(lower)) {
      const res = await axios.get('http://localhost:8000/getTeachers', { withCredentials: true });
      if (!res.data.length) return 'No teachers found.';
      if (!showAll && res.data.length > 10) {
        setShowMore({ type: 'teachers', data: res.data });
        return res.data.slice(0, 10).map(t => `• ${t.name} (${t.email})`).join('\n') + `\n...and more. Click "Show more teachers" below.`;
      }
      setShowMore({ type: null, data: [] });
      return res.data.map(t => `• ${t.name} (${t.email})`).join('\n');
    }
    // Only allow general notices fetch for non-teacher roles
    if (role !== 'teacher' && /notice|show me notices|notices/i.test(lower)) {
      let url = 'http://localhost:8000/get/notices';
      if (role === 'admin') url = 'http://localhost:8000/get/notices/admins';
      else if (role === 'student') url = 'http://localhost:8000/get/notices/students';
      const res = await axios.get(url, { withCredentials: true });
      if (!res.data.length) return 'No notices found.';
      if (!showAll && res.data.length > 10) {
        setShowMore({ type: 'notices', data: res.data });
        return res.data.slice(0, 10).map(n => `• ${n.subject || n.title}: ${n.message || n.content}`).join('\n') + `\n...and more. Click "Show more notices" below.`;
      }
      setShowMore({ type: null, data: [] });
      return res.data.map(n => `• ${n.subject || n.title}: ${n.message || n.content}`).join('\n');
    }
    // Show more handler
    if (/show more students/i.test(lower) && showMore.type === 'students') {
      setShowMore({ type: null, data: [] });
      return showMore.data.map(s => `• ${s.name} (Class ${s.class_name})`).join('\n');
    }
    if (/show more teachers/i.test(lower) && showMore.type === 'teachers') {
      setShowMore({ type: null, data: [] });
      return showMore.data.map(t => `• ${t.name} (${t.email})`).join('\n');
    }
    if (/show more notices/i.test(lower) && showMore.type === 'notices') {
      setShowMore({ type: null, data: [] });
      return showMore.data.map(n => `• ${n.subject || n.title}: ${n.message || n.content}`).join('\n');
    }
    // In handleQA, add a catch-all for 'students datas' and similar to trigger the student list redirect flow
    if ((role === 'admin' || role === 'teacher') && /(students? data|student data|students datas|student datas|students info|student info|students information|student information)/i.test(text)) {
      setPendingRedirectUrl('/fetch-students');
      return `To view the student list, do you want me to redirect you to the page?`;
    }
    // Fallback to previous QA logic
    const qaSet = QA.find(q => q.role === role) || QA[0];
    for (const qa of qaSet.patterns) {
      if (qa.q.test(text)) {
        if (typeof qa.a === 'function') {
          setIsLoading(true);
          const answer = await qa.a();
          setIsLoading(false);
          return answer;
        }
        return qa.a;
      }
    }
    return "Sorry, I didn't understand.";
  };

  // Handle submit
  const handleSubmit = async (e, overrideText) => {
    if (e) e.preventDefault();
    const userMessage = (overrideText !== undefined ? overrideText : input).trim();
    if (!userMessage) return;
    setMessages(prev => [...prev, { role: 'user', content: userMessage, userRole: role }]);
    setInput('');
    setIsLoading(true);
    setPendingRedirect(false);
    setTimeout(async () => {
      const botReply = await handleQA(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: botReply, userRole: role }]);
      setIsLoading(false);
      // If the reply is the student list link, trigger redirect after 3s
      if (
        role === 'teacher' &&
        /<a href=['"]\/fetch-students['"]/i.test(botReply)
      ) {
        setPendingRedirect(true);
        setTimeout(() => {
          window.open('/fetch-students', '_blank');
          setPendingRedirect(false);
        }, 3000);
      }
    }, 1000);
  };

  // Chat bubble
  function ChatBubble({ message }) {
    if (message.role === 'user') {
      return (
        <div className="flex justify-end mb-2">
          <div className={`px-4 py-2 rounded-2xl max-w-[70%] shadow text-sm text-white ${message.userRole === 'admin' ? 'bg-blue-700' : message.userRole === 'teacher' ? 'bg-green-600' : message.userRole === 'student' ? 'bg-orange-500' : 'bg-gray-500'} modern-bubble-user`}>{message.content}</div>
          <img src={getAvatar(message.userRole)} alt="User" className="w-7 h-7 rounded-full ml-2 border border-gray-200" />
        </div>
      );
    }
    return (
      <div className="flex items-end gap-2 mb-2">
        <img src={BOT_AVATAR} alt="Bot" className="w-7 h-7 rounded-full border border-blue-200" />
        <div className="modern-bubble-bot bg-white text-gray-900 px-4 py-2 rounded-2xl rounded-bl-sm max-w-[70%] shadow text-sm whitespace-pre-line border border-blue-100" dangerouslySetInnerHTML={{ __html: message.content }} />
      </div>
    );
  }

  // Main render
  return (
    <>
      {/* Floating pop-out button */}
      {!isOpen && (
        <button
          className="fixed bottom-8 right-8 z-[9999] w-16 h-16 bg-[#0a66c2] rounded-full shadow-2xl flex items-center justify-center border-4 border-white hover:scale-105 transition-transform duration-200"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Chat"
        >
          <img src={BOT_AVATAR} alt="Bot" className="w-10 h-10 rounded-full" />
        </button>
      )}
      {/* Chatbox */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 z-[9999] w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl border border-blue-200 flex flex-col transition-all duration-300">
          {/* Header with close button */}
          <div className="bg-[#0a66c2] px-6 py-4 rounded-t-2xl flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <img src={BOT_AVATAR} alt="Bot" className="w-10 h-10 rounded-full border-2 border-white shadow" />
              <div>
                <h3 className="text-white font-bold text-lg tracking-wide drop-shadow">Nawatara Assistant</h3>
                <p className="text-blue-100 text-xs font-medium capitalize tracking-wide">{role} Mode</p>
              </div>
            </div>
            <button className="text-white hover:text-blue-100 ml-2" onClick={() => setIsOpen(false)} aria-label="Close AI Chat">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Guest: Only show static info and overlay */}
          {role === 'guest' ? (
            <>
              <div id="ai-chat-body" className="flex-1 overflow-y-auto px-5 py-4 bg-gradient-to-br from-blue-50 to-white" style={{scrollBehavior:'smooth'}}>
                <div className="flex items-end gap-2 mb-2">
                  <img src={BOT_AVATAR} alt="Bot" className="w-7 h-7 rounded-full border border-blue-200" />
                  <div className="modern-bubble-bot bg-white text-gray-900 px-4 py-2 rounded-2xl rounded-bl-sm max-w-[70%] shadow text-sm border border-blue-100">
                    Please log in to interact with the assistant.
                  </div>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <img src={BOT_AVATAR} alt="Bot" className="w-7 h-7 rounded-full border border-blue-200" />
                  <div className="modern-bubble-bot bg-white text-gray-900 px-4 py-2 rounded-2xl rounded-bl-sm max-w-[70%] shadow text-sm border border-blue-100">
                    <b>About School</b><br/>Nawatara English School is located in Biratnagar, Nepal. We have over 50 dedicated staff members and more than 500 students. Facilities include science labs, computer labs, library, sports ground, and a cafeteria.
                  </div>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <img src={BOT_AVATAR} alt="Bot" className="w-7 h-7 rounded-full border border-blue-200" />
                  <div className="modern-bubble-bot bg-white text-gray-900 px-4 py-2 rounded-2xl rounded-bl-sm max-w-[70%] shadow text-sm border border-blue-100">
                    <b>Facilities</b><br/>Science labs, computer labs, a well-stocked library, a large sports ground, and a clean cafeteria.
                  </div>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <img src={BOT_AVATAR} alt="Bot" className="w-7 h-7 rounded-full border border-blue-200" />
                  <div className="modern-bubble-bot bg-white text-gray-900 px-4 py-2 rounded-2xl rounded-bl-sm max-w-[70%] shadow text-sm border border-blue-100">
                    <b>Staff</b><br/>Over 50 dedicated staff members, including teachers and support staff.
                  </div>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <img src={BOT_AVATAR} alt="Bot" className="w-7 h-7 rounded-full border border-blue-200" />
                  <div className="modern-bubble-bot bg-white text-gray-900 px-4 py-2 rounded-2xl rounded-bl-sm max-w-[70%] shadow text-sm border border-blue-100">
                    <b>Students</b><br/>More than 500 students currently enrolled.
                  </div>
                </div>
              </div>
              {/* Remove input for guests, only show footer */}
              <div className="text-center text-xs text-blue-400 py-1 bg-gray-50 rounded-b-2xl font-medium tracking-wide">Powered by <span className="font-semibold text-[#0a66c2]">Nawatara</span></div>
              <style>{`
                .modern-bubble-user {
                  background: linear-gradient(135deg, #0a66c2 60%, #0073b1 100%);
                  box-shadow: 0 2px 12px 0 rgba(10,102,194,0.10);
                }
                .modern-bubble-bot {
                  background: #fff;
                  box-shadow: 0 2px 12px 0 rgba(10,102,194,0.08);
                }
              `}</style>
            </>
          ) : (
            // Teacher and other roles: Modern chat UI and context-aware options
            <>
              <div id="ai-chat-body" className="flex-1 overflow-y-auto px-5 py-4 bg-gradient-to-br from-blue-50 to-white" style={{scrollBehavior:'smooth'}}>
                {messages.length === 0 && (
                  <div className="flex items-end gap-2 mb-2">
                    <img src={BOT_AVATAR} alt="Bot" className="w-7 h-7 rounded-full border border-blue-200" />
                    <div className="modern-bubble-bot bg-white text-gray-900 px-4 py-2 rounded-2xl rounded-bl-sm max-w-[70%] shadow text-sm border border-blue-100">
                      {role === 'admin' && 'Hello Admin! How can I assist you today?'}
                      {role === 'teacher' && 'Hello Teacher! How can I assist you today?'}
                      {role === 'student' && 'Hello Student! How can I assist you today?'}
                    </div>
                  </div>
                )}
                {messages.map((msg, idx) => <ChatBubble key={idx} message={msg} />)}
                {isLoading && (
                  <div className="flex items-end gap-2 mb-2">
                    <img src={BOT_AVATAR} alt="Bot" className="w-7 h-7 rounded-full border border-blue-200" />
                    <div className="modern-bubble-bot bg-white text-gray-900 px-4 py-2 rounded-2xl text-sm animate-pulse border border-blue-100">Nawatara Assistant is typing...</div>
                  </div>
                )}
                {pendingRedirect && (
                  <div className="flex items-end gap-2 mb-2">
                    <img src={BOT_AVATAR} alt="Bot" className="w-7 h-7 rounded-full border border-blue-200" />
                    <div className="modern-bubble-bot bg-white text-gray-900 px-4 py-2 rounded-2xl text-sm animate-pulse border border-blue-100">Redirecting...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Context-aware options for teachers */}
              {role === 'teacher' && (
                <div className="flex flex-wrap gap-2 px-5 pb-2 pt-1 bg-gradient-to-br from-blue-50 to-white border-t border-blue-100 rounded-b-2xl">
                  {['Show my routine', 'Show student list', 'Show salary', 'Show notices', 'School info', 'Facilities'].map((q, i) => (
                    <button
                      key={i}
                      className="bg-[#e7f3ff] text-[#0a66c2] rounded-full px-4 py-1 text-xs font-medium shadow hover:bg-[#d0e7fa] transition"
                      onClick={() => handleSubmit(null, q)}
                      disabled={isLoading}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {/* Input */}
              <form onSubmit={handleSubmit} className="p-5 border-t border-blue-100 bg-white rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={'Type your question...'}
                    className="flex-1 border border-blue-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] text-sm bg-white shadow-sm"
                    autoFocus
                    disabled={role === 'guest'}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || role === 'guest'}
                    className="bg-[#0a66c2] text-white rounded-full px-4 py-2 hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a66c2] disabled:opacity-50 disabled:cursor-not-allowed shadow"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </button>
                </div>
              </form>
              {/* Footer */}
              <div className="text-center text-xs text-blue-400 py-1 bg-gray-50 rounded-b-2xl font-medium tracking-wide">Powered by <span className="font-semibold text-[#0a66c2]">Nawatara</span></div>
              <style>{`
                .modern-bubble-user {
                  background: linear-gradient(135deg, #0a66c2 60%, #0073b1 100%);
                  box-shadow: 0 2px 12px 0 rgba(10,102,194,0.10);
                }
                .modern-bubble-bot {
                  background: #fff;
                  box-shadow: 0 2px 12px 0 rgba(10,102,194,0.08);
                }
              `}</style>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatBox; 