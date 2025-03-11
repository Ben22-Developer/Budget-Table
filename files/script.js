class activity {
    constructor(name,type,date) {
        this.name = name;
        this.type = type;
        this.date = date;
    }

    get name () {
        return this._name;
    }

    set name (name) {
        if (!(/^[a-z1-9]/i.test(name))) {
            while (!(/^[a-z1-9]/i.test(name))) {
                name = name.split('');
                name.splice(0,1);
                name = name.join('');
                if (name.length === 0) {
                    this._name = false;
                    return;
                }
            }
        }
        this._name = this.upperCase(name);
    }

    get describe () {
        return `Activity name: ${this.name} Activity type: ${this.type} Activity date: ${this.date}`;
    }

    upperCase (name) {
        name = name.split('');
        name[0] = name[0].toUpperCase();
        name = name.join('');
        return name;
    }
}

const all_entries = [];

const makeActivityLogic = (() => {

//---------------------
    //create functions

    function createActivity ({name,type,date}) {
        
        //name = upperCase(name);

        const newObj = new activity (name,type,date);

        if (!newObj.name) {
            alert (`Can't add this object, please insert valid characters.`);
            return false;
        }

        all_entries.push(newObj);

        //this return will test while manipulating DOM
        return `Lastly inserted: ${all_entries[all_entries.length - 1].describe}`;
    }

    //this function can be deleted
    function takeInput (name,type,date) {
        
        const newObj = {
            name:name,type:type,date:date
        }
        const isValid = createActivity(newObj);
        if (isValid) {
            return `Lastly inserted: ${all_entries[all_entries.length - 1].describe}`;
        }
    }

//--------------------
    //update functions

    function editActivity (index,{name,type,date}) {
        
        index-= 1;

//!!!!!!! ---> //when using DOM remember to pass this specific item to the form, u'll receive only index as arg and 
                /* get from the form the {name,type,date} keep it in an object then perform below tasks*/
        
        const oldName = all_entries[index].name;
        all_entries[index].name = name;

        if (!all_entries[index].name) {
            all_entries[index].name = oldName;
            return false;
        }

        all_entries[index].name = name;
        all_entries[index].type = type;
        all_entries[index].date = date;

        return index;
    }

    //this function can be deleted
    function takeInputToEdit (index,name,type,date) {
        
        const newObj = {
            name:name,type:type,date:date
        }
        const indexEdited = editActivity(index,newObj);

        if (typeof indexEdited === 'boolean') {
            alert (`Can't add this object, please insert valid characters.`);
        }
        else {
            return `Edited: ${all_entries[indexEdited].describe}`;
        }
    }

//-----------------------
    //function to delete

    function deleteActivity (index) {

        index -= 1;
        const deleted = all_entries[index];
        for (let i = index; i < all_entries.length; i++) {
            all_entries[i] = all_entries[i + 1];
        }
        all_entries.length -= 1;

        return `Deleted: ${deleted.describe}`
    }

//----------------------
    //functions to sort

    //for activity name
    function insertionSort () {
        
        for (let i = 1; i < all_entries.length; i ++) {
            const temp = all_entries[i];
            let j = i - 1;
            while ((j >= 0) && (all_entries[j].name > temp.name)) {
                all_entries[j + 1] = all_entries[j];
                j --;
            }
            all_entries[j + 1] = temp;
        }
        return all_entries;
    }


    //for activity date
    function quickSortCaller () {

        quickSort (0,all_entries.length - 1, all_entries);
        return all_entries;
    }

    function quickSort (start,end,all_entries) {

        if (start < end) {
            console.log(start,end);
            const toCut = conquer (start,end,all_entries);
            console.log(toCut);
            quickSort (0,toCut - 1, all_entries);
            quickSort (toCut + 1, end, all_entries);
        }
    }

    function conquer (start, end, all_entries) {

        const pivot = all_entries[start];
        const pivotDate = new Date (pivot.date);
        const pivotIndex = start;
        let temp;

        while (start < end) {

            while (start < all_entries.length && pivotDate >= new Date (all_entries[start].date)) {
                start += 1;
            }
            while (pivotDate < new Date (all_entries[end].date)) {
                end -= 1;
            }

            if ((start < end) && (new Date (all_entries[start].date) > new Date (all_entries[end].date))) {
                temp = all_entries[start];
                all_entries[start] = all_entries[end];
                all_entries[end] = temp;
            }
        }

        if (start !== pivotIndex) {
            temp = all_entries[end];
            all_entries[end] = all_entries[pivotIndex];
            all_entries[pivotIndex] = temp;
        }
        return end;
    }

    return {createActivity,takeInput,editActivity,takeInputToEdit,deleteActivity,insertionSort,quickSortCaller};
})()



//html date format 2025-03-25

//DOM Manipulation

const domManipulation = (() => {
    
    
    
})()

const addActivityBtn = document.getElementById('addActivity');
const sortByNameBtn = document.getElementById('sortByName');
const sortByDateBtn = document.getElementById('sortByDate');
const form = document.querySelector('form');
const dialog = document.querySelector('dialog');
const formCancel = document.getElementById('formCancel');
const formSubmit = document.getElementById('formSubmit');


addActivityBtn.addEventListener('click', () => {
    dialog.showModal();
})

formCancel.addEventListener('click', () => {
    dialog.close();
})
