import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Coffee, LogOut } from 'lucide-react';
import { useAttendanceStore } from '../../store/attendanceStore';
import { useAuthStore } from '../../store/authStore';

const STATUS_INFO = {
  present:  { label: 'Present',   color: '#22c55e', bg: '#f0fdf4' },
  absent:   { label: 'Absent',    color: '#ef4444', bg: '#fef2f2' },
  late:     { label: 'Late',      color: '#f59e0b', bg: '#fffbeb' },
  half_day: { label: 'Half Day',  color: '#0891b2', bg: '#eff6ff' },
  wfh:      { label: 'WFH',       color: '#7c3aed', bg: '#f5f3ff' },
};

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function AttendancePage() {
  const { currentUser } = useAuthStore();
  const { checkIn, checkOut, startBreak, endBreak, breakStarted, getTodayRecord, getUserRecords, getMonthStats } = useAttendanceStore();
  const [time, setTime] = useState(new Date());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const todayRecord = getTodayRecord(currentUser?.id);
  const allRecords = getUserRecords(currentUser?.id);
  const stats = getMonthStats(currentUser?.id);

  // Build calendar
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const getRecordForDay = (day) => {
    if (!day) return null;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return allRecords.find(r => r.date === dateStr);
  };

  const today = new Date();

  return (
    <div className="animate-fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        {/* Check-in Widget */}
        <div className="col-span-4">
          <div className="checkin-widget">
            <div className="checkin-clock">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div style={{ opacity: 0.7, marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>

            {!todayRecord ? (
              <button className="btn btn-lg" style={{ width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)' }}
                onClick={() => checkIn(currentUser?.id)}>
                <CheckCircle size={18} /> Check In
              </button>
            ) : !todayRecord.checkOut ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.875rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.25rem' }}>Checked in at</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{todayRecord.checkIn}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'capitalize' }}>{todayRecord.status}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button style={{ padding: '0.625rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, cursor: 'pointer', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}
                    onClick={() => breakStarted ? endBreak() : startBreak()}>
                    <Coffee size={14} />
                    {breakStarted ? 'End Break' : 'Take Break'}
                  </button>
                  <button style={{ padding: '0.625rem', background: 'rgba(239,68,68,0.3)', color: '#fff', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, cursor: 'pointer', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}
                    onClick={() => checkOut(currentUser?.id)}>
                    <LogOut size={14} /> Check Out
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '1rem', textAlign: 'center' }}>
                <CheckCircle size={28} style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Day Complete!</div>
                <div style={{ fontSize: '0.8125rem', opacity: 0.8 }}>{todayRecord.checkIn} → {todayRecord.checkOut}</div>
              </div>
            )}
          </div>

          {/* Monthly Stats */}
          <div className="card mt-4">
            <div className="card-header"><span className="card-title">This Month</span></div>
            <div className="card-body">
              {[
                { label: 'Present Days', value: stats.present, color: '#22c55e' },
                { label: 'WFH Days', value: stats.wfh, color: '#7c3aed' },
                { label: 'Late Arrivals', value: stats.late, color: '#f59e0b' },
                { label: 'Absent Days', value: stats.absent, color: '#ef4444' },
                { label: 'Half Days', value: stats.halfDay, color: '#0891b2' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
                    {s.label}
                  </div>
                  <span style={{ fontWeight: 700, color: s.color, fontSize: '1.125rem' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="card col-span-8">
          <div className="card-header">
            <span className="card-title">Attendance Calendar</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => {
                if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
                else setViewMonth(m => m - 1);
              }}>‹</button>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-700)', minWidth: 130, textAlign: 'center' }}>
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => {
                if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
                else setViewMonth(m => m + 1);
              }}>›</button>
            </div>
          </div>
          <div className="card-body">
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: '0.5rem' }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-400)', padding: '0.25rem' }}>{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="calendar-grid">
              {calendarDays.map((day, i) => {
                const record = getRecordForDay(day);
                const isToday = day && today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
                const isFuture = day && new Date(viewYear, viewMonth, day) > today;
                const statusInfo = record ? STATUS_INFO[record.type === 'wfh' ? 'wfh' : record.status] : null;

                return (
                  <div key={i} className={`calendar-day ${isToday ? 'today' : ''}`}
                    style={{
                      background: isToday ? 'var(--primary-600)' : statusInfo ? statusInfo.bg : 'transparent',
                      color: isToday ? '#fff' : statusInfo ? statusInfo.color : isFuture ? 'var(--gray-200)' : !day ? 'transparent' : 'var(--gray-500)',
                      fontWeight: isToday ? 700 : record ? 600 : 400,
                      position: 'relative',
                      flexDirection: 'column',
                      gap: '2px',
                      cursor: record ? 'pointer' : 'default',
                    }}>
                    {day && <span>{day}</span>}
                    {record && !isToday && (
                      <div style={{ fontSize: '0.55rem', fontWeight: 600, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        {record.type === 'wfh' ? 'WFH' : record.status?.slice(0,3)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              {Object.entries(STATUS_INFO).map(([key, info]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: info.bg, border: `1px solid ${info.color}` }} />
                  {info.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Records Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Attendance Records</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {allRecords.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>No records yet</td></tr>
              ) : allRecords.map(r => {
                const statusInfo = STATUS_INFO[r.type === 'wfh' ? 'wfh' : r.status];
                let duration = '—';
                if (r.checkIn && r.checkOut) {
                  const [ih, im] = r.checkIn.split(':').map(Number);
                  const [oh, om] = r.checkOut.split(':').map(Number);
                  const mins = (oh * 60 + om) - (ih * 60 + im);
                  duration = `${Math.floor(mins/60)}h ${mins%60}m`;
                } else if (r.checkIn) {
                  duration = 'In progress';
                }
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500, color: 'var(--gray-900)' }}>
                      {new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td>{r.checkIn || '—'}</td>
                    <td>{r.checkOut || '—'}</td>
                    <td style={{ color: 'var(--gray-600)' }}>{duration}</td>
                    <td>
                      {statusInfo && (
                        <span style={{ padding: '0.25rem 0.625rem', background: statusInfo.bg, color: statusInfo.color, borderRadius: 20, fontSize: '0.75rem', fontWeight: 500 }}>
                          {statusInfo.label}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-gray">{r.type === 'wfh' ? 'Work from Home' : 'Office'}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
