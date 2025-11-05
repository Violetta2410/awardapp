
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { meetingData } from './constants';
import { Award, Meeting, ResultsData } from './types';

const App: React.FC = () => {
    const [memberName, setMemberName] = useState('');
    const [joinDate, setJoinDate] = useState('');
    const [currentFilter, setCurrentFilter] = useState('all');
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
    const [results, setResults] = useState<ResultsData | null>(null);

    const resultsRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (results && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [results]);

    const memberYearsText = useMemo(() => {
        if (!joinDate) return '0';
        const start = new Date(joinDate);
        if (isNaN(start.getTime())) return '0';
        
        const end = new Date('2025-11-21');
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const totalMonths = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30.44));

        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        let displayText = '';
        if (years > 0) {
            displayText += `${years}년`;
        }
        if (months > 0) {
            if (years > 0) displayText += ' ';
            displayText += `${months}개월`;
        }
        if (totalMonths === 0) {
            displayText = '1개월 미만';
        }
        return displayText;
    }, [joinDate]);

    const filteredMeetings = useMemo(() => {
        if (currentFilter === 'all') return meetingData;
        return meetingData.filter(item => item.date.startsWith(currentFilter));
    }, [currentFilter]);

    const handleCheckboxChange = (date: string, isChecked: boolean) => {
        const newSelectedDates = new Set(selectedDates);
        if (isChecked) {
            newSelectedDates.add(date);
        } else {
            newSelectedDates.delete(date);
        }
        setSelectedDates(newSelectedDates);
    };

    const formatDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-');
        return `${year}.${month}.${day}`;
    };

    const calculateAwards = () => {
        if (!memberName || !joinDate) {
            alert('이름과 가입 날짜를 입력해주세요!');
            return;
        }

        const attendanceCount = selectedDates.size;
        if (attendanceCount === 0) {
            alert('참석한 날짜를 선택해주세요!');
            return;
        }

        const start = new Date(joinDate);
        const end = new Date('2025-11-21');
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const totalMonths = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30.44));

        const awards = getAwards(totalMonths, attendanceCount);
        
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        let periodText = '';
        if (years > 0) {
            periodText += `${years}년`;
        }
        if (months > 0) {
            if (years > 0) periodText += ' ';
            periodText += `${months}개월`;
        }
        if (totalMonths === 0) {
            periodText = '1개월 미만';
        }

        setResults({
            name: memberName,
            periodText: periodText,
            attendanceCount,
            awards
        });
    };

    const getAwards = (totalMonths: number, attendanceCount: number): Award[] => {
        const awards: Award[] = [];

        if (totalMonths >= 60 && attendanceCount >= 100) {
            awards.push({ name: 'King Award', type: 'gold', description: '5년 이상 + 100회 이상 참석' });
        } else if (totalMonths >= 36 && attendanceCount >= 70) {
            awards.push({ name: 'Champion Award', type: 'silver', description: '3년 이상 + 70회 이상 참석' });
        } else if (totalMonths >= 12 && attendanceCount >= 25) {
            awards.push({ name: 'Achiever Award', type: 'bronze', description: '1년 이상 + 25회 이상 참석' });
        }

        if (attendanceCount >= 100 && totalMonths < 60) {
            awards.push({ name: 'Master', type: 'gold', description: '100회 이상 참석 (Qualification)' });
        } else if (attendanceCount >= 70 && totalMonths < 36) {
            awards.push({ name: 'Mentor', type: 'silver', description: '70회 이상 참석 (Qualification)' });
        } else if (attendanceCount >= 50 && totalMonths < 36) {
            awards.push({ name: 'Coach', type: 'bronze', description: '50회 이상 참석 (Qualification)' });
        }

        return awards;
    };
    
    const awardCardStyles = {
        gold: 'from-yellow-400 via-amber-400 to-orange-500',
        silver: 'from-slate-400 via-gray-400 to-slate-500',
        bronze: 'from-amber-600 via-yellow-700 to-orange-800'
    };

    const filterButtons = ['all', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

    return (
        <div className="bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl shadow-indigo-100 overflow-hidden">
                <header className="text-center p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">🎉 채그로 독서모임 6주년 시상식 🎉</h1>
                    <p className="mt-2 text-lg opacity-90 font-medium">2019.11.16 - 2025.11.21</p>
                </header>

                <main>
                    <section className="p-6 md:p-8 bg-slate-50 border-b border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="memberName" className="block text-sm font-bold text-gray-700 mb-2">이름</label>
                                <input
                                    type="text"
                                    id="memberName"
                                    value={memberName}
                                    onChange={(e) => setMemberName(e.target.value)}
                                    placeholder="이름을 입력하세요"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="joinDate" className="block text-sm font-bold text-gray-700 mb-2">가입 날짜</label>
                                <input
                                    type="date"
                                    id="joinDate"
                                    value={joinDate}
                                    onChange={(e) => setJoinDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex flex-wrap gap-2">
                                {filterButtons.map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setCurrentFilter(filter)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                                            currentFilter === filter
                                                ? 'bg-indigo-600 text-white shadow'
                                                : 'bg-white text-gray-700 hover:bg-indigo-100 border border-slate-300'
                                        }`}
                                    >
                                        {filter === 'all' ? '전체' : `${filter}년`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                    
                    <section className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border-b border-slate-200">
                        <div className="text-center bg-indigo-50 p-4 rounded-xl">
                            <div className="text-4xl font-extrabold text-indigo-600">{selectedDates.size}</div>
                            <div className="text-sm font-bold text-gray-600 mt-1">선택한 횟수</div>
                        </div>
                         <div className="text-center bg-purple-50 p-4 rounded-xl">
                            <div className="text-4xl font-extrabold text-purple-600">{memberYearsText}</div>
                            <div className="text-sm font-bold text-gray-600 mt-1">활동 기간</div>
                        </div>
                    </section>

                    <section className="max-h-[60vh] overflow-y-auto bg-gray-50">
                        {filteredMeetings.map((meeting) => (
                            <div key={meeting.date} className={`flex items-center p-4 border-b border-slate-200 transition-colors duration-200 ${meeting.exclude ? 'bg-slate-100 opacity-60' : 'hover:bg-indigo-50'}`}>
                                <input
                                    type="checkbox"
                                    id={`date-${meeting.date}`}
                                    checked={selectedDates.has(meeting.date)}
                                    disabled={meeting.exclude}
                                    onChange={(e) => handleCheckboxChange(meeting.date, e.target.checked)}
                                    className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
                                />
                                <label htmlFor={`date-${meeting.date}`} className={`flex-1 ml-4 ${meeting.exclude ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <p className="font-bold text-slate-800">{formatDate(meeting.date)}</p>
                                    <p className="text-sm text-slate-600 mt-1">{meeting.book}</p>
                                </label>
                            </div>
                        ))}
                    </section>

                    <section className="p-6 md:p-8 bg-white">
                        <button
                            onClick={calculateAwards}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold py-4 px-4 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                            🏆 시상 결과 확인하기
                        </button>
                    </section>
                    
                    {results && (
                       <section ref={resultsRef} className="p-6 md:p-8 bg-slate-50">
                           {results.awards.length === 0 ? (
                               <div className="text-center p-8 bg-white rounded-lg shadow-md">
                                   <h2 className="text-2xl font-bold text-slate-800">{results.name}님</h2>
                                   <p className="mt-2 text-gray-600">활동 기간: {results.periodText}</p>
                                   <p className="text-gray-600">참석 횟수: {results.attendanceCount}회</p>
                                   <p className="mt-6 text-lg text-indigo-700 font-semibold">
                                       아직 수상 조건을 충족하지 못했습니다.<br/>
                                       계속해서 함께 해주세요! 📚
                                   </p>
                               </div>
                           ) : (
                               <div className="text-center">
                                   <h2 className="text-4xl font-black text-slate-800 tracking-tight">🎊 축하합니다! 🎊</h2>
                                   <p className="mt-2 text-2xl font-bold text-indigo-600">{results.name}님</p>
                                   <p className="mt-2 text-md text-gray-500">
                                       활동 기간: {results.periodText} | 참석 횟수: {results.attendanceCount}회
                                   </p>
                                   <div className="mt-8 space-y-4">
                                       {results.awards.map(award => (
                                           <div key={award.name} className={`text-white p-6 rounded-xl shadow-lg bg-gradient-to-br ${awardCardStyles[award.type]}`}>
                                               <h3 className="text-2xl font-bold">🏆 {award.name}</h3>
                                               <p className="mt-2 opacity-90">{award.description}</p>
                                           </div>
                                       ))}
                                   </div>
                               </div>
                           )}
                       </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
