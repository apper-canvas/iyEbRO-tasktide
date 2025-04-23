import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  stats: {
    total: 0,
    completed: 0,
    pending: 0,
  },
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
      state.error = null;
      state.stats = {
        total: action.payload.length,
        completed: action.payload.filter(task => task.completed).length,
        pending: action.payload.filter(task => !task.completed).length,
      };
    },
    addTask: (state, action) => {
      state.tasks.unshift(action.payload);
      state.stats = {
        total: state.tasks.length,
        completed: state.tasks.filter(task => task.completed).length,
        pending: state.tasks.filter(task => !task.completed).length,
      };
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.Id === action.payload.Id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      state.stats = {
        total: state.tasks.length,
        completed: state.tasks.filter(task => task.completed).length,
        pending: state.tasks.filter(task => !task.completed).length,
      };
    },
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.Id !== action.payload);
      state.stats = {
        total: state.tasks.length,
        completed: state.tasks.filter(task => task.completed).length,
        pending: state.tasks.filter(task => !task.completed).length,
      };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { 
  setTasks, 
  addTask, 
  updateTask, 
  removeTask, 
  setLoading, 
  setError 
} = taskSlice.actions;

export default taskSlice.reducer;