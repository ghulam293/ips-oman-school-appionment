import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  GraduationCap,
  House,
  KeyRound,
  Languages,
  LockKeyhole,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Users,
  Video,
  X,
} from 'lucide-react';
import './app.css';

const STORAGE_KEY = 'ips-demo-appointments';
const TIME_SLOTS = ['09:00', '09:30', '10:30', '11:00', '13:30', '14:00'];
const STAFF = [
  { id: 'admin1', name: 'IPS Oman Admin Office', role: 'School Administrator', dept: 'School administration', initials: 'AD', color: 'sky' },
  { id: 'hr1', name: 'Ms. Fatima Al-Raisi', role: 'HR Officer', dept: 'Human Resources', initials: 'HR', color: 'peach' },
  { id: 'p1', name: 'Dr. Nadia Hassan', role: 'Principal', dept: 'School Leadership', initials: 'NH', color: 'rose' },
  { id: 't1', name: 'Ms. Sarah Ahmed', role: 'Teacher', dept: 'Grade 5 · Mathematics', initials: 'SA', color: 'lavender' },
  { id: 't2', name: 'Mr. Omar Khalid', role: 'Teacher', dept: 'Grade 6 · English', initials: 'OK', color: 'peach' },
  { id: 'a1', name: 'Ms. Aisha Noor', role: 'Admission Officer', dept: 'Admissions Office', initials: 'AN', color: 'mint' },
  { id: 'c1', name: 'Mr. Yusuf Ali', role: 'Counselor', dept: 'Student Wellbeing', initials: 'YA', color: 'lilac' },
  { id: 'f1', name: 'Ms. Lina Faris', role: 'Finance Officer', dept: 'Accounts Office', initials: 'LF', color: 'sky' },
  { id: 'r1', name: 'Reception Desk', role: 'Receptionist', dept: 'Visitor coordination', initials: 'RC', color: 'mint' },
];
const STAFF_GROUPS = [
  { number: '01', title: 'School Administrator', roles: ['School Administrator'], icon: Building2 },
  { number: '02', title: 'Human Resources', roles: ['HR Officer'], icon: BriefcaseBusiness },
  { number: '03', title: 'School Leadership', roles: ['Principal'], icon: GraduationCap },
  { number: '04', title: 'Teaching Staff', roles: ['Teacher'], icon: Users },
  { number: '05', title: 'Admissions', roles: ['Admission Officer'], icon: CalendarCheck },
  { number: '06', title: 'Student Wellbeing', roles: ['Counselor'], icon: ShieldCheck },
  { number: '07', title: 'Finance', roles: ['Finance Officer'], icon: CalendarDays },
  { number: '08', title: 'Reception', roles: ['Receptionist'], icon: House },
];
const SAMPLE_APPOINTMENTS = [
  { id: 'IPS-1042', staffId: 't1', child: 'Adam', date: '2026-10-23', time: '09:30', format: 'In person', topic: 'Academic progress', status: 'Confirmed', notes: 'Discuss term progress.' },
  { id: 'IPS-1043', staffId: 'p1', child: 'Maya', date: '2026-10-26', time: '11:00', format: 'Online', topic: 'School feedback', status: 'Pending', notes: '' },
  { id: 'IPS-1036', staffId: 't2', child: 'Adam', date: '2026-10-15', time: '10:30', format: 'In person', topic: 'Learning support', status: 'Completed', notes: '' },
];
const NAV_ITEMS = [
  { id: 'home', label: 'Overview', icon: House },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays },
  { id: 'profile', label: 'My profile', icon: Users },
];
const ROLES = ['Parent', 'School Administrator', 'HR Officer', 'Principal', 'Teacher', 'Admission Officer', 'Receptionist', 'Counselor', 'Finance Officer', 'Student'];
const FILTERS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Declined'];

function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateAfter(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDate(date);
}

function formatDate(value, language = 'en') {
  if (!value) return '';
  return new Date(`${value}T12:00:00`).toLocaleDateString(language === 'ar' ? 'ar-OM' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function readAppointments() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return SAMPLE_APPOINTMENTS;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : SAMPLE_APPOINTMENTS;
  } catch (error) {
    console.error('Could not read saved demo appointments.', error);
    return SAMPLE_APPOINTMENTS;
  }
}

