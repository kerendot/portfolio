var KEY_TODOS = 'todos';

console.log('Todos!');

var gState = getInitialState();


function getInitialState() {
    var state = loadFromStorage(KEY_TODOS);
    if (!state) {
        state = {
            todos: getInitialTodos(),
            archivedTodos: []
        }
    }
    return state;
}

function init() {
    renderTodos(gState.todos);
}

function getInitialTodos() {
    var todos = [];
    todos.push(getTodo('Learn Javascript'));
    todos.push(getTodo('Practive HTML'));
    todos.push(getTodo('Master CSS'));
    return todos;
}

function getTodo(txt) {
    return { txt: txt, isDone: false, isArchived: false }
}

function renderTodos(todos) {
    var elTodos = document.querySelector('.todos');

    var strHtmls = todos.map(function (todo, idx) {
        var strChecked = (todo.isDone) ? ' checked ' : '';
        // var strArchived = (todo.isArchived) ? ' archived ' : '';
        var strArrows = (todo.isDone) ? ' hidden ' : '';
        return `<li class="flex space-between">
                    <div>
                        <input type="checkbox" id="c${idx}" ${strChecked} 
                            onchange="todoClicked(${idx},${todo.isArchived})" />
                        <label for="c${idx}"><span></span>${todo.txt}</label>
                    </div>
                    <div>
                        <span class="move-arrows" ${strArrows}>
                            <i class="fa fa-arrow-up" onclick="moveTodo(${idx},true)"></i> 
                            <i class="fa fa-arrow-down" onclick="moveTodo(${idx},false)"></i>
                        </span>
                    </div>                    
                </li>`

        // `<li>
        //             <input type="checkbox" id="c${idx}" ${strChecked} onchange="todoClicked(${idx})" />
        //             <label for="c${idx}"><span></span>${todo.txt}</label>
        //         </li>`

    });

    elTodos.innerHTML = strHtmls.join('');
}

function todoClicked(idx, isArchived) {
    var todo = (isArchived) ? gState.archivedTodos[idx] : gState.todos[idx];
    todo.isDone = !todo.isDone;
    saveToStorage(KEY_TODOS, gState);
}

function archiveItems() {
    gState.todos = gState.todos.filter(function (todo) {
        if (todo.isDone) {
            todo.isArchived = true;
            gState.archivedTodos.push(todo);
        }
        return !todo.isDone;
    })
    renderTodos(gState.todos);
    saveToStorage(KEY_TODOS, gState);
}

function addTodo() {
    var elInput = document.querySelector('.add-todo').querySelector('input');
    var txt = elInput.value;
    var todo = getTodo(txt);
    elInput.value = '';
    gState.todos.push(todo);
    renderTodos(gState.todos);
    saveToStorage(KEY_TODOS, gState);
}

function setFilter(event) {
    if (event.target.value) {
        var selectedFilter = event.target.value;
        var todos;
        var elRestoreBtn = document.querySelector('.restore-btn');
        var elTrashBtn = document.querySelector('.trash-btn');
        switch (selectedFilter) {
            case 'active':
                todos = gState.todos;
                elRestoreBtn.classList.add('hidden');
                elTrashBtn.classList.remove('hidden');
                break;
            case 'archived':
                todos = gState.archivedTodos;
                elRestoreBtn.classList.remove('hidden');
                elTrashBtn.classList.add('hidden');
                break;
            case 'all':
                todos = gState.todos.concat(gState.archivedTodos);
                elRestoreBtn.classList.add('hidden');
                elTrashBtn.classList.add('hidden');
                break;
        }
        renderTodos(todos);
    }
}

function moveTodo(idx, isUp) {
    if (isUp) moveItemBackward(gState.todos, idx);
    else moveItemForward(gState.todos, idx);
    renderTodos(gState.todos);
    saveToStorage(KEY_TODOS, gState);
}

function restoreItems() {
    gState.archivedTodos = gState.archivedTodos.filter(function (todo) {
        if (!todo.isDone) {
            todo.isArchived = false;
            gState.todos.push(todo);
        }
        return todo.isDone;
    })
    renderTodos(gState.archivedTodos);
    saveToStorage(KEY_TODOS, gState);
}