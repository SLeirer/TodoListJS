//////////////////////////////////////////////////////////
//////////////          ToDo                //////////////
//////////////////////////////////////////////////////////
/* 
        json local save file?
 */



//////////////////////////////////////////////////////////
//////////////       Global Variables       //////////////
//////////////////////////////////////////////////////////
let listOfTodoLists = [];
let selectedListIndex;
let selectedTodoList = listOfTodoLists[selectedListIndex];
let showDeletedList = false;

// Class object for lists
class List {
    listName = "";
    listData = [];
    listDataDeleted = [];
}

//document ID's
const addNewList = document.getElementById("addNewList");
const addNewEntry = document.getElementById("addNewEntry");
const nameOfList = document.getElementById("nameOfList");
const listInput = document.getElementById("listInput");
const labelListInput = document.getElementById("labelListInput");
const deletedEntries = document.getElementById("deletedEntries");
const currentTodoList = document.getElementById("currentTodoList");
const hideDeletedListButton = document.getElementById("hideDeletedListButton");
const currentListTitel = document.getElementById("currentListTitel");
const TodoList = document.getElementById("TodoList");

//////////////////////////////////////////////////////////
//////////////          Events              //////////////
//////////////////////////////////////////////////////////

addNewList.addEventListener('click',addTodoListBtn);
addNewEntry.addEventListener('click',addEntryToCurrentList);

// eventlisteners that create the function to submit entries in textfield with enter without using a form
nameOfList.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key == "Enter") {
        addNewList.click();
    }
});
listInput.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key == "Enter") {
        addNewEntry.click();
    }
});

