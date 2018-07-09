var flag;
var id = null;
var check_flag = false;
document.addEventListener( 'DOMContentLoaded', function( event ) {
    if(localStorage.length > 0){
        let task_list = JSON.parse(localStorage.getItem("s_add_obj_key"));
        id = task_list[task_list.length-1].id;
        id++;
        document.querySelector(".empty_warring").style.display = "none";
    }else{
        id = 0;
        document.querySelector(".empty_warring").style.display = "block";
        document.querySelector(".content_inner").style.display = "none";
    } 
    rendering();
    add_sort_options();
});

document.querySelector("#test").onchange = function(){
    if(!flag){
        flag = true;
        let sort_list =  JSON.parse(localStorage.getItem("s_add_obj_key")),
        old_sort_list =  JSON.parse(localStorage.getItem("s_add_obj_key")),
        parent = document.querySelector(".todo_list_wrap");
        function compare(a, b) {
            const priorityA = a.priority;
            const priorityB = b.priority;
            let comparison = 0;
            if (priorityA > priorityB) {
                comparison = 1;
            }else if (priorityA < priorityB) {
                comparison = -1;
            }
            return comparison;
        }
        sort_list.sort(compare);  
        parent.innerHTML = null;
        sort_list.forEach(function(sort_list_item,i){
            old_sort_list.forEach(function(item,index){ 
                if(item.id == sort_list_item.id){
                    parent.innerHTML +="<div class='task_item' data-index='"+index+"'><h2 class='task_item_name'>Задача "+ sort_list_item.title +"</h2><div class='project_name_priority_wrap'><p class='project_item_name_wrap'>Проект: <span class='project_item_name'>"+ sort_list_item.obj_title +"</span></p><p class='priority'><div class='priority_wrap'><span>Приоритет: </span>"+ sort_list_item.priority +"</p></div></div><p class='description'>"+ sort_list_item.description +"</p><div class='bnts_wrap'><button onclick='edit_click_Function(event)' class='edit'>Изменить</button><button onclick='remove_item_click_Function(event)' class='remove-item'>Закрыть</button><button onclick='dropDownFunction(event)' id='dropdown' class='dropdown'>Развернуть</button></div></div>";
                }
            });     
        });
        sort_by_name();
    }else{
        rendering();
        flag = false;
        sort_by_name();
    }
};

document.querySelector("#sort_list").onchange = function(){
    sort_by_name();
};

document.getElementById('add-item').onclick = function() {
    check_fields();
    if(check_flag == true){
        let = task_title = document.querySelector(".create_task #task_title").value,         
        project_title = document.querySelector(".create_task #project_title").value,         
        task_priority = document.querySelector(".create_task #priority").value,         
        task_description = document.querySelector(".create_task #description").value;       
        item = new Object(id,task_title,project_title,task_description,task_priority);
        add(item);
        id++;
        rendering();
        document.querySelector(".create_task #task_title").value = "",
        document.querySelector(".create_task #project_title").value = "",
        document.querySelector(".create_task #description").value = "",
        document.querySelector(".create_task #priority").value = "1";
        document.querySelector(".create_task").style.display = "none";
        document.querySelector(".option_block").style.display = "block";
        check_flag = false;
    }
};

document.querySelector('.edit_task_wrap .cansel').onclick = function() {
    clear_fields();
};

document.querySelector('.create_task .cansel').onclick = function() {
    clear_fields();
};

document.getElementById('add_task_btn').onclick = function() {
    document.querySelector(".option_block").style.display = "none";
    document.querySelector(".edit_task_wrap").style.display = "none";
    document.querySelector(".create_task").style.display = "block";
};

