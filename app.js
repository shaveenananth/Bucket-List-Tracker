let bucketList = JSON.parse(localStorage.getItem('bucketList')) ||[];  
// JSON.parse => converts JSON string from localStorage into an array (object)
// If there’s nothing in localStorage, use an empty array
let filterCategory = 'All';
let editIndex=null;

updateUI();

function addItem() {
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const target_date = document.getElementById('target_date').value;

    if (description && category && target_date) {

        if(editIndex!==null){
            // Update existing item
            bucketList[editIndex] = { description, category, target_date, completed: bucketList[editIndex].completed };
            editIndex=null;
        }else{
        // Add a new item to the list
        bucketList.push({ description, category, target_date, completed: false })};

        // Save updated list to localStorage
        localStorage.setItem('bucketList', JSON.stringify(bucketList));  
        // JSON.stringify => converts array/object into JSON string (since localStorage stores only strings)

        clearInputField();
        updateUI();
        
    };
}

function clearInputField() {
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
    document.getElementById('target_date').value = '';
}

function updateUI() {
    const bucketListContainer = document.getElementById('bucket-list');
    bucketListContainer.innerHTML = '';
    let completed_count = 0;

    const filteredList = filterCategory === 'All' ? bucketList :
    bucketList.filter(function (item) {
        return item.category === filterCategory;
    });

    filteredList.forEach(function (item, index) {
        const itemElement = document.createElement('li');
        itemElement.className = "p-4 border-gray-200 rounded-lg flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 mb-4";
        
        itemElement.innerHTML = 
        "<div><p class='font-semibold'>" + 
        item.description +
        "</p>" +
        "<p class='text-sm text-gray-600'>" +
        item.category +
        " - Target: " +
        item.target_date + 
        "</p></div> <div>" +
        "<button onclick='editItem(" + 
        index +
        ")' class='px-2 py-1 mr-2 bg-yellow-500 text-white rounded'>Edit</button>" +

        // ✅ Correct toggle button section
        "<button onclick='toggleCompletion(" + 
        index + 
        ")' class='mr-2 px-2 py-1 rounded " + 
        (item.completed ? "bg-green-500 text-white" : "bg-blue-500 text-white") + 
        "'>" + 
        (item.completed ? "Achieved" : "Pending") + 
        "</button>" +   // ✅ Fixed: removed extra '+' that caused NaN

        "<button onclick='deleteItem(" + 
        index +
        ")' class='px-2 py-1 bg-red-500 text-white rounded'>Delete</button></div>";

        bucketListContainer.appendChild(itemElement);

        if (item.completed) {
            completed_count++;
        }
    });

    // ✅ Update progress section
    const progressPercentage = (completed_count / bucketList.length) * 100 || 0;
    document.getElementById('progress-bar').style.width = progressPercentage + '%';
    document.getElementById("completed-count").innerText = completed_count;
    document.getElementById("total-count").innerText = bucketList.length;
}

function toggleCompletion(index) {
    // ✅ Toggle between Achieved/Pending
    bucketList[index].completed = !bucketList[index].completed;
    localStorage.setItem('bucketList', JSON.stringify(bucketList));
    updateUI();
}

function deleteItem(index) {
    bucketList.splice(index, 1);
    localStorage.setItem('bucketList', JSON.stringify(bucketList));
    updateUI();
}

function filterItems(category) {
    filterCategory = category;
    updateUI();
}

function editItem(index) { 
    document.getElementById('description').value = bucketList[index].description;   
    document.getElementById('category').value = bucketList[index].category;   
    document.getElementById('target_date').value = bucketList[index].target_date;

    editIndex = index;
};