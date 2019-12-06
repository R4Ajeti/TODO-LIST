/* eslint-env browser */

const Modal = function Modal() {
  this.el = document.querySelector('.addForm');
  this.nameEl = this.el.querySelector('input.name');
  this.descEl = this.el.querySelector('input.descrition');
  this.dueDateEl = this.el.querySelector('input.dueDate');
  this.highPriorEl = this.el.querySelector('input.highPriorCB');

  const cancelBtnEl = document.querySelector('.addForm .cancelBtn');
  cancelBtnEl.onclick = () => this.hide();
};

Modal.prototype.show = function show() {
  this.el.style.display = 'block';

  const context = this.el;
  return new Promise(((res, rej) => {
    const btns = context.querySelectorAll('input[type="button"]');

    btns.forEach((btn) => {
      const b = btn;
      b.onclick = (e) => {
        this.hide();
        if (e.target.value === 'Accept') {
          res({
            name: this.nameEl.value,
            desc: this.descEl.value,
            dueDate: this.dueDateEl.value,
            highPrior: this.highPriorEl.checked,
          });
          this.nameEl.value = null;
          this.descEl.value = null;
          this.dueDateEl.value = null;
          this.highPriorEl.checked = false;
        } else {
          res(false);
        }
        rej(new Error());
      };
    });
  }));
};

Modal.prototype.hide = function hide() {
  this.el.style.display = 'none';
};

const ListModelator = function ListModelator(el) {
  this.items = [];
  this.el = el;
  this.display();
};

ListModelator.prototype.display = function display() {
  const ul = this.el;

  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }

  this.items.forEach((item, index) => {
    const li = document.createElement('li');
    li.setAttribute('index', index);

    const cb = document.createElement('input');
    cb.setAttribute('type', 'checkbox');
    cb.onclick = (e) => { this.toggleCB(index, e); };
    cb.checked = item.checked;

    const lb = document.createElement('label');
    lb.textContent = item.name;

    const a = document.createElement('a');
    a.setAttribute('href', '#');
    a.textContent = ' -> Remove';
    a.onclick = () => { this.remove(index); };

    li.appendChild(cb);
    li.appendChild(lb);
    li.appendChild(a);
    ul.appendChild(li);

    // this.el.querySelector('div.ui input[type="button"]').onclick = () => this.add();
  });
};

ListModelator.prototype.toggleCB = function toggleCB(index, e) {
  const el = e.target;
  this.items[index].checked = el.checked;
};

ListModelator.prototype.remove = function remove(index) {
  this.items.splice(index, 1);
  this.display();
};

ListModelator.prototype.add = function add(item) {
  this.items.push(item);
  this.display();
};

const Project = function Project(title, description, dueDate, priority) {
  this.el = document.querySelector('div.project');
  this.name = title;
  this.description = description;
  this.dueDate = dueDate;
  this.checked = priority;
  this.checklist = new ListModelator(this.el.querySelector('div.checkList > ul'));

  const addBtn = this.el.querySelector('div.ui input[type="button"]');
  addBtn.onclick = () => this.addToCL();
};

Project.prototype.display = function display() {
  const titleEl = this.el.querySelector('h1');
  const descEl = this.el.querySelector('div > p');
  const dueDateEl = this.el.querySelector('div > span');

  titleEl.textContent = this.title;
  descEl.textContent = this.description;
  dueDateEl.textContent = `Due date: ${this.dueDate}`;
};

Project.prototype.addToCL = function addToCL() {
  const text = this.el.querySelector('div.ui input[type="text"]').value;
  this.checklist.add({
    checked: false,
    name: text,
  });
};

const ProjectList = function ProjectList() {
  this.el = document.querySelector('div.projectList');
  this.list = new ListModelator(this.el.querySelector('ul'));
  this.modal = new Modal();

  const openModalBtn = this.el.querySelector('input[type="button"]');
  openModalBtn.onclick = () => this.modal.show().then((resp) => {
    if (resp) {
      this.addProject(resp);
    }
  });

  const mProject = new Project('titulo', 'descri', '10/10/2010', false);
  this.list.add(mProject);
};

ProjectList.prototype.addProject = function addProject(resp) {
  const mProject = new Project(resp.name, resp.desc, resp.dueDate, resp.highPrior);
  this.list.add(mProject);
};

// eslint-disable-next-line no-unused-vars
const mProjectList = new ProjectList();
