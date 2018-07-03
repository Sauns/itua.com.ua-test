var flag;
var id = null;
var check_flag = false;
$( document ).ready(function() {
    if(localStorage.length > 0){
        let task_list = JSON.parse(localStorage.getItem("s_add_obj_key"));
        id = task_list[task_list.length-1].id;
        id++;
        $(".empty_warring").css("display","none");
    }else{
        id = 0;
        $(".empty_warring").css("display","block");
        $(".content_inner").css("display","none");
    } 
    rendering();
    add_sort_options();
});

$("#test").change(function(){
    if(!flag){
        flag = true;
        let sort_list =  JSON.parse(localStorage.getItem("s_add_obj_key")),
        old_sort_list =  JSON.parse(localStorage.getItem("s_add_obj_key")),
        parent = $(".todo_list_wrap");
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
        parent.empty();
        sort_list.forEach(function(sort_list_item,i){
            old_sort_list.forEach(function(item,index){ 
                if(item.id == sort_list_item.id){
                    parent.append("<div class='task_item' data-index='"+index+"'><h2 class='task_item_name'>Задача "+ sort_list_item.title +"</h2><div class='project_name_priority_wrap'><p class='project_item_name_wrap'>Проект: <span class='project_item_name'>"+ sort_list_item.obj_title +"</span></p><p class='priority'><div class='priority_wrap'><span>Приоритет: </span>"+ sort_list_item.priority +"</p></div></div><p class='description'>"+ sort_list_item.description +"</p><div class='bnts_wrap'><button class='edit'>Изменить</button><button class='remove-item'>Закрыть</button><button class='dropdown'>Развернуть</button></div></div>");
                }
            });     
        });
        sort_by_name();
    }else{
        rendering();
        flag = false;
        sort_by_name();
    }
});

$("#sort_list").change(function(){
    sort_by_name();
});

$('body').on('click','.edit',function(){
        let index = $(this).parent().parent().data("index");
        edit(index);
        $(".edit_task_wrap").css("display","block");
        $(".option_block, .create_task").css("display","none");
});

$('body').on('click','.dropdown',function(){
    if($(this).parent().parent().find(".description").css("display") == "none"){
        $(this).text('Свернуть');
        $(this).parent().parent().find(".description").css("display","block");
    }else{
            $(this).text('Развернуть');
        $(this).parent().parent().find(".description").css("display","none");  
    }
});

$('.add-item').on('click',function(){
    check_fields();
    if(check_flag == true){
        let task_title = $("#task_title").val(),
            project_title = $("#project_title").val(),
            task_priority = $("#priority").val(),
            task_description = $("#description").val();
            item = new Object(id,task_title,project_title,task_description,task_priority);
            add(item);
            id++;
            rendering();
            $("#task_title, #project_title, #description").val("");
            $('#priority').removeAttr('selected').find('option:first').attr('selected','selected');
            $(".create_task").css("display","none");
            $(".option_block").css("display","block");
            check_flag = false;
    }
});

$('body').on('click','.cansel',function(){
    $("#task_title, #project_title, #description").val("");
    $(".edit_task_wrap, .create_task").css("display", "none");
    $(".option_block").css("display", "block");
});
$('body').on('click','.add_task_btn',function(){
    $(".option_block, .edit_task_wrap").css("display","none");
    $(".create_task").css("display", "block");
});

$('body').on('click','.edit-save',function(){
    check_fields();
    if(check_flag == true){
        let list = JSON.parse(localStorage.getItem("s_add_obj_key")),
        index = $("#hidden_index").val(),
        task_title = $(".edit_task_wrap #task_title").val(),
        project_title = $(".edit_task_wrap #project_title").val(),
        task_priority = $(".edit_task_wrap #priority").val(),
        task_description = $(".edit_task_wrap #description").val();
        list[index].title  = task_title,
        list[index].obj_title = project_title,
        list[index].priority = task_priority,
        list[index].description = task_description;
        localStorage.setItem("s_add_obj_key",JSON.stringify(list));
        rendering();
        $(".edit_task_wrap").css("display","none");
        $(".option_block").css("display","block");
        check_flag = false;
    }
});
$('body').on('click','.remove-item',function(){
    let index = $(this).parent().parent().data("index");
    remove(index);
    $(".edit_task_wrap").css("display","none");
    $(".option_block").css("display","block");
});

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
        $(".empty_warring").css("display","none");
        $(".content_inner").css("display","block");
}

