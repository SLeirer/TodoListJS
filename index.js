//////////////////////////////////////////////////////////
//////////////          TODO                //////////////
//////////////////////////////////////////////////////////
//
//  *   show deleted list / show deleted button is persistant for other lists
//

// events
document.getElementById("addNewList").addEventListener('click',addButton);
document.getElementById("addNewEntry").addEventListener('click',addEntryToList);
document.getElementById("nameOfList").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key == "Enter") {
        document.getElementById("addNewList").click();
    }
});
document.getElementById("listenEintrag").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key == "Enter") {
        document.getElementById("addNewEntry").click();
    }
});

// global variables
let listOfTodoLists = [];
let selectedListIndex;
let showDeletedList = false;

// objects
class List {
    listName = "";
    listData = [];
    listDataDeleted = [];
}

// functions
function addButton(){
    let input = document.getElementById("nameOfList");

    listOfTodoLists.forEach(element => {
        if(element.Name == input.value){
            alert("List already exists");
            input.value = "";
            return;
        }
    });
    
    // breaks out of funtion to prevent lists with no names
    if(input.value == ""){
        return;
    }

    // names are assigned and added to list
    let list = new List();
    list.Name = input.value;
    listOfTodoLists.push(list);

    input.value = "";
    
    // gives out names of list in console for testing purposes
    for(let i=0; i < listOfTodoLists.length; i++){
        console.log(i + " " + listOfTodoLists[i].Name);
    }
    console.log("___________________");

    //creates table elements
    updateTodolists();
}

function addEntryToList(){
    let input = document.getElementById("listenEintrag");

    if( listOfTodoLists[selectedListIndex].listData.includes(input.value) ||
        listOfTodoLists[selectedListIndex].listDataDeleted.includes(input.value)){
            alert("Entry already exists");
            input.value = "";
            return;
    }

    // breaks out of funtion to prevent lists with no names
    if(input.value == ""){
        return;
    }

    let entry = input.value;
    listOfTodoLists[selectedListIndex].listData.push(entry);

    input.value = "";

    updateActualList(selectedListIndex);
}

function updateTodolists(){
    //creates table elements
    let tableBody = document.getElementById("TodoListen");
    let dataHtml = "";
    let counter = 1;

    //sorting by comparing names of objects
    listOfTodoLists.sort((a, b) => {
        let fa = a.Name.toLowerCase();
        let fb = b.Name.toLowerCase();

        if(fa < fb){
            return -1;
        }
        if(fa > fb){
            return 1;
        }
        return 0;
    });
    
    //creates table content string
    listOfTodoLists.forEach(element => {
        dataHtml += "<tr>"+
                        "<td width=\"30\">"
                            + counter +
                        "</td>" +
                        "<td width=\"60\" class=\"listItem\">"
                            + element.Name +
                        "</td>" +
                        "<td>" +
                            "<input type=\"radio\" name=\"listItem\" id=\"listItem" + (counter-1) + "\" value=\"" + (counter-1) +"\">" +
                        "</td>" +
                    "</tr>";
        counter++;
    })

    console.log(dataHtml);

    tableBody.innerHTML = dataHtml;

    //creates eventlisteners for dynamically created radio buttons
    counter = 0;
    listOfTodoLists.forEach(element => {
        let temp = "listItem" + counter;
        document.getElementById(temp).addEventListener('click', displayList); 
        counter++;
    });
}

function displayList(){
    showDeletedList = false;
    selectedListIndex = this.value;
    let title = document.getElementById("currentListTitel");
    
    title.innerText = "Current List: " + listOfTodoLists[selectedListIndex].Name;

    document.getElementById("listenEintrag").hidden = false;
    document.getElementById("addNewEntry").hidden = false;
    document.getElementById("labelListenEintrag").hidden = false;
    
    updateActualList(selectedListIndex);
}