document.querySelector('.edit-save').onclick = function() {
    check_fields();
    if(check_flag == true){
        let list = JSON.parse(localStorage.getItem("s_add_obj_key")),
        index = document.querySelector("#hidden_index").value,
        task_title = document.querySelector(".edit_task_wrap #task_title").value,
        project_title = document.querySelector(".edit_task_wrap #project_title").value,
        task_priority = document.querySelector(".edit_task_wrap #priority").value,
        task_description = document.querySelector(".edit_task_wrap #description").value;
        list[index].title  = task_title,
        list[index].obj_title = project_title,
        list[index].priority = task_priority,
        list[index].description = task_description;
        localStorage.setItem("s_add_obj_key",JSON.stringify(list));
        rendering();
        document.querySelector(".edit_task_wrap").style.display = "none";
        document.querySelector(".option_block").style.display = "block";
        add_sort_options();
        check_flag = false;
    }
};

function Object(id,title,obj_title,description,priority){
    this.title = title;
    this.obj_title = obj_title;
    this.description = description;
    this.priority = priority;
    this.id = id;
}

function add(item){
        if (localStorage.length == 0){
            let list = [];
            list.push(item);
            localStorage.setItem("s_add_obj_key",JSON.stringify(list));
        }else{
            let list = JSON.parse(localStorage.getItem("s_add_obj_key"));
            list.push(item);
            localStorage.setItem("s_add_obj_key",JSON.stringify(list));
        }
        add_sort_options();
        document.querySelector(".empty_warring").style.display = "none";
        document.querySelector(".content_inner").style.display = "block";
}
function dropDownFunction(event) {
    let target = event.target,
    description = target.parentElement.parentElement.querySelector(".description");
    if(window.getComputedStyle(description).display == "none"){
        description.style.display = "block";
        target.innerHTML = "Свернуть";
    }
    else{
        description.style.display = "none";
        target.innerHTML = "Развернуть";
    }
}

function edit_click_Function(event) {
        let target = event.target;
        index = target.parentElement.parentElement.dataset.index;
        edit(index);
        document.querySelector(".edit_task_wrap").style.display = "block";
        document.querySelector(".option_block").style.display = "none";
}

function remove_item_click_Function(event) {
    let target = event.target;
    index = target.parentElement.parentElement.dataset.index;
    remove(index);
    document.querySelector(".edit_task_wrap").style.display = "none";
    document.querySelector(".option_block").style.display = "block";
}

function rendering(){ 
    let parent = document.querySelector(".todo_list_wrap");
    parent.innerHTML = null;
    if (localStorage.length > 0){
        let list =  JSON.parse(localStorage.getItem("s_add_obj_key"));
        list.forEach(function(item){
            parent.innerHTML +="<div class='task_item'><h2 class='task_item_name'>Задача "+ item.title +"</h2><div class='project_name_priority_wrap'><p class='project_item_name_wrap'>Проект: <span class='project_item_name'>"+ item.obj_title +"</span></p><div class='priority_wrap'><span>Приоритет: </span><p class='priority'>"+ item.priority +"</p></div></div><p class='description'>"+ item.description +"</p><div class='bnts_wrap'><button onclick='edit_click_Function(event)' class='edit'>Изменить</button><button onclick='remove_item_click_Function(event)' class='remove-item'>Закрыть</button><button onclick='dropDownFunction(event)' id='dropdown' class='dropdown'>Развернуть</button></div></div>";
        }); 
        index_items();
    }
}

function index_items(){
    let classesNodeList = document.querySelectorAll(".task_item"),
    classes = Array.prototype.map.call(classesNodeList, function(element, value) {
        element.dataset.index = value;
    });
}

function remove(index){
    let list = JSON.parse(localStorage.getItem("s_add_obj_key"));
    list.splice(index,1);
    index_items();
    localStorage.setItem("s_add_obj_key",JSON.stringify(list));
    rendering();
    add_sort_options();
    if(list.length == 0){
        localStorage.clear();
        document.querySelector(".empty_warring").style.display = "block";
        document.querySelector(".content_inner").style.display = "none";
    }
}

function edit(index){
    let list = JSON.parse(localStorage.getItem("s_add_obj_key"));
    let task_title = list[index].title,
    project_title = list[index].obj_title,
    priority = list[index].priority,
    description = list[index].description;
    document.querySelector("#hidden_index").value = index;
    document.querySelector(".edit_task_wrap #task_title").value = task_title;
    document.querySelector(".edit_task_wrap #project_title").value = project_title;
    document.querySelector(".edit_task_wrap #priority").value = priority;
    document.querySelector(".edit_task_wrap #description").value = description;
    check_flag == false;
}

