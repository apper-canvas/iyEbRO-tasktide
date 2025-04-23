// Canvas ID for Apper backend
const CANVAS_ID = 'b99f620c6e6146ccb342079f04c218df';

// Table names from the schema
const TABLES = {
  TASK: 'task9',
  USER: 'User',
};

class ApperService {
  constructor() {
    this.apperClient = null;
    this.isInitialized = false;
  }

  initialize() {
    if (!this.isInitialized && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient(CANVAS_ID);
      this.isInitialized = true;
    }
    return this.isInitialized;
  }

  setupAuthUI(config) {
    if (!this.initialize()) return null;
    
    const { ApperUI } = window.ApperSDK;
    return ApperUI.setup(this.apperClient, {
      target: config.target,
      clientId: CANVAS_ID,
      hide: config.hide || [],
      view: config.view || 'both',
      onSuccess: config.onSuccess,
      onError: config.onError,
    });
  }

  showLogin(target) {
    if (!this.initialize()) return;
    const { ApperUI } = window.ApperSDK;
    ApperUI.showLogin(target);
  }

  showSignup(target) {
    if (!this.initialize()) return;
    const { ApperUI } = window.ApperSDK;
    ApperUI.showSignup(target);
  }

  async fetchTasks(options = {}) {
    if (!this.initialize()) throw new Error('ApperClient not initialized');
    
    const params = {
      fields: [
        'Id', 'title', 'description', 'dueDate', 'priority', 'completed',
        'createdAt', 'updatedAt', 'Name'
      ],
      pagingInfo: options.pagingInfo || { limit: 100, offset: 0 },
      orderBy: options.orderBy || [{ field: 'createdAt', direction: 'desc' }],
      filter: options.filter,
    };
    
    const response = await this.apperClient.fetchRecords(TABLES.TASK, params);
    return response.data;
  }

  async createTask(taskData) {
    if (!this.initialize()) throw new Error('ApperClient not initialized');
    
    const record = {
      title: taskData.title,
      description: taskData.description || '',
      dueDate: taskData.dueDate || null,
      priority: taskData.priority || 'medium',
      completed: taskData.completed || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      Name: taskData.title, // Name field is required for all tables
    };
    
    const params = { record };
    const response = await this.apperClient.createRecord(TABLES.TASK, params);
    return response.data;
  }

  async updateTask(taskId, taskData) {
    if (!this.initialize()) throw new Error('ApperClient not initialized');
    
    const record = {
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      completed: taskData.completed,
      updatedAt: new Date().toISOString(),
      Name: taskData.title, // Update Name field to match title
    };
    
    const params = { record };
    const response = await this.apperClient.updateRecord(TABLES.TASK, taskId, params);
    return response.data;
  }

  async deleteTask(taskId) {
    if (!this.initialize()) throw new Error('ApperClient not initialized');
    
    const response = await this.apperClient.deleteRecord(TABLES.TASK, taskId);
    return response.data;
  }

  async toggleTaskCompletion(taskId, currentStatus) {
    if (!this.initialize()) throw new Error('ApperClient not initialized');
    
    const record = {
      completed: !currentStatus,
      updatedAt: new Date().toISOString(),
    };
    
    const params = { record };
    const response = await this.apperClient.updateRecord(TABLES.TASK, taskId, params);
    return response.data;
  }

  async getUserProfile() {
    if (!this.initialize()) throw new Error('ApperClient not initialized');
    
    // This is just a placeholder since user data should come from auth success
    // In a real implementation, you might fetch additional user profile data
    return null;
  }

  async logout() {
    if (!this.initialize()) throw new Error('ApperClient not initialized');
    
    // The actual logout is handled by the SDK
    return { success: true };
  }
}

export default new ApperService();