function updateActualList(selectedListIndex){
    let tableBody = document.getElementById("currentTodoList");
    let dataHtml = "";
    let counter = 1;

    if(listOfTodoLists[selectedListIndex].listDataDeleted.length > 0){
        //when deleted list has at least 1 entry
        if(!showDeletedList){
            // deleted list is not being shown

            //creates button
            document.getElementById("deletedEntries").innerHTML = "<tr><td><input type=\"button\" name=\"showDeletedListBtn\" id=\"showDeletedListBtn\" value=\"Show Deleted Entries\"></td></tr>";

            // create eventlistener for button
            document.getElementById("showDeletedListBtn").addEventListener('click', showDeletedListEntries);
            showDeletedList = true;
        }
    }

    if(listOfTodoLists[selectedListIndex].listData.length == 0){
        // when list is empty
        tableBody.innerText = "List is Empty";
        return;
    }
    else{
        //list has at least one entry
        listOfTodoLists[selectedListIndex].listData.forEach(element => {
            dataHtml += "<tr>"+
                        "<td width=\"30\">"
                            + counter +
                        "</td>" +
                        "<td width=\"60\" class=\"listItem\">"
                            + element +
                        "</td>" +
                        "<td>" +
                            "<input type=\"radio\" name=\"subListItem\" id=\"subListItem" + (counter-1) + "\" value=\"" + (counter-1) +"\">" +
                        "</td>" +
                        "</tr>";
            counter++;
        });
    }

    tableBody.innerHTML = dataHtml;

    //creating eventlisteners for dynamically created buttons
    counter = 0;
    listOfTodoLists[selectedListIndex].listData.forEach(element => {
        let temp = "subListItem" + counter;
        document.getElementById(temp).addEventListener('click', deleteList); 
        counter++;
    });
}

function deleteList(){
    let currentEntryIndex = this.value;
    //adds deleted entry to bin list
    listOfTodoLists[selectedListIndex].listDataDeleted.push(listOfTodoLists[selectedListIndex].listData[currentEntryIndex]);
    listOfTodoLists[selectedListIndex].listData.splice(currentEntryIndex, 1);
    updateActualList(selectedListIndex);
}

function showDeletedListEntries(){
    let tableBody = document.getElementById("deletedEntries");
    let dataHtml = "<tr><td>Deleted Entries</td></tr>";
    let counter = 1;

    listOfTodoLists[selectedListIndex].listDataDeleted.forEach(element => {
        dataHtml += "<tr>"+
                        "<td width=\"30\">" +
                            counter +
                        "</td>" + 
                        "<td width=\"60\" class=\"listItem\">"
                            + element +
                        "</td>" +
                        "<td>" +
                            "<input type=\"radio\" name=\"deletedSubListItem\" id=\"deletedSubListItem" + (counter-1) + "\" value=\"" + (counter-1) +"\">" +
                        "</td>" +
                    "</tr>";
            counter++;
    });

    dataHtml += "<tr><td><input type=\"button\" name=\"hideDeletedListBtn\" id=\"hideDeletedListBtn\" value=\"Hide Deleted Entries\"></td></tr>";

    tableBody.innerHTML = dataHtml;

    document.getElementById("hideDeletedListBtn").addEventListener('click', hideDeletedList);

    //creating eventlisteners for dynamically created buttons
    counter = 0;
    listOfTodoLists[selectedListIndex].listDataDeleted.forEach(element => {
        let temp = "deletedSubListItem" + counter;
        document.getElementById(temp).addEventListener('click', reAddToList); 
        counter++;
    });
}

function reAddToList(){
    let input = this;

    listOfTodoLists[selectedListIndex].listData.push(listOfTodoLists[selectedListIndex].listDataDeleted[input.value]);
    listOfTodoLists[selectedListIndex].listDataDeleted.splice(input.value, 1);
    
    updateActualList(selectedListIndex);
    showDeletedListEntries();
}

function hideDeletedList(){
    showDeletedList = false;
    updateActualList(selectedListIndex);
}