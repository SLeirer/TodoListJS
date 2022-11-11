let listeVonToDolists = [];

class List {
    listName = "";
    listData = [];
}

function addButton(){
    let input = document.getElementById("nameOfList").value;
    
    // breaks out of funtion to prevent lists with no names
    if(input == ""){
        return;
    }

    // names are assigned and added to list
    let list = new List();
    list.Name = input;
    listeVonToDolists.push(list);
    
    // gives out names of list in console for testing purposes
    for(let i=0; i < listeVonToDolists.length; i++){
        console.log(i + " " + listeVonToDolists[i].Name);
    }
}