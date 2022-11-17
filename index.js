//////////////////////////////////////////////////////////
//////////////          ToDo                //////////////
//////////////////////////////////////////////////////////
/* 
        jason local save file?
        delete buttons for lists and paper bin
 */
//////////////////////////////////////////////////////////
//////////////          Events              //////////////
//////////////////////////////////////////////////////////

document.getElementById("addNewList").addEventListener('click',addTodoListBtn);
document.getElementById("addNewEntry").addEventListener('click',addEntryToCurrentList);

// eventlisteners that create the function to submit entries in textfield with enter without using a form
document.getElementById("nameOfList").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key == "Enter") {
        document.getElementById("addNewList").click();
    }
});
document.getElementById("listInput").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.key == "Enter") {
        document.getElementById("addNewEntry").click();
    }
});

//////////////////////////////////////////////////////////
//////////////       Global Variables       //////////////
//////////////////////////////////////////////////////////
let listOfTodoLists = [];
let selectedListIndex;
let showDeletedList = false;

// Class object for lists
class List {
    listName = "";
    listData = [];
    listDataDeleted = [];
}

//////////////////////////////////////////////////////////
//////////////          Functions           //////////////
//////////////////////////////////////////////////////////
function addTodoListBtn(){
    // Creates a new list with textfield input as name

    document.getElementById("listInput").hidden = true;
    document.getElementById("addNewEntry").hidden = true;
    document.getElementById("labelListInput").hidden = true;
    document.getElementById("deletedEntries").innerHTML = "";
    document.getElementById("currentTodoList").innerHTML = "";
    document.getElementById("hideDeletedListButton").innerHTML = "";
    document.getElementById("currentListTitel").innerText = "ListenTitel";

    let input = document.getElementById("nameOfList");

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
    updateTodolistsUi();
}
function addEntryToCurrentList(){
    // adds entry to selected list
    let input = document.getElementById("listInput");

    // check if entry already exists in active entries or paper bin,
    // to prevent multiple entroes with the same value
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

    // adds entry to current list
    let entry = input.value;
    listOfTodoLists[selectedListIndex].listData.push(entry);

    input.value = "";

    updateCurrentList(selectedListIndex);
}
function updateTodolistsUi(){
    // creates html code for dynamic list

    let tableBody = document.getElementById("TodoList");
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

    document.getElementById("hideDeletedListButton").innerHTML = "";

    // sets html code of tag "deletedEntries" to nothing,
    // to prevent persistent entries from other lists from showing up
    if(listOfTodoLists[selectedListIndex].listDataDeleted == 0){
        document.getElementById("deletedEntries").innerHTML = "";
    }

    // Changing the title of the current list
    let title = document.getElementById("currentListTitel");
    title.innerText = "Current List: " + listOfTodoLists[selectedListIndex].Name;

    // once a list is selected shows the required functionality for adding entries
    document.getElementById("listInput").hidden = false;
    document.getElementById("addNewEntry").hidden = false;
    document.getElementById("labelListInput").hidden = false;
    
    updateCurrentList(selectedListIndex);
}
function updateCurrentList(selectedListIndex){
    // updates html content for selected lists

    let tableBody = document.getElementById("currentTodoList");
    let dataHtml = "";
    let counter = 1;

    // handles different cases regarding the appearance of the paper bin list
    if(listOfTodoLists[selectedListIndex].listDataDeleted.length > 0){
        //when deleted list has at least 1 entry
        if(!showDeletedList){
            // deleted list is not being shown

            //creates button
            document.getElementById("hideDeletedListButton").innerHTML = "<tr><td><input type=\"button\" name=\"showDeletedListBtn\" id=\"showDeletedListBtn\" value=\"Show Deleted Entries\"></td></tr>";

            // create eventlistener for button
            document.getElementById("showDeletedListBtn").addEventListener('click', showDeletedListEntries);
        }
    }

    if(listOfTodoLists[selectedListIndex].listData.length == 0){
        // when list is empty
        tableBody.innerText = "List is Empty";
        return;
    }
    else{
        // create dynamic html code if list has at least one entry
        listOfTodoLists[selectedListIndex].listData.forEach(element => {
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
    listOfTodoLists[selectedListIndex].listData.forEach(element => {
        let temp = "entrySelectButton" + counter;
        document.getElementById(temp).addEventListener('click', deleteSelectedEntry); 
        counter++;
    });
}
function deleteSelectedEntry(){
    // deletes entry from current list and pushes it to paper bin

    let currentEntryIndex = this.value;
    // adds deleted entry to bin list
    listOfTodoLists[selectedListIndex].listDataDeleted.push(listOfTodoLists[selectedListIndex].listData[currentEntryIndex]);
    listOfTodoLists[selectedListIndex].listData.splice(currentEntryIndex, 1);
    updateCurrentList(selectedListIndex);
    if(showDeletedList){
        showDeletedListEntries();
    }
}
function showDeletedListEntries(){
    // creates dynamic html code for the paper bin list
    showDeletedList = true;

    let tableBody = document.getElementById("deletedEntries");
    let dataHtml = "";
    let counter = 1;

    listOfTodoLists[selectedListIndex].listDataDeleted.forEach(element => {
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
    document.getElementById("hideDeletedListButton").innerHTML = "<tr><td><input type=\"button\" name=\"hideDeletedListBtn\" id=\"hideDeletedListBtn\" value=\"Hide Deleted Entries\"></td></tr>";
    tableBody.innerHTML = dataHtml;
    document.getElementById("hideDeletedListBtn").addEventListener('click', hideDeletedList);

    // creating eventlisteners for dynamically created buttons
    counter = 0;
    listOfTodoLists[selectedListIndex].listDataDeleted.forEach(element => {
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

    listOfTodoLists[selectedListIndex].listData.push(listOfTodoLists[selectedListIndex].listDataDeleted[input.value]);
    listOfTodoLists[selectedListIndex].listDataDeleted.splice(input.value, 1);
    
    updateCurrentList(selectedListIndex);
    showDeletedListEntries();
}
function hideDeletedList(){
    // sets boolean for, if the paper bin list is visible to false and updates the list

    showDeletedList = false;
    document.getElementById("hideDeletedListButton").innerHTML = "";
    document.getElementById("deletedEntries").innerHTML = "";
    updateCurrentList(selectedListIndex);
}
function deleteEntryFromList(){
    listOfTodoLists[selectedListIndex].listDataDeleted.splice(this.value, 1);
    updateCurrentList(selectedListIndex);
    showDeletedListEntries();
}
function deleteList(){
    listOfTodoLists.splice(this.value, 1)
    updateTodolistsUi();
    updateCurrentList(selectedListIndex);
    showDeletedListEntries();
}