//////////////////////////////////////////////////////////
//////////////          Functions           //////////////
//////////////////////////////////////////////////////////
function addTodoListBtn(){
    // Creates a new list with textfield input as name

    listInput.hidden = true;
    addNewEntry.hidden = true;
    labelListInput.hidden = true;
    deletedEntries.innerHTML = "";
    currentTodoList.innerHTML = "";
    hideDeletedListButton.innerHTML = "";
    currentListTitel.innerText = "ListenTitel";

    let input = nameOfList;

    // checks if entry already exists to prevent creating lists with the same name
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

    // input value is reset to prevent issues when reusing variable
    input.value = "";
    
    // gives out names of list in console for testing purposes
    for(let i=0; i < listOfTodoLists.length; i++){
        console.log(i + " " + listOfTodoLists[i].Name);
    }
    console.log("___________________");

    // creates table elements
    ui_updateTodolists();
}
function addEntryToCurrentList(){
    // adds entry to selected list
    let input = listInput;

    // check if entry already exists in active entries or paper bin,
    // to prevent multiple entroes with the same value
    if( selectedTodoList.listData.includes(input.value) ||
        selectedTodoList.listDataDeleted.includes(input.value)){
            alert("Entry already exists");
            input.value = "";
            return;
    }

    // breaks out of funtion to prevent lists with no names
    if(input.value == ""){
        return;
    }

    // adds entry to current list
    let entry = input.value;
    selectedTodoList.listData.push(entry);

    input.value = "";

    updateCurrentList(selectedListIndex);
}
function ui_updateTodolists(){
    // creates html code for dynamic list

    let tableBody = TodoList;
    let dataHtml = "";
    let counter = 1;

    // sorting alphabetically by comparing names of objects
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
    
    // dynamic html code for each entry 
    listOfTodoLists.forEach(element => {
        dataHtml += "<tr>"+
                        "<td class=\"listIndex\">"
                            + counter +
                        "</td>" +
                        "<td class=\"listItem\">"
                            + element.Name +
                        "</td>" +
                        "<td class=\"selectButton\">" +
                            "<input type=\"radio\" name=\"listSelectButton\" id=\"listSelectButton" + (counter-1) + "\" value=\"" + (counter-1) +"\">" +
                        "</td>" +
                        "<td class=\"deleteButton\">" +
                            "<input type=\"radio\" class=\"deleteListButton\" name=\"deleteListButton\" id=\"deleteListButton" + (counter-1) + "\" value=\"" + (counter-1) +"\">" +
                        "</td>" +
                    "</tr>";
        counter++;
    })

    console.log(dataHtml);

    //submits html code to table tag
    tableBody.innerHTML = dataHtml;

    // creates eventlisteners for dynamically created radio buttons
    counter = 0;
    listOfTodoLists.forEach(element => {
        let temp = "listSelectButton" + counter;
        document.getElementById(temp).addEventListener('click', selectList); 
        temp = "deleteListButton" + counter;
        document.getElementById(temp).addEventListener('click', deleteList); 
        counter++;
    });
}
function selectList(){
    // selects the list for the dynamicly created radio button
    showDeletedList = false;
    selectedListIndex = this.value;

    hideDeletedListButton.innerHTML = "";
    selectedTodoList = listOfTodoLists[selectedListIndex];

    // sets html code of tag "deletedEntries" to nothing,
    // to prevent persistent entries from other lists from showing up
    if(selectedTodoList.listDataDeleted == 0){
        deletedEntries.innerHTML = "";
    }

    // Changing the title of the current list
    let title = currentListTitel;
    title.innerText = "Ausgewählte Liste: " + selectedTodoList.Name;

    // once a list is selected shows the required functionality for adding entries
    listInput.hidden = false;
    addNewEntry.hidden = false;
    labelListInput.hidden = false;
    
    updateCurrentList();
}
function updateCurrentList(){
    // updates html content for selected lists

    let tableBody = currentTodoList;
    let dataHtml = "";
    let counter = 1;

    // handles different cases regarding the appearance of the paper bin list
    if(selectedTodoList.listDataDeleted.length > 0){
        //when deleted list has at least 1 entry
        if(!showDeletedList){
            // deleted list is not being shown

            //creates button
            hideDeletedListButton.innerHTML = "<tr><td><input type=\"button\" name=\"showDeletedListBtn\" id=\"showDeletedListBtn\" value=\"Show Deleted Entries\"></td></tr>";

            // create eventlistener for button
            document.getElementById("showDeletedListBtn").addEventListener('click', showDeletedListEntries);
        }
    }

    if(selectedTodoList.listData.length == 0){
        // when list is empty
        tableBody.innerText = "List is Empty";
        return;
    }
    else{
        // create dynamic html code if list has at least one entry
        selectedTodoList.listData.forEach(element => {
            dataHtml += "<tr>"+
                        "<td class=\"listIndex\">"
                            + counter +
                        "</td>" +
                        "<td class=\"listItem\">"
                            + element +
                        "</td>" +
                        "<td class=\"selectButton\">" +
                            "<input type=\"radio\" name=\"entrySelectButton\" id=\"entrySelectButton" + (counter-1) + "\" value=\"" + (counter-1) +"\">" +
                        "</td>" +
                        "</tr>";
            counter++;
        });
    }

    // submits html code to tag
    tableBody.innerHTML = dataHtml;

    //creating eventlisteners for dynamically created buttons
    counter = 0;
    selectedTodoList.listData.forEach(element => {
        let temp = "entrySelectButton" + counter;
        document.getElementById(temp).addEventListener('click', deleteSelectedEntry); 
        counter++;
    });
}
function deleteSelectedEntry(){
    // deletes entry from current list and pushes it to paper bin

    let currentEntryIndex = this.value;
    // adds deleted entry to bin list
    selectedTodoList.listDataDeleted.push(selectedTodoList.listData[currentEntryIndex]);
    selectedTodoList.listData.splice(currentEntryIndex, 1);
    updateCurrentList(selectedListIndex);
    if(showDeletedList){
        showDeletedListEntries();
    }
}
function showDeletedListEntries(){
    // creates dynamic html code for the paper bin list
    showDeletedList = true;

    let tableBody = deletedEntries;
    let dataHtml = "";
    let counter = 1;

    selectedTodoList.listDataDeleted.forEach(element => {
        dataHtml += "<tr>"+
                        "<td class=\"listIndex\">" +
                            counter +
                        "</td>" + 
                        "<td class=\"listItem\">"
                            + element +
                        "</td>" +
                        "<td class=\"selectButton\">" +
                            "<input type=\"radio\" name=\"deletedListSelectButton\" id=\"deletedListSelectButton" + (counter-1) + "\" value=\"" + (counter-1) +"\">" +
                        "</td>" +
                        "<td class=\"deleteButton\">" +
                            "<input type=\"radio\" class=\"deleteEntryButton\" name=\"deleteEntryButton\" id=\"deleteEntryButton" + (counter-1) + "\" value=\"" + (counter-1) +"\">" +
                        "</td>" +
                    "</tr>";
            counter++;
    });

    // always adds a button at the end of the list to make it possible to hide the paper bin list
    hideDeletedListButton.innerHTML = "<tr><td><input type=\"button\" name=\"hideDeletedListBtn\" id=\"hideDeletedListBtn\" value=\"Hide Deleted Entries\"></td></tr>";
    tableBody.innerHTML = dataHtml;
    document.getElementById("hideDeletedListBtn").addEventListener('click', hideDeletedList);

    // creating eventlisteners for dynamically created buttons
    counter = 0;
    selectedTodoList.listDataDeleted.forEach(element => {
        let temp = "deletedListSelectButton" + counter;
        document.getElementById(temp).addEventListener('click', reAddDeletedEntriesToList); 
        temp = "deleteEntryButton" + counter;
        document.getElementById(temp).addEventListener('click', deleteEntryFromList); 
        counter++;
    });
}
function reAddDeletedEntriesToList(){
    // switches selected item from paper bin back to actual list
    let input = this;

    selectedTodoList.listData.push(selectedTodoList.listDataDeleted[input.value]);
    selectedTodoList.listDataDeleted.splice(input.value, 1);
    
    if(selectedTodoList.listDataDeleted.length == 0){
        deletedEntries.innerHTML = "";
        hideDeletedListButton.innerHTML = "";
    }
    else{
        showDeletedListEntries();
    }

    updateCurrentList(selectedListIndex);
    
}
function hideDeletedList(){
    // sets boolean for, if the paper bin list is visible to false and updates the list

    showDeletedList = false;
    hideDeletedListButton.innerHTML = "";
    deletedEntries.innerHTML = "";
    updateCurrentList(selectedListIndex);
}
function deleteEntryFromList(){
    selectedTodoList.listDataDeleted.splice(this.value, 1);

    if(selectedTodoList.listDataDeleted.length == 0){
        deletedEntries.innerHTML = "";
        hideDeletedListButton.innerHTML = "";
    }
    else{
        showDeletedListEntries();
    }

    updateCurrentList(selectedListIndex);
}
function deleteList(){
    listOfTodoLists.splice(this.value, 1)
    ui_updateTodolists();
    updateCurrentList(selectedListIndex);
    showDeletedListEntries();
}