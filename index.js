// events
document.getElementById("addNewList").addEventListener('click',addButton);

// global variables
let listOfTodoLists = [];

// objects
class List {
    listName = "";
    listData = [];
}

// functions
function addButton(){
    let input = document.getElementById("nameOfList").value;
    
    // breaks out of funtion to prevent lists with no names
    if(input == ""){
        return;
    }

    // names are assigned and added to list
    let list = new List();
    list.Name = input;
    listOfTodoLists.push(list);
    
    // gives out names of list in console for testing purposes
    for(let i=0; i < listOfTodoLists.length; i++){
        console.log(i + " " + listOfTodoLists[i].Name);
    }
    console.log("___________________");

    //creates table elements
    updateTodolists();
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
        dataHtml += "<tr><td width=\"30\">" + counter + "</td><td width=\"60\">" + element.Name +
                    "</td><td><input type=\"radio\" name=\"listItem\" id=\"listItem"
                    + (counter-1) + "\"></td></tr>";
        counter++;
    })

    console.log(dataHtml);

    tableBody.innerHTML = dataHtml;

    counter = 0;

    listOfTodoLists.forEach(element => {
        let temp = "listItem" + counter;
        document.getElementById(temp).addEventListener('click',displayList); 
        counter++;
    });
}

function displayList(){
    
}