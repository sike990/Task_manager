import React, { useState } from 'react';
import { Plus, Filter, Code, User, Wrench, Calendar, AlertTriangle, Shuffle } from 'lucide-react';

const TaskStackManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newNote, setNewNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('coding');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [randomTask, setRandomTask] = useState(null);

  const categories = {
    coding: { 
      name: 'Coding', 
      color: 'from-blue-500 to-cyan-500', 
      bg: 'bg-blue-50 border-blue-200', 
      icon: Code,
      textColor: 'text-blue-700'
    },
    development: { 
      name: 'Development', 
      color: 'from-green-500 to-emerald-500', 
      bg: 'bg-green-50 border-green-200', 
      icon: Wrench,
      textColor: 'text-green-700'
    },
    personal: { 
      name: 'Personal', 
      color: 'from-purple-500 to-pink-500', 
      bg: 'bg-purple-50 border-purple-200', 
      icon: User,
      textColor: 'text-purple-700'
    },
    miscellaneous: { 
      name: 'Miscellaneous', 
      color: 'from-gray-500 to-slate-500', 
      bg: 'bg-gray-50 border-gray-200', 
      icon: Calendar,
      textColor: 'text-gray-700'
    },
    urgent: { 
      name: 'Urgent', 
      color: 'from-red-500 to-orange-500', 
      bg: 'bg-red-50 border-red-200', 
      icon: AlertTriangle,
      textColor: 'text-red-700'
    }
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask,
        note: newNote,
        category: selectedCategory,
        createdAt: new Date().toLocaleDateString()
      };
      setTasks([task, ...tasks]);
      setNewTask('');
      setNewNote('');
      setShowAddForm(false);
    }
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (randomTask && randomTask.id === id) {
      setRandomTask(null);
    }
  };

  const selectRandomTask = () => {
    const availableTasks = activeFilter === 'all' ? tasks : tasks.filter(task => task.category === activeFilter);
    if (availableTasks.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTasks.length);
      setRandomTask(availableTasks[randomIndex]);
    }
  };

  const filteredTasks = activeFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === activeFilter);

  const getCategoryStats = () => {
    const stats = {};
    Object.keys(categories).forEach(cat => {
      stats[cat] = tasks.filter(task => task.category === cat).length;
    });
    return stats;
  };

  const stats = getCategoryStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            Organise Your Day:)
          </h1>
          <p className="text-slate-600">Organize your tasks with beautiful simplicity</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {Object.entries(categories).map(([key, category]) => {
            const IconComponent = category.icon;
            return (
              <div key={key} className={`${category.bg} border-2 rounded-xl p-4 text-center transition-all duration-200 hover:scale-105`}>
                <IconComponent className={`w-6 h-6 mx-auto mb-2 ${category.textColor}`} />
                <div className={`text-2xl font-bold ${category.textColor}`}>{stats[key]}</div>
                <div className={`text-sm ${category.textColor} opacity-75`}>{category.name}</div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Add Task Button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>

          {/* Random Task Button */}
          <button
            onClick={selectRandomTask}
            disabled={filteredTasks.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shuffle className="w-5 h-5" />
            Random Task
          </button>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-blue-400 transition-colors duration-200"
            >
              <option value="all">All Categories</option>
              {Object.entries(categories).map(([key, category]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>
            <Filter className="w-5 h-5 absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter your task..."
                className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 transition-colors duration-200"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add notes, links, or additional details..."
                className="border-2 border-gray-200 rounded-xl px-4 py-3 h-24 resize-none focus:outline-none focus:border-blue-400 transition-colors duration-200"
              />
              <div className="flex gap-2">
                {Object.entries(categories).map(([key, category]) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        selectedCategory === key
                          ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                          : `${category.bg} ${category.textColor} hover:scale-105`
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {category.name}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addTask}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  Done
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Stack */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks yet</h3>
              <p className="text-gray-500">Add your first task to get started!</p>
            </div>
          ) : (
            filteredTasks.map((task, index) => {
              const category = categories[task.category];
              const IconComponent = category.icon;
              const taskOrder = filteredTasks.length - index;
              const isRandomlySelected = randomTask && randomTask.id === task.id;
              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-2xl shadow-sm border-2 ${
                    isRandomlySelected 
                      ? 'border-yellow-400 ring-4 ring-yellow-200 bg-yellow-50' 
                      : 'border-black'
                  } border-l-4 border-l-${task.category === 'coding' ? 'blue' : task.category === 'development' ? 'green' : task.category === 'personal' ? 'purple' : task.category === 'urgent' ? 'red' : 'gray'}-500 p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 relative ${
                    isRandomlySelected ? 'animate-pulse' : ''
                  }`}
                  style={{
                    zIndex: filteredTasks.length - index,
                    marginTop: index > 0 ? '-8px' : '0'
                  }}
                >
                  {/* Task Order */}
                  <div className="absolute top-3 right-3 bg-black text-white text-xs px-2 py-1 rounded-full font-medium" style={{width: 'fit-content', minWidth: '24px'}}>
                    #{taskOrder}
                  </div>
                  
                  {/* Random Selection Indicator */}
                  {isRandomlySelected && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                      ⭐ Selected
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between pr-12">
                    <div className="flex-1">
                      <div className={`flex items-center gap-3 mb-2 ${isRandomlySelected ? 'mt-6' : ''}`}>
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-sm font-medium ${category.textColor}`}>
                          {category.name}
                        </span>
                        <span className="text-xs text-gray-500">{task.createdAt}</span>
                      </div>
                      <p className={`font-medium mb-2 ${isRandomlySelected ? 'text-yellow-800' : 'text-gray-800'}`}>{task.text}</p>
                      {task.note && (
                        <div className={`rounded-lg p-3 text-sm border-l-2 ${
                          isRandomlySelected 
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-400' 
                            : 'bg-gray-50 text-gray-600 border-gray-300'
                        }`}>
                          <div className={`font-medium mb-1 ${isRandomlySelected ? 'text-yellow-800' : 'text-gray-700'}`}>Notes:</div>
                          <p className="whitespace-pre-wrap">{task.note}</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 ml-4 absolute top-6 right-12"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskStackManager;
