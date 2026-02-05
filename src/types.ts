export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  tag: string;                                                          // 태그명(예: '업무', '개인')
  color: string;                                                        // 태그색상(예: '#ff7675')
  date: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: { tag: string };
}

export interface TagOption {
  name: string;
  color: string;
}