function rendering(){ 
    let parent = $(".todo_list_wrap");
    parent.empty();
    if (localStorage.length > 0){
        let list =  JSON.parse(localStorage.getItem("s_add_obj_key"));
        list.forEach(function(item){
            parent.append("<div class='task_item'><h2 class='task_item_name'>Задача "+ item.title +"</h2><div class='project_name_priority_wrap'><p class='project_item_name_wrap'>Проект: <span class='project_item_name'>"+ item.obj_title +"</span></p><div class='priority_wrap'><span>Приоритет: </span><p class='priority'>"+ item.priority +"</p></div></div><p class='description'>"+ item.description +"</p><div class='bnts_wrap'><button class='edit'>Изменить</button><button class='remove-item'>Закрыть</button><button class='dropdown'>Развернуть</button></div></div>");
        }); 
        index_items();
    }
}

function index_items(){
    let i = 0;
    let tasks = $(".task_item");
    $.each(tasks, function(value) {
        $( this ).attr("data-index",i);
        i++;
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
        $(".empty_warring").css("display","block");
        $(".content_inner").css("display","none");
    }
}

function edit(index){
    let list = JSON.parse(localStorage.getItem("s_add_obj_key"));
    let task_title = list[index].title,
    project_title = list[index].obj_title,
    priority = list[index].priority,
    description = list[index].description;
    $("#hidden_index").val(index);
    $(".edit_task_wrap #task_title").val(task_title);
    $(".edit_task_wrap #project_title").val(project_title);
    $('.edit_task_wrap #priority').val(priority);
    $(".edit_task_wrap #description").val(description);
    check_flag == false;
}

function add_sort_options(){
    let name_list_sort_options = JSON.parse(localStorage.getItem("s_add_obj_key"));
    select = $("#sort_list"); 
    select.empty();
    select.append('<option value="all">Все</option>');
    $.each(name_list_sort_options, function(value) {
        select.append('<option value="'+ name_list_sort_options[value].obj_title + '">' + name_list_sort_options[value].obj_title +'</option>');
    });
    $("#sort_list option").val(function(idx, val) {
        $(this).siblings('[value="'+ val +'"]').remove();
    });
}

function sort_by_name(){
    let name_list = $(".project_item_name"),
    selected_option = $("#sort_list option:selected").text();
    if(selected_option == "Все"){
        $.each(name_list, function(value) {
            let option_name = $(this).text();
            $(this).parent().parent().parent().css("display","block");
        });    
    }else{
        $.each(name_list, function(value) {
            let option_name = $(this).text();
            if(selected_option == option_name){
                $(this).parent().parent().parent().css("display","block");
            }
            else{
                $(this).parent().parent().parent().css("display","none");
            }
        });
    }
}
function check_fields(){
    let create_task = $(".create_task"),
    edit_task_wrap = $(".edit_task_wrap");
    if(create_task.css("display") == "block"){
        let task_title_lenght = $(".create_task #task_title").val().length,
        project_title_lenght = $(".create_task #project_title").val().length,
        description_lenght = $(".create_task #description").val().length;
        if(task_title_lenght == 0 || project_title_lenght == 0 || description_lenght == 0){
            alert("Заполните пожалуйста все поля");
            
        }else{
            check_flag = true;
        }
    }
    if(edit_task_wrap.css("display") == "block"){
        let edit_task_title_lenght = $(".edit_task_wrap #task_title").val().length,
        edit_project_title_lenght = $(".edit_task_wrap #project_title").val().length,
        edit_description_lenght = $(".edit_task_wrap #description").val().length;
        if(edit_task_title_lenght == 0 || edit_project_title_lenght == 0 || edit_description_lenght == 0){
            alert("Заполните пожалуйста все поля");
            
        }else{
            check_flag = true;
        } 
    }
}