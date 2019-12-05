/* eslint-env browser */
const Ui = function Ui(modal) {
  this.modal = modal;
  const openModalbtn = document.querySelector('.mainContent .addButton');
  openModalbtn.setAttribute('onclick', 'mUi.modal.show()');
};

Ui.prototype.openModal = function openModal() {
  this.modal.show();
};

const Modal = function Modal() {
  this.el = document.querySelector('.addForm');


  const cancelBtnEl = document.querySelector('.addForm .cancelBtn');
  cancelBtnEl.setAttribute('onclick', 'mUi.modal.hide()');
};

Modal.prototype.show = function show() {
  this.el.style.display = 'block';
};

Modal.prototype.hide = function hide() {
  this.el.style.display = 'none';
};

const CheckList = function CheckList() {
  this.el = document.querySelector('.project .checkList');
  this.items = [
    {
      done: false,
      name: 'Todo number 1',
    },
    {
      done: true,
      name: 'Todo number 2',
    },
  ];

  this.display();
};

CheckList.prototype.display = function display() {
  const ul = this.el.querySelector('ul');

  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }

  this.items.forEach((item, index) => {
    const li = document.createElement('li');
    li.setAttribute('index', index);

    const cb = document.createElement('input');
    cb.setAttribute('type', 'checkbox');
    cb.onclick = (e) => { this.toggleCB(index, e); };
    cb.checked = item.done;

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

    this.el.querySelector('div.ui input[type="button"]').onclick = () => this.add();
  });
};

CheckList.prototype.toggleCB = function toggleCB(index, e) {
  const el = e.target;
  this.items[index].done = el.checked;
};

CheckList.prototype.remove = function remove(index) {
  this.items.splice(index, 1);
  this.display();
};

CheckList.prototype.add = function add() {
  const text = this.el.querySelector('div.ui input[type="text"]').value;
  this.items.push({
    done: false,
    name: text,
  });
  this.display();
};

const Project = function Project(title, description, dueDate, priority) {
  this.el = document.querySelector('div.project');
  this.title = title;
  this.description = description;
  this.dueDate = dueDate;
  this.priority = priority;
  this.checklist = new CheckList();
};

Project.prototype.display = function display() {
  const titleEl = this.el.querySelector('h1');
  const descEl = this.el.querySelector('div > p');
  const dueDateEl = this.el.querySelector('div > span');

  titleEl.textContent = this.title;
  descEl.textContent = this.description;
  dueDateEl.textContent = `Due date: ${this.dueDate}`;
};

const mModal = new Modal();
const mUi = new Ui(mModal);
mUi.modal.hide();

const mProject = new Project('title', 'descri', '10/10/2010', false);
mProject.display();
