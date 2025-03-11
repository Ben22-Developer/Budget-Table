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

const all_entries = JSON.parse(localStorage.getItem('budgetData')) || [];

const makeActivityLogic = (() => {

//---------------------
    //create functions

    function createActivity ({name,type,date}) {

        const newActivity = new activity (name,type,date);

        if (!newActivity.name) {
            alert (`Can't add this object, please insert valid characters.`);
            return false;
        }

        all_entries.push(newActivity);
        domManipulation.createActivity(newActivity);
    }

//--------------------
    //update functions

    function editActivity (index,{name,type,date}) {
        
        index-= 1;

        
        const oldName = all_entries[index].name;
        all_entries[index].name = name;

        if (!all_entries[index].name) {
            all_entries[index].name = oldName;
            alert (`Can't update this activity, please insert valid characters for activity name.`);
            return;
        }

        all_entries[index].name = name;
        all_entries[index].type = type;
        all_entries[index].date = date;

        domManipulation.updateDOMAfterEdit(index,all_entries[index]);
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
        domManipulation.remakingDOMAfterSortOrRetrival();
    }


    //for activity date
    function quickSortCaller () {
        quickSort (0,all_entries.length - 1, all_entries);
        domManipulation.remakingDOMAfterSortOrRetrival();
    }

    function quickSort (start,end,all_entries) {

        if (start < end) {
            const toCut = conquer (start,end,all_entries);
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

    return {createActivity,editActivity,deleteActivity,insertionSort,quickSortCaller};
})()

//DOM Manipulation

const domManipulation = (() => {
    let activityId = 1;
    let currentManipulatingActivity;

    function storage () {
        const stringifiedArray = JSON.stringify(all_entries);
        localStorage.setItem('budgetData',stringifiedArray);
    }

    function remakingDOMAfterSortOrRetrival () {

        if (activityId > 1) {
            document.querySelectorAll('.anActivity').forEach(tr => {
                tr.remove();
            })
        }
        activityId = 1;
        for (let i = 0; i < all_entries.length; i++) {
            createActivity(all_entries[i]);
        }
    }

    function resetForm () {
        document.getElementById('nameInput').value = '';
        document.getElementById('typeInput').value = '';
        document.getElementById('dateInput').value = '';
    }
    
    function remakeDate (date) {

        date = date.split('-');
        date[3] = date[0];
        date[0] = date[2];
        date.splice(2,1);
        date = date.join('/');
        return date;
    }

    function createActivity (newActivity) {

        let tableRow = document.createElement('tr');
        tableRow.innerHTML = activityHTML(newActivity);
        tableRow.id = activityId;
        tableRow.classList.add('anActivity');
        document.querySelector('table').append(tableRow);
        tableRow.children[3].children[0].addEventListener('change',updateOrDeleteActivity);
        
        activityId += 1;

        storage();
    }
    
    function activityHTML (newActivity) {
        return ` <td>${newActivity.name}</td>
                 <td>${newActivity.type}</td>   
                 <td>${remakeDate(newActivity.date)}</td> 
                 <td>
                    <select name="selection" id="select">
                        <option value="none">Manipulate</option>
                        <option value="Edit">Edit</option>
                        <option value="Delete">Delete</option>
                    </select>
                 </td> 
                 `
    }

    function updateOrDeleteActivity (e) {

        currentManipulatingActivity = e.target.parentElement.parentElement;
        switch (e.target.value) {
            case 'Edit':
                editActivity(currentManipulatingActivity.id);
            break;
            case 'Delete':
                deleteActivity();
            break;
        }

        e.target.innerHTML = `<option value="none">Manipulate</option>
                                            <option value="Edit">Edit</option>
                                            <option value="Delete">Delete</option>`
    }

    function editActivity (index) {
        document.getElementById('nameInput').value = all_entries[index - 1].name;
        document.getElementById('typeInput').value = all_entries[index - 1].type;
        document.getElementById('dateInput').value = all_entries[index - 1].date;
        document.querySelector('dialog').showModal();
        document.querySelector('form').lastElementChild.children[0].value = `${index}`;
    }
    
    function updateDOMAfterEdit (index,editedActivity) {

        currentManipulatingActivity.children[0].innerText = editedActivity.name;
        currentManipulatingActivity.children[1].innerText  = editedActivity.type;
        currentManipulatingActivity.children[2].innerText  = remakeDate(editedActivity.date);
        storage();
    }

    function deleteActivity () {

        const popOut = document.createElement('dialog');
        popOut.innerHTML = `<h3>Are you sure you want to delete ${currentManipulatingActivity.children[0].innerText} activity?</h3>
                            <button class="popOutBtnsToDelete" value="Yes">Yes</button>
                            <button class="popOutBtnsToDelete" value="No">No</button>`;

        document.querySelector('section').append(popOut);
        popOut.showModal();
        document.querySelectorAll('.popOutBtnsToDelete').forEach(deleteBtn => {
            deleteBtn.addEventListener('click',toConfirmDeleteOrNot);
        })
    }

    function toConfirmDeleteOrNot (e) {
        
        switch(e.target.value) {
            case 'Yes':
                makeActivityLogic.deleteActivity(parseInt(currentManipulatingActivity.id));
                let nextSibling = currentManipulatingActivity.nextElementSibling
                while (nextSibling) {
                    nextSibling.id = parseInt(nextSibling.id) - 1;
                    nextSibling = nextSibling.nextElementSibling;
                }
                activityId -=1 ;
                currentManipulatingActivity.remove();
                storage();
            break;
        }
        e.target.parentElement.remove();
    }

    return {createActivity,resetForm,updateDOMAfterEdit,remakingDOMAfterSortOrRetrival}
})()


//starting up if in the localStorage there's something
if (all_entries.length) {
    const retrieving = [...all_entries];
    all_entries.splice(0);
    for (let i = 0; i < retrieving.length; i++) {
        const retrieved = {};
        retrieved.name = retrieving[i]._name;
        retrieved.type = retrieving[i].type;
        retrieved.date = retrieving[i].date;
        makeActivityLogic.createActivity(retrieved);
    }
}

document.getElementById('addActivity').addEventListener('click', () => {
    domManipulation.resetForm();
    document.querySelector('dialog').showModal();
})

document.getElementById('formCancel').addEventListener('click', () => {
    document.querySelector('dialog').close();
    document.querySelector('form').lastElementChild.children[0].value = 'Submit';
})


document.querySelector('form').addEventListener('submit', () => {

    const newActivity = {};
    newActivity.name = document.getElementById('nameInput').value;
    newActivity.type = document.getElementById('typeInput').value;
    newActivity.date = document.getElementById('dateInput').value;
    if ( document.querySelector('form').lastElementChild.children[0].value === 'Submit') {
        makeActivityLogic.createActivity(newActivity);
    }
    else {
        makeActivityLogic.editActivity(parseInt(document.querySelector('form').lastElementChild.children[0].value),newActivity);
        document.querySelector('form').lastElementChild.children[0].value = 'Submit';
    }
})

document.getElementById('sortByName').addEventListener('click',makeActivityLogic.insertionSort);
document.getElementById('sortByDate').addEventListener('click',makeActivityLogic.quickSortCaller);