function add_sort_options(){
    let name_list_sort_options = JSON.parse(localStorage.getItem("s_add_obj_key"));
    select = document.querySelector("#sort_list");
    select.innerHTML = null;
    select.innerHTML +='<option value="Все">Все</option>';
    name_list_sort_options.forEach(function(item, value){
        select.innerHTML +='<option value="'+ name_list_sort_options[value].obj_title + '">' + name_list_sort_options[value].obj_title +'</option>';
    });
    let test_name_list_sort_options = [];
    let classesNodeList = document.querySelectorAll("#sort_list option"),
    classes = Array.prototype.map.call(classesNodeList, function(element, value) {
        test_name_list_sort_options[value] = element;
    });
    var unique = function(origArr) {
        var newArr = [],
            origLen = origArr.length,
            found, x, y;
        for (x = 0; x < origLen; x++) {
            found = undefined;
            for (y = 0; y < newArr.length; y++) {
                if (origArr[x].value === newArr[y].value) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                newArr.push(origArr[x]);
            }
        }
        return newArr;
    }
    let arrUnique = unique(test_name_list_sort_options);
    select.innerHTML = null;
    arrUnique.forEach(function(item, value){
        select.innerHTML +='<option value="'+ item.value + '">' + item.value +'</option>';
    });
}

function sort_by_name(){
    let selected_option = document.querySelector("#sort_list").selectedOptions[0].text,
    name_list = document.querySelectorAll(".project_item_name"),
    task_items = [],
    classes = Array.prototype.map.call(name_list, function(element, value) {
        task_items[value] = element;
    });
    if(selected_option == "Все"){
        task_items.forEach(function(item, value_inner){
            item.parentElement.parentElement.parentElement.style.display = "block";   
        });
    }
    else{
        task_items.forEach(function(item_inner, value_inner){
            if(item_inner.innerHTML == selected_option){
                 item_inner.parentElement.parentElement.parentElement.style.display = "block";
            }
            else{
                item_inner.parentElement.parentElement.parentElement.style.display = "none";
            }
         });
    }
}

function check_fields(){
    let create_task = document.querySelector(".create_task"),
    edit_task_wrap = document.querySelector(".edit_task_wrap");
    if(window.getComputedStyle(create_task).display == "block"){
        let task_title_lenght = document.querySelector(".create_task #task_title").value.length,
        project_title_lenght = document.querySelector(".create_task #project_title").value.length,
        description_lenght = document.querySelector(".create_task #description").value.length;
        if(task_title_lenght == 0 || project_title_lenght == 0 || description_lenght == 0){
            alert("Заполните пожалуйста все поля");
            
        }else{
            check_flag = true;
        }
    }
    else{
        let edit_task_title_lenght = document.querySelector(".edit_task_wrap #task_title").value.length,
        edit_project_title_lenght = document.querySelector(".edit_task_wrap #project_title").value.length,
        edit_description_lenght = document.querySelector(".edit_task_wrap #description").value.length; 
        if(edit_task_title_lenght == 0 || edit_project_title_lenght == 0 || edit_description_lenght == 0){
            alert("Заполните пожалуйста все поля");
            
        }else{
            check_flag = true;
        } 
    }
}

function clear_fields(){
    document.querySelector(".edit_task_wrap #task_title").value = "";
    document.querySelector(".edit_task_wrap #project_title").value = "";
    document.querySelector(".edit_task_wrap #description").value = "";
    document.querySelector(".create_task #task_title").value = "";
    document.querySelector(".create_task #project_title").value = "";
    document.querySelector(".create_task #description").value = "";
    document.querySelector(".edit_task_wrap").style.display = "none";
    document.querySelector(".create_task").style.display = "none";
    document.querySelector(".option_block").style.display = "block";
}