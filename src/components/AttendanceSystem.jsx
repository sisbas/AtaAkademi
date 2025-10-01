import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Calendar, Users, Save, Download, Trash2 } from 'lucide-react';

const AttendanceSystem = () => {
  const [classes] = useState([
    { id: 'tyt', name: 'TYT Sınıfı', schedule: { cumartesi: 6, pazar: 4 } },
    { id: '9', name: '9. Sınıf', schedule: { cumartesi: 4, pazar: 4 } },
    { id: '10', name: '10. Sınıf', schedule: { salı: 4, perşembe: 4 } },
    { id: '11-say-1', name: '11 Say 1', schedule: {} },
    { id: '11-say-2', name: '11 Say 2', schedule: {} },
    { id: '11-ea-1', name: '11 Ea 1', schedule: {} },
    { id: '11-ea-2', name: '11 Ea 2', schedule: {} },
    { id: '12-say-1', name: '12 Say 1', schedule: { salı: 4, perşembe: 4, cumartesi: 6, pazar: 6 } },
    { id: '12-say-2', name: '12 Say 2', schedule: { salı: 4, perşembe: 4, cumartesi: 6, pazar: 6 } },
    { id: '12-say-3', name: '12 Say 3', schedule: { salı: 4, perşembe: 4, cumartesi: 6, pazar: 6 } },
    { id: '12-ea-1', name: '12 Ea 1', schedule: { salı: 4, perşembe: 4, cumartesi: 6, pazar: 6 } },
    { id: '12-ea-2', name: '12 Ea 2', schedule: { salı: 4, perşembe: 4, cumartesi: 6, pazar: 6 } },
    { id: '12-ea-3', name: '12 Ea 3', schedule: { salı: 4, perşembe: 4, cumartesi: 6, pazar: 6 } },
    { id: 'mezun-ea-1', name: 'Mezun Ea 1', schedule: { pazartesi: 6, salı: 6, perşembe: 6, cuma: 6 } },
    { id: 'mezun-ea-2', name: 'Mezun Ea 2', schedule: { pazartesi: 6, salı: 6, perşembe: 6, cuma: 6 } },
    { id: 'mezun-ea-3', name: 'Mezun Ea 3', schedule: { pazartesi: 6, salı: 6, perşembe: 6, cuma: 6 } },
    { id: 'mezun-say-1', name: 'Mezun Say 1', schedule: { pazartesi: 6, salı: 6, perşembe: 6, cuma: 6 } },
    { id: 'mezun-say-2', name: 'Mezun Say 2', schedule: { pazartesi: 6, salı: 6, perşembe: 6, cuma: 6 } },
    { id: 'mezun-say-3', name: 'Mezun Say 3', schedule: { pazartesi: 6, salı: 6, perşembe: 6, cuma: 6 } }
  ]);

  const [students, setStudents] = useState({});
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [savedRecords, setSavedRecords] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('yoklama');
  const [newStudentName, setNewStudentName] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('ata-akademi-data');
    if (stored) {
      const data = JSON.parse(stored);
      setStudents(data.students || {});
      setSavedRecords(data.records || {});
    }
  }, []);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      const key = `${selectedClass}-${selectedDate}`;
      const record = savedRecords[key];
      if (record) {
        setAttendance(record);
        setMessage({ type: 'info', text: 'Bu tarih için kayıtlı yoklama yüklendi.' });
      } else {
        setAttendance({});
        setMessage({ type: '', text: '' });
      }
    }
  }, [selectedClass, selectedDate, savedRecords]);

  const saveToStorage = (studentsData, recordsData) => {
    localStorage.setItem('ata-akademi-data', JSON.stringify({
      students: studentsData,
      records: recordsData
    }));
  };

  const getLessonCount = () => {
    const cls = classes.find(c => c.id === selectedClass);
    if (!cls) return 0;
    const date = new Date(selectedDate + 'T00:00:00');
    const dayNames = ['pazar', 'pazartesi', 'salı', 'çarşamba', 'perşembe', 'cuma', 'cumartesi'];
    return cls.schedule[dayNames[date.getDay()]] || 0;
  };

  const handleAttendanceChange = (studentId, lessonNumber, status) => {
    setAttendance(prev => ({
      ...prev,
      [`${studentId}-${lessonNumber}`]: status
    }));
  };

  const saveAttendance = () => {
    const key = `${selectedClass}-${selectedDate}`;
    const lessonCount = getLessonCount();
    
    if (lessonCount === 0) {
      setMessage({ type: 'error', text: 'Bu sınıfın bu gün için ders programı yok!' });
      return;
    }

    const newRecords = { ...savedRecords, [key]: { ...attendance } };
    setSavedRecords(newRecords);
    saveToStorage(students, newRecords);
    setMessage({ type: 'success', text: 'Yoklama kaydedildi!' });
  };

  const addStudent = () => {
    if (!newStudentName.trim() || !selectedClass) return;
    const newStudents = { ...students };
    if (!newStudents[selectedClass]) newStudents[selectedClass] = [];
    newStudents[selectedClass].push({
      id: `${selectedClass}-${Date.now()}`,
      name: newStudentName.trim()
    });
    setStudents(newStudents);
    saveToStorage(newStudents, savedRecords);
    setNewStudentName('');
    setMessage({ type: 'success', text: 'Öğrenci eklendi!' });
  };

  const removeStudent = (studentId) => {
    if (!confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) return;
    const newStudents = { ...students };
    newStudents[selectedClass] = newStudents[selectedClass].filter(s => s.id !== studentId);
    setStudents(newStudents);
    saveToStorage(newStudents, savedRecords);
    setMessage({ type: 'success', text: 'Öğrenci silindi!' });
  };

  const downloadCSV = () => {
    const classStudents = students[selectedClass] || [];
    const className = classes.find(c => c.id === selectedClass)?.name || selectedClass;
    const lessonCount = getLessonCount();

    let csv = `Sınıf:,${className}\nTarih:,${selectedDate}\n\n`;
    csv += 'Öğrenci Adı,' + Array.from({ length: lessonCount }, (_, i) => `${i + 1}. Ders`).join(',') + '\n';

    classStudents.forEach(student => {
      const row = [student.name];
      for (let i = 1; i <= lessonCount; i++) {
        row.push(attendance[`${student.id}-${i}`] || '-');
      }
      csv += row.join(',') + '\n';
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Yoklama_${className}_${selectedDate}.csv`;
    link.click();
  };

  const getAbsenceLimit = (classId) => {
    if (classId.startsWith('12-') || classId.startsWith('mezun-')) {
      return { excused: 20, unexcused: 20, total: 40 };
    }
    return { excused: 10, unexcused: 10, total: 20 };
  };

  const calculateStudentStats = (studentId, classId) => {
    let totalLessons = 0, attended = 0, absent = 0, excused = 0, onLeave = 0;

    Object.keys(savedRecords).forEach(recordKey => {
      if (recordKey.startsWith(classId)) {
        const record = savedRecords[recordKey];
        Object.keys(record).forEach(key => {
          if (key.startsWith(studentId)) {
            totalLessons++;
            const status = record[key];
            if (status === 'geldi') attended++;
            else if (status === 'gelmedi') absent++;
            else if (status === 'mazeretli') excused++;
            else if (status === 'izinli') onLeave++;
          }
        });
      }
    });

    const attendanceRate = totalLessons > 0 ? (attended / totalLessons) * 100 : 0;
    return { totalLessons, attended, absent, excused, onLeave, attendanceRate };
  };

  const calculateClassStats = (classId) => {
    const classStudents = students[classId] || [];
    if (classStudents.length === 0) return null;

    let totalAttendance = 0, studentCount = 0;
    classStudents.forEach(student => {
      const stats = calculateStudentStats(student.id, classId);
      if (stats.totalLessons > 0) {
        totalAttendance += stats.attendanceRate;
        studentCount++;
      }
    });
    return studentCount > 0 ? totalAttendance / studentCount : 0;
  };

  const getStudentStatus = (studentId, classId) => {
    const stats = calculateStudentStats(studentId, classId);
    const limits = getAbsenceLimit(classId);
    const totalAbsences = stats.absent + stats.excused;

    if (stats.absent >= limits.unexcused || stats.excused >= limits.excused || totalAbsences >= limits.total) {
      return { status: 'critical', color: 'border border-rose-400/40 bg-rose-500/20', textColor: 'text-rose-200' };
    }
    if (stats.absent >= limits.unexcused * 0.8 || stats.excused >= limits.excused * 0.8 || totalAbsences >= limits.total * 0.8) {
      return { status: 'warning', color: 'border border-amber-400/40 bg-amber-500/20', textColor: 'text-amber-200' };
    }
    return { status: 'normal', color: 'border border-emerald-400/20 bg-emerald-500/10', textColor: 'text-emerald-200' };
  };

  const getStatusColor = (status) => {
    const colors = {
      'geldi': 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400',
      'gelmedi': 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400',
      'mazeretli': 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400',
      'izinli': 'bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400'
    };
    return colors[status] || 'bg-white/10 hover:bg-white/20';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'geldi': <Check className="w-4 h-4" />,
      'gelmedi': <X className="w-4 h-4" />,
      'mazeretli': <AlertCircle className="w-4 h-4" />,
      'izinli': <Calendar className="w-4 h-4" />
    };
    return icons[status] || null;
  };

  const classStudents = students[selectedClass] || [];
  const lessonCount = getLessonCount();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-12 px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute top-1/2 -right-16 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 bg-white/10 p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-500/20 p-3 text-indigo-200">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">Ata Akademi</p>
                  <h1 className="text-3xl font-bold text-white">Yoklama ve Devamsızlık Sistemi</h1>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-indigo-100/80">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <Calendar className="h-4 w-4" />
                  <span>Günlük kayıt takibi</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <Users className="h-4 w-4" />
                  <span>Sınıf bazlı yönetim</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-indigo-100/80">
                <AlertCircle className="h-4 w-4" />
                <span>Veriler tarayıcınızda saklanır</span>
              </div>
              <div className="flex gap-2">
                {['yoklama', 'raporlar', 'yukle'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`group relative overflow-hidden rounded-full px-5 py-2 text-sm font-medium transition-all ${
                      activeTab === tab
                        ? 'text-white shadow-lg shadow-indigo-500/30'
                        : 'text-indigo-100/70 hover:text-white'
                    }`}
                  >
                    <span
                      className={`absolute inset-0 -z-10 rounded-full transition-all ${
                        activeTab === tab
                          ? 'bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500'
                          : 'bg-white/10 group-hover:bg-white/15'
                      }`}
                    />
                    {tab === 'yoklama' ? 'Yoklama Gir' : tab === 'raporlar' ? 'Raporlar' : 'Öğrenci Yönetimi'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 border-b border-white/10 bg-white/5 p-8 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-indigo-100">Sınıf Seçin</label>
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/40 py-3 pl-4 pr-10 text-indigo-100 shadow-inner shadow-black/20 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                >
                  <option value="">Sınıf seçiniz...</option>
                  {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
                </select>
                <Users className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-200" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-indigo-100">Tarih Seçin</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-indigo-100 shadow-inner shadow-black/20 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>
          </div>

          {message.text && (
            <div className="border-b border-white/10 bg-white/5 p-8">
              <div
                className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-medium shadow-lg ${
                  message.type === 'success'
                    ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                    : message.type === 'error'
                    ? 'border-rose-400/40 bg-rose-500/10 text-rose-100'
                    : message.type === 'warning'
                    ? 'border-amber-400/40 bg-amber-500/10 text-amber-100'
                    : 'border-sky-400/40 bg-sky-500/10 text-sky-100'
                }`}
              >
                <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                  {message.type === 'success' ? <Check className="h-4 w-4" /> :
                  message.type === 'error' ? <X className="h-4 w-4" /> :
                  message.type === 'warning' ? <AlertCircle className="h-4 w-4" /> :
                  <Calendar className="h-4 w-4" />}
                </span>
                <p>{message.text}</p>
              </div>
            </div>
          )}

          {activeTab === 'yoklama' && selectedClass && classStudents.length > 0 && lessonCount > 0 && (
            <div className="space-y-6 bg-white/5 p-8">
              <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/30 p-5 text-indigo-100 shadow-inner shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/60">Sınıf Özeti</p>
                  <p className="text-lg font-semibold text-white">{classStudents.length} öğrenci • {lessonCount} ders</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={downloadCSV}
                    className="flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-400 hover:bg-emerald-400/30"
                  >
                    <Download className="h-4 w-4" /> CSV İndir
                  </button>
                  <button
                    onClick={saveAttendance}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-400 hover:via-sky-400 hover:to-purple-400"
                  >
                    <Save className="h-4 w-4" /> Yoklamayı Kaydet
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-[0.2em] text-indigo-200/70">
                      <th className="rounded-l-xl bg-slate-900/60 px-4 py-3 font-semibold">Öğrenci Adı</th>
                      {Array.from({ length: lessonCount }, (_, i) => (
                        <th key={i} className={`${i === lessonCount - 1 ? 'rounded-r-xl' : ''} bg-slate-900/60 px-4 py-3 text-center font-semibold`}>{i + 1}. Ders</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map(student => (
                      <tr key={student.id} className="text-sm text-indigo-100">
                        <td className="rounded-l-xl bg-white/5 px-4 py-3 font-medium text-white shadow-lg shadow-black/20 backdrop-blur">
                          {student.name}
                        </td>
                        {Array.from({ length: lessonCount }, (_, i) => {
                          const key = `${student.id}-${i + 1}`;
                          const currentStatus = attendance[key] || '';
                          return (
                            <td key={i} className={`${i === lessonCount - 1 ? 'rounded-r-xl' : ''} bg-white/5 px-2 py-3 shadow-lg shadow-black/20 backdrop-blur`}
                            >
                              <div className="flex justify-center gap-2">
                                {['geldi', 'gelmedi', 'mazeretli', 'izinli'].map(status => (
                                  <button
                                    key={status}
                                    onClick={() => handleAttendanceChange(student.id, i + 1, status)}
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                                      currentStatus === status
                                        ? getStatusColor(status) + ' text-white shadow-lg shadow-black/30'
                                        : 'bg-white/10 text-indigo-100/60 hover:bg-white/20 hover:text-white'
                                    }`}
                                  >
                                    {getStatusIcon(status)}
                                  </button>
                                ))}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'yoklama' && (!selectedClass || classStudents.length === 0 || lessonCount === 0) && (
            <div className="border-b border-white/10 bg-white/5 p-12 text-center text-indigo-100">
              <div className="mx-auto max-w-md space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-indigo-200">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Yoklama almak için seçim yapın</h3>
                <p className="text-sm text-indigo-100/70">
                  {selectedClass
                    ? 'Bu sınıf için seçilen tarihte ders bulunmuyor veya öğrenci listesi boş.'
                    : 'Öncelikle üst kısımdan sınıf ve tarih seçerek yoklamayı başlatabilirsiniz.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'raporlar' && (
            <div className="space-y-8 bg-white/5 p-8 text-indigo-100">
              <div className="rounded-2xl border border-sky-400/40 bg-sky-500/10 p-5 text-sm shadow-lg shadow-sky-900/30">
                <strong className="text-white">Devamsızlık Hakları:</strong> 9-10-11: 10+10 | 12-Mezun: 20+20{' '}
                <strong className="text-white">| Sıfırlama:</strong> 16 Ocak 2026
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white">Sınıf Devamlılık İstatistikleri</h2>
                <p className="mt-1 text-sm text-indigo-100/70">Sınıfların ortalama devam yüzdeleri ve durumları.</p>
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  {classes.map(cls => {
                    const stats = calculateClassStats(cls.id);
                    if (stats === null) return null;
                    return (
                      <div key={cls.id} className="group rounded-2xl border border-white/10 bg-slate-900/40 p-5 shadow-lg shadow-black/20 transition hover:border-indigo-400/60">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">{cls.name}</h3>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-indigo-100/70">ortalama</span>
                        </div>
                        <div className="mt-4 text-3xl font-bold text-indigo-200">{stats.toFixed(1)}%</div>
                        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500" style={{ width: `${Math.min(stats, 100)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedClass && classStudents.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold text-white">Öğrenci Devamsızlık Raporu</h2>
                  <p className="mt-1 text-sm text-indigo-100/70">Öğrencilerin ders bazlı yoklama performansları.</p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full border-separate border-spacing-y-2 text-sm">
                      <thead className="text-xs uppercase tracking-[0.3em] text-indigo-200/70">
                        <tr>
                          <th className="rounded-l-xl bg-slate-900/60 px-4 py-3 text-left font-semibold">Öğrenci</th>
                          <th className="bg-slate-900/60 px-4 py-3 text-center font-semibold">Toplam</th>
                          <th className="bg-slate-900/60 px-4 py-3 text-center font-semibold">Geldi</th>
                          <th className="bg-slate-900/60 px-4 py-3 text-center font-semibold">Gelmedi</th>
                          <th className="bg-slate-900/60 px-4 py-3 text-center font-semibold">Mazeretli</th>
                          <th className="bg-slate-900/60 px-4 py-3 text-center font-semibold">Devam %</th>
                          <th className="rounded-r-xl bg-slate-900/60 px-4 py-3 text-center font-semibold">Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classStudents.map(student => {
                          const stats = calculateStudentStats(student.id, selectedClass);
                          const statusInfo = getStudentStatus(student.id, selectedClass);
                          const limits = getAbsenceLimit(selectedClass);
                          return (
                            <tr key={student.id} className="text-indigo-100">
                              <td className={`rounded-l-xl px-4 py-3 font-medium shadow-lg shadow-black/20 backdrop-blur ${statusInfo.color}`}>{student.name}</td>
                              <td className={`${statusInfo.color} px-4 py-3 text-center shadow-lg shadow-black/20 backdrop-blur`}>{stats.totalLessons}</td>
                              <td className={`${statusInfo.color} px-4 py-3 text-center font-semibold text-emerald-200 shadow-lg shadow-black/20 backdrop-blur`}>{stats.attended}</td>
                              <td className={`${statusInfo.color} px-4 py-3 text-center font-semibold text-rose-200 shadow-lg shadow-black/20 backdrop-blur`}>{stats.absent}/{limits.unexcused}</td>
                              <td className={`${statusInfo.color} px-4 py-3 text-center font-semibold text-amber-200 shadow-lg shadow-black/20 backdrop-blur`}>{stats.excused}/{limits.excused}</td>
                              <td className={`${statusInfo.color} px-4 py-3 text-center font-semibold text-white shadow-lg shadow-black/20 backdrop-blur`}>{stats.attendanceRate.toFixed(1)}%</td>
                              <td className={`rounded-r-xl px-4 py-3 text-center text-lg shadow-lg shadow-black/20 backdrop-blur ${statusInfo.textColor}`}>
                                {statusInfo.status === 'critical' ? '🔴' : statusInfo.status === 'warning' ? '⚠️' : '✅'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {(!selectedClass || classStudents.length === 0) && (
                <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-12 text-center text-indigo-100">
                  <Users className="mx-auto h-12 w-12 text-indigo-200" />
                  <h3 className="mt-4 text-xl font-semibold text-white">Rapor görüntülemek için sınıf seçin</h3>
                  <p className="mt-2 text-sm text-indigo-100/70">Sınıf seçtikten sonra öğrencilerin geçmiş yoklama bilgilerini inceleyebilirsiniz.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'yukle' && (
            <div className="space-y-6 bg-white/5 p-8">
              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-5 shadow-inner shadow-black/20 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addStudent()}
                    placeholder={selectedClass ? 'Öğrenci adı girin...' : 'Önce sınıf seçiniz'}
                    disabled={!selectedClass}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/40 p-3 text-indigo-100 placeholder:text-indigo-200/40 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.4em] text-indigo-200/40">Yeni</span>
                </div>
                <button
                  onClick={addStudent}
                  disabled={!selectedClass || !newStudentName.trim()}
                  className="rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-400 hover:via-sky-400 hover:to-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Öğrenciyi Ekle
                </button>
              </div>

              {classStudents.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 shadow-inner shadow-black/20">
                  <div className="flex items-center justify-between text-indigo-100">
                    <p className="text-lg font-semibold text-white">Kayıtlı Öğrenciler</p>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-indigo-100/70">{classStudents.length} öğrenci</span>
                  </div>
                  <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
                    {classStudents.map((student, idx) => (
                      <div key={student.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-indigo-100 shadow-lg shadow-black/20">
                        <span className="font-medium text-white">{idx + 1}. {student.name}</span>
                        <button
                          onClick={() => removeStudent(student.id)}
                          className="flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-100 transition hover:border-rose-400 hover:bg-rose-400/30"
                        >
                          <Trash2 className="h-4 w-4" /> Sil
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceSystem;