function App() {
  const [appointments, setAppointments] = useState(readAppointments);
  const [tab, setTab] = useState('home');
  const [language, setLanguage] = useState('en');
  const [role, setRole] = useState('Parent');
  const [teacherAccess, setTeacherAccess] = useState(
    () => localStorage.getItem('ips-demo-teacher-access') === 'true',
  );
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState(null);
  const [step, setStep] = useState(1);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState(() => ({
    staffId: '',
    child: 'Adam',
    date: dateAfter(2),
    time: '',
    format: 'In person',
    topic: 'Academic progress',
    notes: '',
  }));
  const isArabic = language === 'ar';
  const currentDateLabel = new Date()
    .toLocaleDateString(isArabic ? 'ar-OM' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .toUpperCase();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }, [isArabic, language]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch (error) {
      console.error('Could not save demo appointments in this browser.', error);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem('ips-demo-teacher-access', String(teacherAccess));
    } catch (error) {
      console.error('Could not save demo teacher-access settings in this browser.', error);
    }
  }, [teacherAccess]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const t = isArabic
    ? {
        home: 'الرئيسية',
        appointments: 'المواعيد',
        profile: 'الملف الشخصي',
        hello: 'صباح الخير',
        welcome: 'ابقَ على تواصل مع مدرستك',
        next: 'موعدك القادم',
        quick: 'إجراءات سريعة',
        upcoming: 'المواعيد القادمة',
        book: 'حجز موعد',
        all: 'عرض الكل',
        new: 'حجز موعد جديد',
        selectStaff: 'اختر أحد موظفي المدرسة',
        details: 'تفاصيل الاجتماع',
        review: 'مراجعة الطلب',
        continue: 'متابعة',
        send: 'إرسال الطلب',
        student: 'الطالب',
        date: 'التاريخ',
        time: 'الوقت',
        format: 'نوع الاجتماع',
        reason: 'سبب الاجتماع',
        notes: 'ملاحظات إضافية',
        success: 'تم إرسال الطلب!',
        done: 'العودة للرئيسية',
        confirmed: 'مؤكد',
        pending: 'قيد الانتظار',
        completed: 'مكتمل',
        cancelled: 'ملغى',
        declined: 'مرفوض',
        online: 'عبر الإنترنت',
        inPerson: 'حضوري',
        settings: 'الإعدادات',
        role: 'الدور التجريبي',
        language: 'اللغة',
        search: 'ابحث عن موعد أو موظف',
        noResults: 'لا توجد مواعيد تطابق بحثك.',
        available: 'الأوقات المتاحة',
        booked: 'محجوز',
      }
    : {
        home: 'Overview',
        appointments: 'Appointments',
        profile: 'My profile',
        hello: 'Good morning',
        welcome: 'Stay connected with your school',
        next: 'Your next meeting',
        quick: 'Quick actions',
        upcoming: 'Upcoming appointments',
        book: 'Book a meeting',
        all: 'View all',
        new: 'Book a new appointment',
        selectStaff: 'Choose a member of staff',
        details: 'Meeting details',
        review: 'Review your request',
        continue: 'Continue',
        send: 'Send request',
        student: 'Student',
        date: 'Date',
        time: 'Time',
        format: 'Meeting format',
        reason: 'Meeting reason',
        notes: 'Additional notes',
        success: 'Request sent!',
        done: 'Back to overview',
        confirmed: 'Confirmed',
        pending: 'Pending',
        completed: 'Completed',
        cancelled: 'Cancelled',
        declined: 'Declined',
        online: 'Online',
        inPerson: 'In person',
        settings: 'Settings',
        role: 'Demo role',
        language: 'Language',
        search: 'Search appointments or staff',
        noResults: 'No appointments match your search.',
        available: 'Available sessions',
        booked: 'Booked',
      };

  const getStaff = (appointment) => STAFF.find((member) => member.id === appointment?.staffId) || STAFF[0];
  const canBookTeacher = role === 'School Administrator' || teacherAccess;
  const activeAppointments = useMemo(
    () => appointments.filter((item) => ['Pending', 'Confirmed'].includes(item.status)),
    [appointments],
  );
  const upcoming = useMemo(
    () =>
      appointments
        .filter((item) => item.date >= localDate() && !['Cancelled', 'Declined'].includes(item.status))
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
    [appointments],
  );
  const nextMeeting = upcoming.find((item) => item.status === 'Confirmed') || upcoming[0];
  const filteredAppointments = useMemo(
    () =>
      appointments
        .filter((item) => filter === 'All' || item.status === filter)
        .filter((item) => {
          const member = STAFF.find((person) => person.id === item.staffId);
          const text = `${item.id} ${member?.name || ''} ${item.topic} ${item.child}`.toLowerCase();
          return text.includes(search.toLowerCase());
        })
        .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)),
    [appointments, filter, search],
  );
  const isSlotTaken = (staffId, date, time, ignoreId = '') =>
    activeAppointments.some(
      (item) => item.id !== ignoreId && item.staffId === staffId && item.date === date && item.time === time,
    );
  const availableSlots = TIME_SLOTS.filter(
    (time) => !isSlotTaken(form.staffId, form.date, time, form.id),
  );

  function toast(message) {
    setNotice(message);
  }

  function startBooking(existing = null) {
    setForm(
      existing
        ? { ...existing }
        : {
            staffId: '',
            child: 'Adam',
            date: dateAfter(2),
            time: '',
            format: 'In person',
            topic: 'Academic progress',
            notes: '',
          },
    );
    setStep(existing ? 2 : 1);
    setSelected(null);
    setBooking(existing ? 'reschedule' : 'new');
  }

  function chooseStaff(staffId) {
    const freeTime = TIME_SLOTS.find((time) => !isSlotTaken(staffId, form.date, time, form.id)) || '';
    setForm((current) => ({ ...current, staffId, time: freeTime }));
  }

  function chooseDate(date) {
    const freeTime = TIME_SLOTS.find((time) => !isSlotTaken(form.staffId, date, time, form.id)) || '';
    setForm((current) => ({ ...current, date, time: freeTime }));
  }

  function saveAppointment() {
    if (!form.staffId || !form.date || !form.time || form.date < localDate()) {
      toast('Choose a staff member, a future date, and an available session.');
      return;
    }
    if (isSlotTaken(form.staffId, form.date, form.time, form.id)) {
      toast('That session was just booked. Please choose another time.');
      return;
    }
    if (booking === 'reschedule') {
      setAppointments((current) =>
        current.map((item) =>
          item.id === form.id
            ? { ...item, ...form, status: 'Pending' }
            : item,
        ),
      );
      setBooking(null);
      toast('Your change was sent for approval.');
      return;
    }
    const appointment = {
      ...form,
      id: `IPS-${String(Date.now()).slice(-6)}`,
      status: 'Pending',
    };
    setAppointments((current) => [appointment, ...current]);
    setBooking('success');
  }

  function updateAppointment(id, changes) {
    setAppointments((current) =>
      current.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
    setSelected(null);
    toast('Appointment updated.');
  }

  function statusLabel(status) {
    return t[status.toLowerCase()] || status;
  }

  function appointmentCard(item) {
    const member = getStaff(item);
    return (
      <button
        className="appointment-card"
        key={item.id}
        onClick={() => setSelected(item)}
        type="button"
      >
        <div className="appointment-date">
          <span>{new Date(`${item.date}T12:00:00`).toLocaleDateString(isArabic ? 'ar-OM' : 'en', { month: 'short' })}</span>
          <strong>{new Date(`${item.date}T12:00:00`).getDate()}</strong>
        </div>
        <div className="appointment-person">
          <span className={`person-avatar ${member.color}`}>{member.initials}</span>
          <span className="appointment-copy">
            <strong>{member.name}</strong>
            <small>{item.topic} · {item.child}</small>
            <small className="appointment-time"><Clock3 size={13} /> {item.time}</small>
          </span>
        </div>
        <span className={`status status-${item.status.toLowerCase()}`}>{statusLabel(item.status)}</span>
        <ChevronRight className="card-chevron" size={18} />
      </button>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" onClick={() => setTab('home')}>
          <img src="/ips-crest.png" alt="IPS Oman crest" />
          <span><strong>IPS OMAN</strong><small>School Connect</small></span>
        </a>
        <div className="sidebar-label">MENU</div>
        <nav className="side-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              className={tab === id ? 'nav-item active' : 'nav-item'}
              key={id}
              onClick={() => setTab(id)}
              type="button"
            >
              <Icon size={19} /> {isArabic ? t[id] : label}
            </button>
          ))}
          <button className="nav-item" onClick={() => startBooking()} type="button">
            <Plus size={19} /> {t.book}
          </button>
        </nav>
        <div className="sidebar-help">
          <div className="help-icon"><ShieldCheck size={19} /></div>
          <strong>Here for your family</strong>
          <span>Book a convenient time to speak with your school.</span>
          <button onClick={() => startBooking()} type="button">Request a meeting <ArrowRight size={14} /></button>
        </div>
        <div className="sidebar-foot">IPS Oman · Parent portal</div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-brand" onClick={() => setTab('home')} type="button">
            <img src="/ips-crest.png" alt="" /><span>IPS Oman</span>
          </button>
          <span className="breadcrumb">Parent portal <ChevronRight size={14} /> <strong>{isArabic ? t[tab] : NAV_ITEMS.find((item) => item.id === tab)?.label || 'Overview'}</strong></span>
          <div className="topbar-actions">
            <button className="icon-button language-button" onClick={() => setLanguage(isArabic ? 'en' : 'ar')} title="Switch language" type="button">
              <Languages size={18} /><span>{isArabic ? 'EN' : 'عربي'}</span>
            </button>
            <button className="icon-button notification-button" onClick={() => toast('You are all caught up.')} title="Notifications" type="button">
              <Bell size={19} /><i />
            </button>
            <button className="user-menu" onClick={() => setTab('profile')} type="button">
              <span className="user-avatar">FA</span>
              <span className="user-copy"><strong>Fatima Al-Harthy</strong><small>Parent account</small></span>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>

        {tab === 'home' && (
          <section className="content-page">
            <div className="welcome-heading">
              <div>
                <span className="eyebrow">{currentDateLabel}</span>
                <h1>{t.hello}, Fatima <span aria-hidden="true">👋</span></h1>
                <p>{t.welcome}. Everything you need, in one place.</p>
              </div>
              <button className="primary-button" onClick={() => startBooking()} type="button"><Plus size={18} /> {t.book}</button>
            </div>

            <div className="welcome-banner">
              <div className="banner-content">
                <span className="banner-overline"><GraduationCap size={16} /> PARENT & SCHOOL, TOGETHER</span>
                <h2>A little conversation can make a big difference.</h2>
                <p>Connect with your child’s teachers and school team with a meeting that works for you.</p>
                <button className="banner-button" onClick={() => startBooking()} type="button">Find a time <ArrowRight size={16} /></button>
              </div>
              <div className="banner-art" aria-hidden="true"><CalendarCheck size={112} strokeWidth={1.1} /></div>
              <img className="banner-crest" src="/ips-crest.png" alt="" />
            </div>

            <div className="summary-grid">
              <div className="summary-card">
                <span className="summary-icon teal"><CalendarDays size={20} /></span>
                <span><small>Upcoming meetings</small><strong>{upcoming.length}</strong></span>
                <span className="summary-trend"><ArrowDownRight size={15} /> All upcoming</span>
              </div>
              <div className="summary-card">
                <span className="summary-icon green"><CheckCircle2 size={20} /></span>
                <span><small>Confirmed</small><strong>{appointments.filter((item) => item.status === 'Confirmed' && item.date >= localDate()).length}</strong></span>
                <span className="summary-trend">Ready to attend</span>
              </div>
              <div className="summary-card">
                <span className="summary-icon amber"><Clock3 size={20} /></span>
                <span><small>Awaiting response</small><strong>{appointments.filter((item) => item.status === 'Pending').length}</strong></span>
                <span className="summary-trend">We’ll keep you posted</span>
              </div>
            </div>

            <div className="dashboard-columns">
              <section className="panel upcoming-panel">
                <div className="panel-heading">
                  <div><span className="eyebrow">YOUR SCHEDULE</span><h2>{t.upcoming}</h2></div>
                  <button className="text-button" onClick={() => setTab('appointments')} type="button">{t.all} <ArrowRight size={15} /></button>
                </div>
                {upcoming.length ? (
                  <div className="appointments-list">{upcoming.slice(0, 4).map(appointmentCard)}</div>
                ) : (
                  <div className="empty-state"><CalendarDays size={28} /><strong>No upcoming meetings</strong><span>Book a time with your school team whenever you need to.</span><button className="outline-button" onClick={() => startBooking()} type="button">Book a meeting</button></div>
                )}
              </section>
              <aside className="panel next-panel">
                <div className="panel-heading"><div><span className="eyebrow">STAY IN THE LOOP</span><h2>{t.next}</h2></div><span className="round-icon"><CalendarCheck size={19} /></span></div>
                {nextMeeting ? (
                  <button className="next-meeting" onClick={() => setSelected(nextMeeting)} type="button">
                    <span className="next-date">{formatDate(nextMeeting.date, language)} <i>·</i> {nextMeeting.time}</span>
                    <span className="next-person"><span className={`person-avatar ${getStaff(nextMeeting).color}`}>{getStaff(nextMeeting).initials}</span><span><strong>{getStaff(nextMeeting).name}</strong><small>{getStaff(nextMeeting).dept}</small></span></span>
                    <span className="next-topic">{nextMeeting.topic}</span>
                    <span className={`status status-${nextMeeting.status.toLowerCase()}`}>{statusLabel(nextMeeting.status)}</span>
                    <span className="next-link">See meeting details <ArrowRight size={15} /></span>
                  </button>
                ) : (
                  <p className="subtle-copy">Your next confirmed meeting will appear here.</p>
                )}
                <div className="family-note"><span className="note-symbol">“</span><span><strong>A good partnership starts with a conversation.</strong><small>We’re here to support your family and your child’s learning.</small></span></div>
              </aside>
            </div>
            <p className="demo-note"><ShieldCheck size={15} /> Demo data only. This prototype is not connected to the live school system.</p>
          </section>
        )}

        {tab === 'appointments' && (
          <section className="content-page">
            <div className="page-title-row">
              <div><span className="eyebrow">YOUR SCHOOL SCHEDULE</span><h1>{t.appointments}</h1><p>Keep track of requests, confirmations, and past meetings.</p></div>
              <button className="primary-button" onClick={() => startBooking()} type="button"><Plus size={18} /> {t.book}</button>
            </div>
            <div className="appointment-stats">
              <div><span>Total meetings</span><strong>{appointments.length}</strong></div>
              <div><span>Confirmed</span><strong>{appointments.filter((item) => item.status === 'Confirmed').length}</strong></div>
              <div><span>Awaiting response</span><strong>{appointments.filter((item) => item.status === 'Pending').length}</strong></div>
            </div>
            <div className="list-toolbar">
              <label className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.search} /></label>
              <div className="filter-row" role="group" aria-label="Filter appointments">
                {FILTERS.map((item) => <button className={filter === item ? 'filter-chip selected' : 'filter-chip'} key={item} onClick={() => setFilter(item)} type="button">{item === 'All' ? t.all : statusLabel(item)}</button>)}
              </div>
            </div>
            <div className="appointments-list full-list">
              {filteredAppointments.length ? filteredAppointments.map(appointmentCard) : <div className="empty-state"><Search size={26} /><strong>{t.noResults}</strong><span>Try another search or status filter.</span></div>}
            </div>
            <p className="demo-note"><ShieldCheck size={15} /> Sample appointments are stored on this device only.</p>
          </section>
        )}

        {tab === 'profile' && (
          <section className="content-page profile-page">
            <div className="page-title-row"><div><span className="eyebrow">YOUR ACCOUNT</span><h1>{t.profile}</h1><p>Manage your demo preferences and family details.</p></div></div>
            <div className="profile-layout">
              <section className="panel profile-summary"><span className="profile-avatar">FA</span><h2>Fatima Al-Harthy</h2><p>Parent account · IPS Oman</p><span className="profile-badge"><CheckCircle2 size={15} /> Demo profile</span></section>
              <section className="panel settings-panel">
                <div className="panel-heading"><div><span className="eyebrow">PREFERENCES</span><h2>{t.settings}</h2></div></div>
                <label className="setting-row"><span className="setting-icon"><Languages size={19} /></span><span className="setting-copy"><strong>{t.language}</strong><small>Choose your preferred display language</small></span><select value={language} onChange={(event) => setLanguage(event.target.value)}><option value="en">English</option><option value="ar">العربية</option></select></label>
                <label className="setting-row"><span className="setting-icon"><ShieldCheck size={19} /></span><span className="setting-copy"><strong>{t.role}</strong><small>Preview role-specific appointment actions</small></span><select value={role} onChange={(event) => setRole(event.target.value)}>{ROLES.map((item) => <option key={item}>{item}</option>)}</select></label>
                {role === 'School Administrator' ? (
                  <div className="permission-control">
                    <span className="permission-icon"><KeyRound size={19} /></span>
                    <span className="setting-copy"><strong>Teacher meeting access</strong><small>Allow parents to request meetings with teachers in this demo.</small><span className={teacherAccess ? 'permission-state granted' : 'permission-state restricted'}>{teacherAccess ? 'Enabled for this browser' : 'Restricted'}</span></span>
                    <button
                      aria-checked={teacherAccess}
                      aria-label={teacherAccess ? 'Revoke teacher meeting access' : 'Grant teacher meeting access'}
                      className={teacherAccess ? 'permission-toggle enabled' : 'permission-toggle'}
                      onClick={() => {
                        const nextAccess = !teacherAccess;
                        setTeacherAccess(nextAccess);
                        toast(nextAccess ? 'Teacher meeting access granted in this browser.' : 'Teacher meeting access revoked in this browser.');
                      }}
                      role="switch"
                      title={teacherAccess ? 'Revoke teacher meeting access' : 'Grant teacher meeting access'}
                      type="button"
                    ><span /></button>
                  </div>
                ) : (
                  <div className="permission-notice">
                    <LockKeyhole size={18} />
                    <span><strong>Teacher meetings require administrator permission</strong><small>{teacherAccess ? 'Enabled in this browser. Teacher meetings are available in the booking list.' : 'Restricted. Switch to the School Administrator demo role to manage access.'}</small></span>
                  </div>
                )}
                <div className="profile-hint"><ShieldCheck size={19} /><span><strong>Demo role preview — not secure sign-in</strong><small>Teacher access is remembered in this browser only. Switching roles or granting access only simulates permissions; real accounts and access must be enforced by the school server.</small></span></div>
                <button className="outline-button reset-button" onClick={() => { setAppointments(SAMPLE_APPOINTMENTS); toast('Sample appointments restored.'); }} type="button"><RotateCcw size={17} /> Reset demo appointments</button>
              </section>
            </div>
          </section>
        )}
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.slice(0, 2).map(({ id, label, icon: Icon }) => <button className={tab === id ? 'mobile-nav-item active' : 'mobile-nav-item'} key={id} onClick={() => setTab(id)} type="button"><Icon size={20} /><span>{isArabic ? t[id] : label}</span></button>)}
        <button className="mobile-book" onClick={() => startBooking()} type="button"><Plus size={21} /><span>Book</span></button>
        <button className={tab === 'profile' ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => setTab('profile')} type="button"><Users size={20} /><span>{isArabic ? t.profile : 'Profile'}</span></button>
      </nav>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <section className="detail-dialog" onClick={(event) => event.stopPropagation()}>
            <div className="dialog-heading"><div><span className="eyebrow">{selected.id}</span><h2>Meeting details</h2></div><button className="icon-button close-button" onClick={() => setSelected(null)} aria-label="Close details" type="button"><X size={20} /></button></div>
            <div className="detail-person"><span className={`person-avatar large ${getStaff(selected).color}`}>{getStaff(selected).initials}</span><span><strong>{getStaff(selected).name}</strong><small>{getStaff(selected).dept}</small></span><span className={`status status-${selected.status.toLowerCase()}`}>{statusLabel(selected.status)}</span></div>
            <div className="detail-grid">
              <div><CalendarDays size={18} /><span><small>{t.date}</small><strong>{formatDate(selected.date, language)}</strong></span></div>
              <div><Clock3 size={18} /><span><small>{t.time}</small><strong>{selected.time}</strong></span></div>
              <div>{selected.format === 'Online' ? <Video size={18} /> : <MapPin size={18} />}<span><small>{t.format}</small><strong>{selected.format === 'Online' ? t.online : t.inPerson}</strong></span></div>
              <div><GraduationCap size={18} /><span><small>{t.student}</small><strong>{selected.child}</strong></span></div>
            </div>
            <div className="detail-topic"><small>{t.reason}</small><strong>{selected.topic}</strong>{selected.notes && <p>{selected.notes}</p>}</div>
            {selected.status === 'Pending' && (role === 'School Administrator' || getStaff(selected).role === role) && <div className="dialog-actions"><button className="primary-button" onClick={() => updateAppointment(selected.id, { status: 'Confirmed' })} type="button"><Check size={17} /> Approve request</button><button className="outline-button" onClick={() => updateAppointment(selected.id, { status: 'Declined' })} type="button">Decline</button></div>}
            {selected.status === 'Confirmed' && role === 'Receptionist' && <button className="primary-button full-button" onClick={() => updateAppointment(selected.id, { status: 'Completed' })} type="button"><CheckCircle2 size={17} /> Check in</button>}
            {['Pending', 'Confirmed'].includes(selected.status) && <div className="dialog-actions"><button className="outline-button" onClick={() => startBooking(selected)} type="button"><RotateCcw size={16} /> Reschedule</button><button className="danger-button" onClick={() => { if (window.confirm('Cancel this appointment?')) updateAppointment(selected.id, { status: 'Cancelled' }); }} type="button">Cancel appointment</button></div>}
          </section>
        </div>
      )}

      {booking && (
        <div className="overlay booking-overlay" onClick={(event) => { if (event.target === event.currentTarget) setBooking(null); }}>
          <section className="booking-dialog" role="dialog" aria-modal="true" aria-label={booking === 'reschedule' ? 'Reschedule meeting' : 'Book a meeting'}>
            <header className="booking-heading">
              <div className="booking-title-mark"><img src="/ips-crest.png" alt="" /></div>
              <div><span className="eyebrow">IPS OMAN · SCHOOL CONNECT</span><h2>{booking === 'reschedule' ? 'Reschedule meeting' : t.new}</h2></div>
              <button className="icon-button close-button" onClick={() => setBooking(null)} aria-label="Close booking" type="button"><X size={20} /></button>
            </header>
            {booking === 'success' ? (
              <div className="success-state"><span className="success-check"><Check size={32} /></span><h2>{t.success}</h2><p>Your request has been saved. The school will review it and update your appointment status.</p><button className="primary-button" onClick={() => { setBooking(null); setTab('appointments'); }} type="button">View my appointments <ArrowRight size={16} /></button></div>
            ) : (
              <>
                <div className="step-track"><span style={{ width: `${(step / 3) * 100}%` }} /></div>
                <div className="step-labels"><span className={step >= 1 ? 'current' : ''}>1. Staff</span><span className={step >= 2 ? 'current' : ''}>2. Session</span><span className={step >= 3 ? 'current' : ''}>3. Review</span></div>
                <div className="booking-content">
                  {step === 1 && <div className="booking-step"><span className="eyebrow">CHOOSE YOUR CONTACT · IN ORDER</span><h3>{t.selectStaff}</h3><p>Browse school contacts in sequence. Teacher meetings require School Administrator permission.</p><div className="staff-groups">{STAFF_GROUPS.map((group) => { const Icon = group.icon; const members = STAFF.filter((member) => group.roles.includes(member.role)); return <section className="staff-group" key={group.number}><div className="staff-group-heading"><span className="staff-group-number">{group.number}</span><span className="staff-group-icon"><Icon size={16} /></span><strong>{group.title}</strong>{group.roles.includes('Teacher') && !canBookTeacher && <span className="group-lock"><LockKeyhole size={13} /> Admin access</span>}</div><div className="staff-grid">{members.map((member) => { const locked = member.role === 'Teacher' && !canBookTeacher; return <button aria-disabled={locked} className={`staff-choice${form.staffId === member.id ? ' selected' : ''}${locked ? ' locked' : ''}`} disabled={locked} key={member.id} onClick={() => chooseStaff(member.id)} title={locked ? 'Ask the School Administrator to grant access to teacher meetings.' : undefined} type="button"><span className={`person-avatar ${member.color}`}>{member.initials}</span><span><strong>{member.name}</strong><small>{member.dept}</small></span><span className="staff-check">{locked ? <LockKeyhole size={17} /> : form.staffId === member.id ? <CheckCircle2 size={20} /> : <ChevronRight size={18} />}</span></button>; })}</div></section>; })}</div></div>}
                  {step === 2 && <div className="booking-step"><span className="eyebrow">PICK A CONVENIENT TIME</span><h3>{t.details}</h3><p>Choose a date and an open session. Booked times are unavailable.</p>
                    <div className="form-grid"><label>{t.student}<select value={form.child} onChange={(event) => setForm((current) => ({ ...current, child: event.target.value }))}><option>Adam</option><option>Maya</option></select></label><label>{t.date}<input type="date" min={localDate()} value={form.date} onChange={(event) => chooseDate(event.target.value)} /></label></div>
                    <label className="field-label">{t.available}<span className="field-hint">{form.staffId ? `${availableSlots.length} sessions open` : 'Choose a staff member first'}</span></label>
                    <div className="time-grid">{TIME_SLOTS.map((time) => { const busy = !form.staffId || isSlotTaken(form.staffId, form.date, time, form.id); return <button className={form.time === time ? 'time-choice selected' : 'time-choice'} disabled={busy} key={time} onClick={() => setForm((current) => ({ ...current, time }))} type="button"><Clock3 size={15} />{time}{busy && <small>{t.booked}</small>}</button>; })}</div>
                    {form.staffId && availableSlots.length === 0 && <p className="availability-warning">No sessions remain on this date. Choose another date to see more availability.</p>}
                    <label className="field-label">{t.format}</label><div className="format-options"><button className={form.format === 'In person' ? 'format-choice selected' : 'format-choice'} onClick={() => setForm((current) => ({ ...current, format: 'In person' }))} type="button"><MapPin size={17} /> {t.inPerson}</button><button className={form.format === 'Online' ? 'format-choice selected' : 'format-choice'} onClick={() => setForm((current) => ({ ...current, format: 'Online' }))} type="button"><Video size={17} /> {t.online}</button></div>
                    <label className="field-label">Meeting reason<select value={form.topic} onChange={(event) => setForm((current) => ({ ...current, topic: event.target.value }))}><option>Academic progress</option><option>Learning support</option><option>School feedback</option><option>Admissions consultation</option><option>Counseling</option><option>Fee inquiry</option><option>Other</option></select></label>
                    <label className="field-label">Additional notes <textarea rows="3" placeholder="Share anything that may help us prepare (optional)" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} /></label>
                  </div>}
                  {step === 3 && <div className="booking-step"><span className="eyebrow">ONE LAST LOOK</span><h3>{t.review}</h3><p>Check your meeting details before sending the request.</p><div className="review-card"><div className="detail-person"><span className={`person-avatar large ${getStaff(form).color}`}>{getStaff(form).initials}</span><span><strong>{getStaff(form).name}</strong><small>{getStaff(form).dept}</small></span></div><div className="review-line"><span>{t.student}</span><strong>{form.child}</strong></div><div className="review-line"><span>{t.date}</span><strong>{formatDate(form.date, language)}</strong></div><div className="review-line"><span>{t.time}</span><strong>{form.time}</strong></div><div className="review-line"><span>{t.format}</span><strong>{form.format === 'Online' ? t.online : t.inPerson}</strong></div><div className="review-line"><span>{t.reason}</span><strong>{form.topic}</strong></div>{form.notes && <div className="review-line"><span>{t.notes}</span><strong>{form.notes}</strong></div>}</div><div className="demo-warning"><ShieldCheck size={18} /><span>Demo request only. Availability is checked against appointments saved in this browser.</span></div></div>}
                </div>
                <footer className="booking-footer">
                  {step > 1 && <button className="outline-button" onClick={() => setStep((current) => current - 1)} type="button"><ArrowLeft size={16} /> Back</button>}
                  <button className="primary-button" disabled={(step === 1 && !form.staffId) || (step === 2 && (!form.date || !form.time || isSlotTaken(form.staffId, form.date, form.time, form.id)))} onClick={() => { if (step < 3) setStep((current) => current + 1); else saveAppointment(); }} type="button">{step === 3 ? (booking === 'reschedule' ? 'Save changes' : t.send) : t.continue}<ArrowRight size={16} /></button>
                </footer>
              </>
            )}
          </section>
        </div>
      )}

      {notice && <div className="toast" role="status"><CheckCircle2 size={18} />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification" type="button"><X size={15} /></button></div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
