/* eslint-env browser */
/* eslint arrow-parens: ["error", "as-needed"] */

const Modal = function Modal() {
  this.el = document.querySelector('.addForm');
  this.nameEl = this.el.querySelector('input.name');
  this.descEl = this.el.querySelector('input.descrition');
  this.dueDateEl = this.el.querySelector('input.dueDate');
  this.highPriorEl = this.el.querySelector('input.highPriorCB');
  this.buttons = this.el.querySelectorAll('input[type="button"]');

  const cancelBtnEl = document.querySelector('.addForm .cancelBtn');
  cancelBtnEl.onclick = () => this.hide();
};

Modal.prototype.show = function show() {
  this.clear();
  this.el.style.display = 'block';

  return new Promise((res, rej) => {
    this.buttons.forEach(btn => {
      const b = btn;
      b.onclick = e => {
        this.hide();
        if (e.target.value === 'Accept') {
          res({
            name: this.nameEl.value,
            desc: this.descEl.value,
            dueDate: this.dueDateEl.value,
            highPrior: this.highPriorEl.checked,
          });
          this.clear();
        } else {
          res(false);
        }
        rej(new Error());
      };
    });
  });
};

Modal.prototype.edit = function edit(item) {
  this.el.style.display = 'block';

  this.nameEl.value = item.name;
  this.descEl.value = item.description;
  this.dueDateEl.value = item.dueDate;
  this.highPriorEl.checked = item.priority;

  return new Promise((res, rej) => {
    this.buttons.forEach(btn => {
      const b = btn;
      b.onclick = e => {
        this.hide();
        if (e.target.value === 'Accept') {
          res({
            name: this.nameEl.value,
            desc: this.descEl.value,
            dueDate: this.dueDateEl.value,
            highPrior: this.highPriorEl.checked,
          });
          this.clear();
        } else {
          res(false);
        }
        rej(new Error());
      };
    });
  });
};

Modal.prototype.clear = function clear() {
  this.nameEl.value = null;
  this.descEl.value = null;
  this.dueDateEl.value = null;
  this.highPriorEl.checked = false;
  this.buttons.forEach(btn => {
    const b = btn;
    b.onclick = null;
  });
};

Modal.prototype.hide = function hide() {
  this.el.style.display = 'none';
};

const ListModelator = function ListModelator(el) {
  this.items = [];
  this.el = el;
  this.selected = null;
  this.display();
};

ListModelator.prototype.display = function display() {
  const ul = this.el;

  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  this.items.forEach((item, index) => {
    const compText = document.createElement('span');
    compText.textContent = '<<Completed>>';
    compText.style.backgroundColor = 'green';

    const ebtn = document.createElement('input');
    ebtn.setAttribute('type', 'button');
    ebtn.value = 'edit';
    ebtn.onclick = e => { e.stopPropagation(); item.edit(e); };

    const li = document.createElement('li');
    li.setAttribute('index', index);
    li.onclick = e => { e.stopPropagation(); this.selectElement(index); };
    li.style.backgroundColor = index === this.selected ? '#4a4a4a' : null;


    const cb = document.createElement('input');
    cb.setAttribute('type', 'checkbox');
    cb.onclick = e => {
      e.stopPropagation();
      this.toggleCB(index, e);
    };
    cb.checked = item.checked;


    const lb = document.createElement('label');
    lb.textContent = item.name;

    const a = document.createElement('input');
    a.setAttribute('type', 'button');
    a.value = 'Remove';
    a.onclick = e => {
      e.stopPropagation();
      this.remove(index);
    };

    li.appendChild(cb);
    li.appendChild(lb);
    li.appendChild(ebtn);
    li.appendChild(a);

    if (item.checked) {
      li.appendChild(compText);
    }

    ul.appendChild(li);
  });

  const event = new Event('changeDetected');
  window.dispatchEvent(event);
};

ListModelator.prototype.toggleCB = function toggleCB(index, e) {
  const el = e.target;
  this.items[index].checked = el.checked;

  this.display();
};

ListModelator.prototype.remove = function remove(index) {
  this.items.splice(index, 1);
  const event = new CustomEvent('removedElement', {
    detail: { index },
  });
  this.el.dispatchEvent(event);
  this.display();
};

ListModelator.prototype.add = function add(item) {
  this.items.push(item);
  this.display();
};

ListModelator.prototype.selectElement = function selectElement(index) {
  const event = new CustomEvent('selectElement', {
    detail: { index },
  });
  this.el.dispatchEvent(event);

  if (this.items[index]) {
    this.selected = index;
  }
  this.display();
};

const SubTask = function SubTask(name, checked = false) {
  this.checked = checked;
  this.name = name;
};

