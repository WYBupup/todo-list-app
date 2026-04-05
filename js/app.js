// 数据模型和状态管理
class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.currentCategoryFilter = '';
        this.currentPriorityFilter = '';
        this.theme = this.loadTheme();

        this.init();
    }

    // 初始化应用
    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.applyTheme();
        this.render();
    }

    // 缓存DOM元素
    cacheElements() {
        this.taskInput = document.getElementById('taskInput');
        this.categorySelect = document.getElementById('categorySelect');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.tagsInput = document.getElementById('tagsInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.themeToggle = document.getElementById('themeToggle');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.priorityFilter = document.getElementById('priorityFilter');
        this.clearFiltersBtn = document.getElementById('clearFilters');

        // 统计元素
        this.totalCount = document.getElementById('totalCount');
        this.pendingCount = document.getElementById('pendingCount');
        this.completedCount = document.getElementById('completedCount');
        this.completionRate = document.getElementById('completionRate');
    }

    // 绑定事件监听器
    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        this.categoryFilter.addEventListener('change', (e) => {
            this.currentCategoryFilter = e.target.value;
            this.render();
        });

        this.priorityFilter.addEventListener('change', (e) => {
            this.currentPriorityFilter = e.target.value;
            this.render();
        });

        this.clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());
    }

    // 添加任务
    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) {
            alert('请输入任务内容！');
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            category: this.categorySelect.value,
            priority: this.prioritySelect.value,
            tags: this.tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag),
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();

        // 重置输入框
        this.taskInput.value = '';
        this.tagsInput.value = '';
        this.prioritySelect.value = 'medium';

        this.render();
        this.taskInput.focus();
    }

    // 删除任务
    deleteTask(id) {
        const element = document.querySelector(`[data-task-id="${id}"]`);
        if (element) {
            element.classList.add('remove');
            setTimeout(() => {
                this.tasks = this.tasks.filter(task => task.id !== id);
                this.saveTasks();
                this.render();
            }, 300);
        }
    }

    // 切换任务完成状态
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    // 编辑任务
    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const newText = prompt('编辑任务:', task.text);
        if (newText && newText.trim()) {
            task.text = newText.trim();
            this.saveTasks();
            this.render();
        }
    }

    // 设置筛选器
    setFilter(filter) {
        this.currentFilter = filter;

        // 更新按钮样式
        this.filterButtons.forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('bg-blue-500', 'text-white');
                btn.classList.remove('bg-opacity-50');
            } else {
                btn.classList.remove('bg-blue-500', 'text-white');
                btn.classList.add('bg-opacity-50');
            }
        });

        this.render();
    }

    // 清除所有筛选
    clearAllFilters() {
        this.currentFilter = 'all';
        this.currentCategoryFilter = '';
        this.currentPriorityFilter = '';
        this.categoryFilter.value = '';
        this.priorityFilter.value = '';

        this.filterButtons.forEach(btn => {
            if (btn.dataset.filter === 'all') {
                btn.classList.add('bg-blue-500', 'text-white');
                btn.classList.remove('bg-opacity-50');
            } else {
                btn.classList.remove('bg-blue-500', 'text-white');
                btn.classList.add('bg-opacity-50');
            }
        });

        this.render();
    }

    // 筛选任务
    getFilteredTasks() {
        let filtered = this.tasks;

        // 按状态筛选
        if (this.currentFilter === 'completed') {
            filtered = filtered.filter(t => t.completed);
        } else if (this.currentFilter === 'pending') {
            filtered = filtered.filter(t => !t.completed);
        }

        // 按分类筛选
        if (this.currentCategoryFilter) {
            filtered = filtered.filter(t => t.category === this.currentCategoryFilter);
        }

        // 按优先级筛选
        if (this.currentPriorityFilter) {
            filtered = filtered.filter(t => t.priority === this.currentPriorityFilter);
        }

        return filtered;
    }

    // 更新统计信息
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

        this.totalCount.textContent = total;
        this.pendingCount.textContent = pending;
        this.completedCount.textContent = completed;
        this.completionRate.textContent = rate + '%';
    }

    // 렌더링任务列表
    render() {
        const filtered = this.getFilteredTasks();
        this.taskList.innerHTML = '';

        if (filtered.length === 0) {
            this.emptyState.style.display = 'block';
        } else {
            this.emptyState.style.display = 'none';
            filtered.forEach(task => {
                const taskElement = this.createTaskElement(task);
                this.taskList.appendChild(taskElement);
            });
        }

        this.updateStats();
    }

    // 创建任务元素
    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-item glass-effect priority-${task.priority} ${task.completed ? 'completed' : ''}`;
        div.dataset.taskId = task.id;

        // 优先级指示器
        const priorityIndicator = '<span class="priority-indicator"></span>';

        // 分类徽章
        const categoryBadge = `<span class="category-badge">${task.category}</span>`;

        // 标签
        const tagsList = task.tags.length > 0
            ? task.tags.map(tag => `<span class="task-tag">#${tag}</span>`).join('')
            : '';

        // 复选框
        const checkbox = `<input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>`;

        // 任务文本和详情
        const content = `
            <div style="flex: 1;">
                <div class="task-text">${this.escapeHtml(task.text)}</div>
                <div class="task-detail">
                    ${priorityIndicator}
                    ${categoryBadge}
                    ${tagsList}
                </div>
            </div>
        `;

        // 操作按钮
        const actions = `
            <div class="task-actions" style="display: flex; gap: 8px;">
                <button class="task-btn edit" title="编辑">✏️</button>
                <button class="task-btn delete" title="删除">🗑️</button>
            </div>
        `;

        div.innerHTML = checkbox + content + actions;

        // 事件监听
        div.querySelector('.task-checkbox').addEventListener('change', () => this.toggleTask(task.id));
        div.querySelector('.edit').addEventListener('click', () => this.editTask(task.id));
        div.querySelector('.delete').addEventListener('click', () => this.deleteTask(task.id));

        return div;
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 主题切换
    toggleTheme() {
        this.theme = this.theme === 'light-theme' ? 'dark-theme' : 'light-theme';
        this.applyTheme();
        this.saveTheme();
    }

    // 应用主题
    applyTheme() {
        document.body.className = `${this.theme} min-h-screen py-8 px-4`;
        this.themeToggle.innerHTML = this.theme === 'light-theme' ? '🌙' : '☀️';
    }

    // 本地存储
    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('todoTasks');
        return saved ? JSON.parse(saved) : [];
    }

    saveTheme() {
        localStorage.setItem('todoTheme', this.theme);
    }

    loadTheme() {
        return localStorage.getItem('todoTheme') || 'light-theme';
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
