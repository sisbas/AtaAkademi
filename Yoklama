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
      return { status: 'critical', color: 'bg-red-100 border-red-500', textColor: 'text-red-800' };
    }
    if (stats.absent >= limits.unexcused * 0.8 || stats.excused >= limits.excused * 0.8 || totalAbsences >= limits.total * 0.8) {
      return { status: 'warning', color: 'bg-yellow-100 border-yellow-500', textColor: 'text-yellow-800' };
    }
    return { status: 'normal', color: 'bg-green-50 border-green-200', textColor: 'text-green-800' };
  };

  const getStatusColor = (status) => {
    const colors = {
      'geldi': 'bg-green-500 hover:bg-green-600',
      'gelmedi': 'bg-red-500 hover:bg-red-600',
      'mazeretli': 'bg-yellow-500 hover:bg-yellow-600',
      'izinli': 'bg-blue-500 hover:bg-blue-600'
    };
    return colors[status] || 'bg-gray-300 hover:bg-gray-400';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Ata Akademi Yoklama Sistemi</h1>
          </div>

          <div className="flex gap-4 mb-6 border-b">
            {['yoklama', 'raporlar', 'yukle'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'yoklama' ? 'Yoklama Gir' : tab === 'raporlar' ? 'Raporlar' : 'Öğrenci Yönetimi'}
              </button>
            ))}
          </div>

          {message.text && (
            <div className={`p-4 rounded-lg mb-4 ${
              message.type === 'success' ? 'bg-green-100 text-green-800' :
              message.type === 'error' ? 'bg-red-100 text-red-800' :
              message.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sınıf Seçin</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Sınıf seçiniz...</option>
                {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tarih Seçin</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {activeTab === 'yoklama' && selectedClass && classStudents.length > 0 && lessonCount > 0 && (
            <div>
              <div className="mb-4 p-4 bg-indigo-50 rounded-lg flex justify-between items-center">
                <p className="text-sm font-medium text-indigo-800">
                  {classStudents.length} öğrenci • {lessonCount} ders
                </p>
                <button onClick={downloadCSV} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                  <Download className="w-4 h-4" /> CSV İndir
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left font-semibold text-gray-700 border">Öğrenci Adı</th>
                      {Array.from({ length: lessonCount }, (_, i) => (
                        <th key={i} className="p-3 text-center font-semibold text-gray-700 border">{i + 1}. Ders</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map(student => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-800 border">{student.name}</td>
                        {Array.from({ length: lessonCount }, (_, i) => {
                          const key = `${student.id}-${i + 1}`;
                          const currentStatus = attendance[key] || '';
                          return (
                            <td key={i} className="p-2 border">
                              <div className="flex gap-1 justify-center">
                                {['geldi', 'gelmedi', 'mazeretli', 'izinli'].map(status => (
                                  <button
                                    key={status}
                                    onClick={() => handleAttendanceChange(student.id, i + 1, status)}
                                    className={`p-2 rounded transition-all ${
                                      currentStatus === status
                                        ? getStatusColor(status) + ' text-white'
                                        : 'bg-gray-100 text-gray-400'
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

              <button
                onClick={saveAttendance}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" /> Yoklamayı Kaydet
              </button>
            </div>
          )}

          {activeTab === 'raporlar' && (
            <div>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <strong>Devamsızlık Hakları:</strong> 9-10-11: 10+10 | 12-Mezun: 20+20 <strong>| Sıfırlama:</strong> 16 Ocak 2026
              </div>

              <h2 className="text-xl font-bold mb-4">Sınıf Devamlılık İstatistikleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {classes.map(cls => {
                  const stats = calculateClassStats(cls.id);
                  if (stats === null) return null;
                  return (
                    <div key={cls.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <h3 className="font-semibold text-gray-700 mb-2">{cls.name}</h3>
                      <div className="text-2xl font-bold text-indigo-600">{stats.toFixed(1)}%</div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(stats, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedClass && classStudents.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Öğrenci Devamsızlık Raporu</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-2 text-left border">Öğrenci</th>
                          <th className="p-2 text-center border">Toplam</th>
                          <th className="p-2 text-center border">Geldi</th>
                          <th className="p-2 text-center border">Gelmedi</th>
                          <th className="p-2 text-center border">Mazeretli</th>
                          <th className="p-2 text-center border">Devam %</th>
                          <th className="p-2 text-center border">Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classStudents.map(student => {
                          const stats = calculateStudentStats(student.id, selectedClass);
                          const statusInfo = getStudentStatus(student.id, selectedClass);
                          const limits = getAbsenceLimit(selectedClass);
                          return (
                            <tr key={student.id} className={`border-l-4 ${statusInfo.color}`}>
                              <td className="p-2 border">{student.name}</td>
                              <td className="p-2 text-center border">{stats.totalLessons}</td>
                              <td className="p-2 text-center border text-green-600">{stats.attended}</td>
                              <td className="p-2 text-center border text-red-600">{stats.absent}/{limits.unexcused}</td>
                              <td className="p-2 text-center border text-yellow-600">{stats.excused}/{limits.excused}</td>
                              <td className="p-2 text-center border font-bold">{stats.attendanceRate.toFixed(1)}%</td>
                              <td className={`p-2 text-center border ${statusInfo.textColor}`}>
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
            </div>
          )}

          {activeTab === 'yukle' && (
            <div>
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addStudent()}
                  placeholder="Öğrenci adı..."
                  disabled={!selectedClass}
                  className="flex-1 p-3 border rounded-lg"
                />
                <button
                  onClick={addStudent}
                  disabled={!selectedClass || !newStudentName.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
                >
                  Ekle
                </button>
              </div>

              {classStudents.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <p className="font-medium mb-2">Kayıtlı Öğrenciler ({classStudents.length}):</p>
                  {classStudents.map((student, idx) => (
                    <div key={student.id} className="flex justify-between items-center bg-white p-2 rounded mb-1">
                      <span className="text-sm">{idx + 1}. {student.name}</span>
                      <button onClick={() => removeStudent(student.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
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