SubTask.prototype.edit = function edit(e) {
  const ul = e.target.closest('ul');
  const lis = ul.querySelectorAll('li');

  lis.forEach(li => {
    if (li.querySelector('input.edit')) {
      li.removeChild(li.querySelector('input.edit'));
    }
    li.children[1].style.display = 'contents';
    const actBtn = li.children[2];
    actBtn.value = 'edit';
    actBtn.onclick = e => { e.stopPropagation(); this.edit(e); };
  });


  const el = e.target.closest('li');
  const lb = el.children[1];
  const a = document.createElement('input');
  a.setAttribute('type', 'text');
  a.setAttribute('class', 'edit');
  a.value = lb.textContent;
  a.onclick = e => { e.stopPropagation(); };
  const actBtn = el.children[2];
  actBtn.value = 'accept';
  actBtn.onclick = e => { e.stopPropagation(); this.name = a.value; el.click(); };
  el.insertBefore(a, el.children[1]);
  lb.style.display = 'none';
};

const Project = function Project(title, desc, dueDate, prior, checked = false, checklist = null) {
  this.el = document.querySelector('div.project');
  this.name = title;
  this.description = desc;
  this.dueDate = dueDate;
  this.checked = checked;
  this.priority = prior;
  this.checklist = new ListModelator(this.el.querySelector('div.checkList > ul'));

  if (checklist) {
    checklist.forEach(item => {
      this.checklist.add(new SubTask(item.name, item.checked));
    });
  }
};

Project.prototype.edit = function edit() {
  const modal = new Modal();
  modal.edit(this).then(resp => {
    if (resp) {
      this.name = resp.name;
      this.description = resp.desc;
      this.dueDate = resp.dueDate;
      this.priority = resp.highPrior;
      const event = new Event('Projectupdated');
      window.dispatchEvent(event);
      this.display();
    }
  });
};

Project.prototype.display = function display() {
  this.el.style.display = 'block';
  const titleEl = this.el.querySelector('h1');
  const descEl = this.el.querySelector('div > p');
  const dueDateEl = this.el.querySelector('div > span');
  const highPriorEl = this.el.querySelector('label.highPriorLB');
  const editEl = this.el.querySelector('input.edit');

  const addBtn = this.el.querySelector('div.ui input[type="button"]');
  addBtn.onclick = () => this.addToCL();

  const compText = document.createElement('span');

  titleEl.textContent = this.name;
  descEl.textContent = this.description;
  dueDateEl.textContent = `Due date: ${this.dueDate}`;

  if (highPriorEl.firstChild) {
    highPriorEl.removeChild(highPriorEl.firstChild);
  }

  if (this.priority) {
    compText.textContent = '<<High priority>>';
    compText.style.backgroundColor = 'green';
    highPriorEl.appendChild(compText);
  } else {
    compText.textContent = '<<Low priority>>';
    compText.style.backgroundColor = 'red';
    highPriorEl.appendChild(compText);
  }

  editEl.onclick = () => { this.edit(); };

  this.checklist.display();
};

Project.prototype.addToCL = function addToCL() {
  const text = this.el.querySelector('div.ui input[type="text"]').value;
  this.checklist.add(new SubTask(text));
};

const ProjectList = function ProjectList(obj) {
  this.el = document.querySelector('div.projectList');
  this.list = new ListModelator(this.el.querySelector('ul'));
  this.modal = new Modal();

  if (obj) {
    obj.list.items.forEach(itm => {
      const mProject = new Project(
        itm.name,
        itm.description,
        itm.dueDate,
        itm.priority,
        itm.checked,
        itm.checklist.items,
      );
      this.list.add(mProject);
    });
  }

  window.addEventListener('Projectupdated', () => this.list.display());

  this.list.el.addEventListener('selectElement', e => {
    const prj = this.list.items[e.detail.index];
    if (prj) {
      prj.display();
    }
  });

  this.list.el.addEventListener('removedElement', () => {
    const projectView = document.querySelector('div.project');
    if (this.list.items.length > 0) {
      this.list.selectElement(0);
    } else {
      projectView.style.display = 'none';
    }
  });

  window.addEventListener('changeDetected', () => {
    localStorage.setItem('ProjectList', JSON.stringify(this));
  });

  const openModalBtn = this.el.querySelector('input[type="button"]');
  openModalBtn.onclick = () => this.modal.show().then(resp => {
    if (resp) {
      this.addProject(resp);
    }
  });


  if (this.list.items.length > 0) {
    this.list.selectElement(0);
  }
};

ProjectList.prototype.addProject = function addProject(resp) {
  const mProject = new Project(
    resp.name,
    resp.desc,
    resp.dueDate,
    resp.highPrior,
  );
  this.list.add(mProject);
  this.list.selectElement(this.list.items.length - 1);
};

// eslint-disable-next-line no-unused-vars
let mProjectList;

const lb = localStorage.getItem('ProjectList');

if (lb) {
  mProjectList = new ProjectList(JSON.parse(lb));
} else {
  mProjectList = new ProjectList();
}
