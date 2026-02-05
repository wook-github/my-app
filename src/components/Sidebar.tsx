import React from 'react';
import type{ TodoItem, TagOption } from '../types';

interface SidebarProps {
  todos: TodoItem[];
  selectedTag: TagOption;
  setSelectedTag: (tag: TagOption) => void;
  
  tagOptions: TagOption[];
  
  inputValue: string;
  setInputValue: (val: string) => void;
  
  inputDate: string;
  setInputDate: (val: string) => void;

  onAddTodo: (e: React.KeyboardEvent) => void;
  
  onDeleteTodo: (id: string) => void;
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
    return (
        <aside className="sidebar">
            <h2>📝 To-do</h2>
            <div className="tag-selector">
                {props.tagOptions.map(tag => (
                    <div
                        key={tag.name}
                        className={`tag-option ${props.selectedTag.name === tag.name ? 'active' : ''}`}
                        style={{ backgroundColor: tag.color }}
                        onClick={() => props.setSelectedTag(tag)}
                        title={tag.name}
                    />
                ))}
            </div>
            <input 
                type="date" 
                className="notion-date-input"
                value={props.inputDate}
                onChange={(e) => props.setInputDate(e.target.value)}
            />
            <input 
                className="notion-input"
                value={props.inputValue}
                onChange={(e) => props.setInputValue(e.target.value)}
                onKeyDown={props.onAddTodo}
                placeholder="새 작업 추가 (Enter)"
            />
            <ul className="todo-list">
                {props.todos.map(todo => (
                    <li key={todo.id} className="todo-item">
                        <div style={{display:'flex', flexDirection:'column'}}>
                            <span style={{fontSize:'14px'}}>{todo.text}</span>
                            <span style={{fontSize:'11px', color:'#888'}}>{todo.date}</span>
                        </div>
                        <div style={{display:'flex', alignItems:'center'}}>
                            <span className="tag-badge" style={{ backgroundColor: todo.color }}>{todo.tag}</span>
                            <button className="delete-btn" onClick={() => props.onDeleteTodo(todo.id)}>x</button>
                        </div>
                    </li>
                ))}
                </ul>
                <div className="filter-section">
                    <div className={`filter-btn ${props.currentFilter === 'all' ? 'active' : ''}`} onClick={() => props.setCurrentFilter('all')}>전체 보기</div>
                    {props.tagOptions.map(tag => (
                        <div key={tag.name} className={`filter-btn ${props.currentFilter === tag.name ? 'active' : ''}`} onClick={() => props.setCurrentFilter(tag.name)}>
                            <span style={{ color: tag.color }}>●</span> {tag.name}
                        </div>
                    ))}
                </div>
        </aside>
    );
};