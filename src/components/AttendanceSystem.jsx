import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Calendar, Users, Save, Download, Trash2, FileText, TrendingUp, Clock } from 'lucide-react';

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
    setMessage({ type: 'success', text: 'Yoklama başarıyla kaydedildi!' });
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
    setMessage({ type: 'success', text: 'Öğrenci başarıyla eklendi!' });
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
        const status = attendance[`${student.id}-${i}`] || '-';
        const statusText = status === 'geldi' ? 'G' : status === 'gelmedi' ? 'Y' : status === 'mazeretli' ? 'M' : status === 'izinli' ? 'İ' : '-';
        row.push(statusText);
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
      return { status: 'critical', color: 'bg-red-50 border-l-4 border-red-500', badge: 'bg-red-100 text-red-800' };
    }
    if (stats.absent >= limits.unexcused * 0.8 || stats.excused >= limits.excused * 0.8 || totalAbsences >= limits.total * 0.8) {
      return { status: 'warning', color: 'bg-yellow-50 border-l-4 border-yellow-500', badge: 'bg-yellow-100 text-yellow-800' };
    }
    return { status: 'normal', color: 'bg-white border-l-4 border-green-500', badge: 'bg-green-100 text-green-800' };
  };

  const getStatusColor = (status) => {
    const colors = {
      'geldi': 'bg-green-500 hover:bg-green-600 text-white',
      'gelmedi': 'bg-red-500 hover:bg-red-600 text-white',
      'mazeretli': 'bg-yellow-500 hover:bg-yellow-600 text-white',
      'izinli': 'bg-blue-500 hover:bg-blue-600 text-white'
    };
    return colors[status] || 'bg-gray-200 hover:bg-gray-300 text-gray-600';
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-8 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                  <Users className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">Ata Akademi</h1>
                  <p className="text-indigo-100 text-sm md:text-base">Yoklama ve Devamsızlık Yönetim Sistemi</p>
                </div>
              </div>
              <div className="flex gap-2 text-sm">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex gap-1 px-6">
              {[
                { id: 'yoklama', label: 'Yoklama Gir', icon: Check },
                { id: 'raporlar', label: 'Raporlar', icon: FileText },
                { id: 'yukle', label: 'Öğrenci Yönetimi', icon: Users }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                      activeTab === tab.id
                        ? 'text-indigo-600 bg-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-indigo-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sınıf Seçin</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white"
                >
                  <option value="">Sınıf seçiniz...</option>
                  {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tarih Seçin</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white"
                />
              </div>
            </div>
          </div>

          {/* Messages */}
          {message.text && (
            <div className="p-6 border-t border-gray-100">
              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
                message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
                message.type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' :
                'bg-blue-50 border border-blue-200 text-blue-800'
              }`}>
                <div className="flex-shrink-0">
                  {message.type === 'success' && <Check className="w-5 h-5" />}
                  {message.type === 'error' && <X className="w-5 h-5" />}
                  {message.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                  {message.type === 'info' && <AlertCircle className="w-5 h-5" />}
                </div>
                <p className="font-medium">{message.text}</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 p-6">
          {activeTab === 'yoklama' && selectedClass && classStudents.length > 0 && lessonCount > 0 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 text-white p-3 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sınıf Bilgileri</p>
                    <p className="text-xl font-bold text-gray-900">{classStudents.length} öğrenci • {lessonCount} ders</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={downloadCSV}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg shadow-green-200"
                  >
                    <Download className="w-4 h-4" /> CSV İndir
                  </button>
                  <button
                    onClick={saveAttendance}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-lg shadow-indigo-200"
                  >
                    <Save className="w-5 h-5" /> Kaydet
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-indigo-50">
                      <th className="p-4 text-left font-semibold text-gray-700 border-b-2 border-indigo-200">Öğrenci Adı</th>
                      {Array.from({ length: lessonCount }, (_, i) => (
                        <th key={i} className="p-4 text-center font-semibold text-gray-700 border-b-2 border-indigo-200 whitespace-nowrap">{i + 1}. Ders</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map((student, idx) => (
                      <tr key={student.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors`}>
                        <td className="p-4 font-medium text-gray-900 border-b border-gray-200">{student.name}</td>
                        {Array.from({ length: lessonCount }, (_, i) => {
                          const key = `${student.id}-${i + 1}`;
                          const currentStatus = attendance[key] || '';
                          return (
                            <td key={i} className="p-2 border-b border-gray-200">
                              <div className="flex gap-1 justify-center">
                                {['geldi', 'gelmedi', 'mazeretli', 'izinli'].map(status => (
                                  <button
                                    key={status}
                                    onClick={() => handleAttendanceChange(student.id, i + 1, status)}
                                    className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                                      currentStatus === status
                                        ? getStatusColor(status) + ' shadow-lg'
                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                    }`}
                                    title={status === 'geldi' ? 'Geldi' : status === 'gelmedi' ? 'Gelmedi' : status === 'mazeretli' ? 'Mazeretli' : 'İzinli'}
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
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
                <Calendar className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Yoklama almak için seçim yapın</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {selectedClass
                  ? 'Bu sınıf için seçilen tarihte ders bulunmuyor veya öğrenci listesi boş.'
                  : 'Öncelikle üst kısımdan sınıf ve tarih seçerek yoklamayı başlatabilirsiniz.'}
              </p>
            </div>
          )}

          {activeTab === 'raporlar' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-gray-900 mb-2">Devamsızlık Hakları</p>
                    <p><strong>9-10-11. Sınıflar:</strong> 10 mazeretli + 10 mazeretsiz = 20 toplam</p>
                    <p><strong>12. Sınıf ve Mezunlar:</strong> 20 mazeretli + 20 mazeretsiz = 40 toplam</p>
                    <p className="mt-2"><strong>Dönem Sıfırlama:</strong> 16 Ocak 2026</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Sınıf Devamlılık İstatistikleri</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {classes.map(cls => {
                    const stats = calculateClassStats(cls.id);
                    if (stats === null) return null;
                    return (
                      <div key={cls.id} className="bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-100 rounded-2xl p-6 hover:shadow-xl transition-shadow">
                        <h3 className="font-semibold text-gray-700 mb-1">{cls.name}</h3>
                        <div className="text-3xl font-bold text-indigo-600 mb-3">{stats.toFixed(1)}%</div>
                        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(stats, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Ortalama devam oranı</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedClass && classStudents.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Öğrenci Devamsızlık Raporu</h2>
                  <div className="overflow-x-auto rounded-2xl border border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-indigo-50">
                          <th className="p-3 text-left font-semibold text-gray-700 border-b-2 border-indigo-200">Öğrenci</th>
                          <th className="p-3 text-center font-semibold text-gray-700 border-b-2 border-indigo-200">Toplam</th>
                          <th className="p-3 text-center font-semibold text-gray-700 border-b-2 border-indigo-200">Geldi</th>
                          <th className="p-3 text-center font-semibold text-gray-700 border-b-2 border-indigo-200">Gelmedi</th>
                          <th className="p-3 text-center font-semibold text-gray-700 border-b-2 border-indigo-200">Mazeretli</th>
                          <th className="p-3 text-center font-semibold text-gray-700 border-b-2 border-indigo-200">Devam %</th>
                          <th className="p-3 text-center font-semibold text-gray-700 border-b-2 border-indigo-200">Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classStudents.map(student => {
                          const stats = calculateStudentStats(student.id, selectedClass);
                          const statusInfo = getStudentStatus(student.id, selectedClass);
                          const limits = getAbsenceLimit(selectedClass);
                          return (
                            <tr key={student.id} className={`${statusInfo.color} hover:shadow-md transition-shadow`}>
                              <td className="p-3 font-medium text-gray-900 border-b border-gray-200">{student.name}</td>
                              <td className="p-3 text-center border-b border-gray-200">{stats.totalLessons}</td>
                              <td className="p-3 text-center border-b border-gray-200">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {stats.attended}
                                </span>
                              </td>
                              <td className="p-3 text-center border-b border-gray-200">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {stats.absent}/{limits.unexcused}
                                </span>
                              </td>
                              <td className="p-3 text-center border-b border-gray-200">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {stats.excused}/{limits.excused}
                                </span>
                              </td>
                              <td className="p-3 text-center border-b border-gray-200">
                                <span className="font-bold text-indigo-600">{stats.attendanceRate.toFixed(1)}%</span>
                              </td>
                              <td className="p-3 text-center border-b border-gray-200">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.badge}`}>
                                  {statusInfo.status === 'critical' ? '🔴 Kritik' : statusInfo.status === 'warning' ? '⚠️ Uyarı' : '✅ Normal'}
                                </span>
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
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
                    <FileText className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Rapor görüntülemek için sınıf seçin</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Sınıf seçtikten sonra öğrencilerin geçmiş yoklama bilgilerini inceleyebilirsiniz.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'yukle' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Yeni Öğrenci Ekle
                </h3>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addStudent()}
                    placeholder={selectedClass ? 'Öğrenci adı ve soyadı...' : 'Önce sınıf seçiniz'}
                    disabled={!selectedClass}
                    className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={addStudent}
                    disabled={!selectedClass || !newStudentName.trim()}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                  >
                    Ekle
                  </button>
                </div>
              </div>

              {classStudents.length > 0 && (
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      Kayıtlı Öğrenciler
                    </h3>
                    <span className="bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-semibold">
                      {classStudents.length} öğrenci
                    </span>
                  </div>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {classStudents.map((student, idx) => (
                      <div key={student.id} className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all group">
                        <span className="font-medium text-gray-900">
                          <span className="text-indigo-600 font-semibold">{idx + 1}.</span> {student.name}
                        </span>
                        <button
                          onClick={() => removeStudent(student.id)}
                          className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                          Sil
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!selectedClass && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
                    <Users className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Öğrenci eklemek için sınıf seçin</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Öncelikle üst kısımdan bir sınıf seçerek öğrenci ekleme işlemine başlayabilirsiniz.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <span>Tüm veriler tarayıcınızda güvenle saklanır</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Ata Akademi © 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSystem;
