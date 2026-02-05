import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import daygridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateClickArg } from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import { Sidebar } from './components/Sidebar';
import type { TodoItem, CalendarEvent, TagOption } from './types';
import './App.css';

// 태그 프리셋 정의
const TAG_OPTIONS: TagOption[] = [
  { name: '업무', color: '#ff7675' },
  { name: '개인', color: '#74b9ff' },
  { name: '공부', color: '#55efc4' },
];

export default function App() {
  // 1. 초기값 설정: 로컬스토리지에서 데이터를 읽어오거나 없으면 빈 배열([]) 반환
  const [todos, setTodos] = useState<TodoItem[]>(() => 
    JSON.parse(localStorage.getItem('notion-todos') || '[]')
  );

  const [events, setEvents] = useState<CalendarEvent[]>(() => 
    JSON.parse(localStorage.getItem('notion-events') || '[]')
  );
  
  const [inputValue, setInputValue] = useState('');
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);   // 오늘 날짜를 기본값으로 설정 (YYYY-MM-DD 형식)
  const [selectedTag, setSelectedTag] = useState(TAG_OPTIONS[0]);       // 현재 선택된 태그 상태 관리
  const [currentFilter, setCurrentFilter] = useState('all');

  // 2. 데이터 저장 로직: todos가 변경될 때마다 실행됨
  useEffect(() => {
    localStorage.setItem('notion-todos', JSON.stringify(todos));
    localStorage.setItem('notion-events', JSON.stringify(events));
  }, [todos, events]);                                                  // [todos, events]는 이 값이 변할 때만 이 함수를 실행하라는 의미!

  // 3. 핸들러 함수
  // 통합 추가 함수: 리스트와 캘린더에 동시에 반영
  const handleAddTodo = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {

      // 1. To-do 리스트 데이터 추가
      const dt = String(Date.now());
      const newTodo = { 
        id: dt,
        text: inputValue,
        completed: false,
        tag: selectedTag.name,
        color: selectedTag.color,
        date: inputDate
      };

      // 2. 캘린더 이벤트 데이터 추가
      const newEvent: CalendarEvent = {
        id: dt,
        title: inputValue,
        start: inputDate,
        backgroundColor: selectedTag.color,
        borderColor: selectedTag.color,
        extendedProps: { tag: selectedTag.name }
      };

      setTodos([...todos, newTodo]);
      setEvents([...events, newEvent]);
      setInputValue('');
    }
  };

  // 캘린더 내의 날짜 클릭 이벤트
  const handleDateClick = (info: DateClickArg) => {
    const title = prompt(`[${selectedTag.name}] 새로운 일정을 입력하세요:`);
    if (title) {

      const newTodo: TodoItem = {
        id: String(Date.now()),
        text: title,
        completed: false,
        tag: selectedTag.name,
        color: selectedTag.color,
        date: info.dateStr
      };
      const newEvent: CalendarEvent = {
        id: String(Date.now()),
        title,
        start: info.dateStr,
        backgroundColor: selectedTag.color,
        borderColor: selectedTag.color,
        extendedProps: { tag: selectedTag.name }
      };
      setTodos([...todos, newTodo]);
      setEvents([...events, newEvent]);
    }
  };

  // 4. TO-DO 리스트 내의 삭제 기능 (필요하다면)
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    setEvents(events.filter(e => e.id !== id));
  };

  // 5. 필터링 데이터
  const filteredTodos = currentFilter === 'all' ? todos : todos.filter(t => t.tag === currentFilter);
  const filteredEvents = currentFilter === 'all' ? events : events.filter(e => e.extendedProps.tag === currentFilter);

  
  return (
    <div className="notion-layout">
      <Sidebar
        todos={filteredTodos}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        tagOptions={TAG_OPTIONS}
        inputValue={inputValue}
        setInputValue={setInputValue}
        inputDate={inputDate}
        setInputDate={setInputDate}
        onAddTodo={handleAddTodo}
        onDeleteTodo={deleteTodo}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
      />

      <main className="main-content">
        <div id="calendar-container">
          <FullCalendar 
            plugins={[daygridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="ko"
            height="100%"
            events={filteredEvents}
            dateClick={handleDateClick}
            eventClick={(info: EventClickArg) => {
              if(confirm('일정을 삭제할까요?')) {
                deleteTodo(info.event.id);
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}