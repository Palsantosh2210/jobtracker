console.log("Lets Begin with project");
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('jobForm');
    const tableBody = document.querySelector('#jobTable tbody');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    // Load jobs from local storage when the page loads
    loadJobs();
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission 
        // Retrieve input values from the form
        const company = document.getElementById('company').value.trim();
        const position = document.getElementById('position').value.trim();
        const status = document.getElementById('status').value;
        if (company && position) {
            const job = { company, position, status }; // Create job object
            addJob(job); // Add job to the table
            form.reset(); // Clear form fields
        }
    });
    tableBody.addEventListener('click', (event) => {
        const target = event.target;
        const row = target.closest('tr'); // Find the closest table row
        if (target.classList.contains('delete')) {
            tableBody.removeChild(row); // Remove row from the table
            saveJobs(); // Update local storage
        } else if (target.classList.contains('edit')) {
            const cells = row.getElementsByTagName('td');
            // Populate form fields with current row data for editing
            document.getElementById('company').value = cells[0].textContent;
            document.getElementById('position').value = cells[1].textContent;
            document.getElementById('status').value = cells[2].textContent;
            tableBody.removeChild(row); // Remove row after editing
            saveJobs(); // Update local storage
        }
    });
    // Add event listeners for filtering and searching
    statusFilter.addEventListener('change', filterJobs);
    searchInput.addEventListener('input', filterJobs);
    function addJob(job) {
        const row = document.createElement('tr'); // Create a new table row
        row.innerHTML = `
            <td>${job.company}</td>
            <td>${job.position}</td>
            <td>${job.status}</td>
            <td>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </td>
        `;
        tableBody.appendChild(row); // Add new row to the table
        saveJobs(); // Update local storage
    }
    function saveJobs() {
        const rows = Array.from(tableBody.rows); // Get all table rows
        const jobs = rows.map(row => {
            const cells = row.getElementsByTagName('td');
            return {
                company: cells[0].textContent,
                position: cells[1].textContent,
                status: cells[2].textContent,
            };
        });
        localStorage.setItem('jobs', JSON.stringify(jobs)); // Save jobs to local storage
    }
    function loadJobs() {
        const jobs = JSON.parse(localStorage.getItem('jobs')) || []; // Retrieve jobs from local storage
        jobs.forEach(job => addJob(job)); // Add jobs to the table
    }
    function filterJobs() {
        const status = statusFilter.value; // Get selected status filter
        const query = searchInput.value.toLowerCase(); // Get search query  
        Array.from(tableBody.rows).forEach(row => {
            const cells = row.getElementsByTagName('td');
            const matchStatus = status ? cells[2].textContent === status : true; // Match status filter
            const matchSearch = Array.from(cells).slice(0, 2).some(cell => cell.textContent.toLowerCase().includes(query)); // Match search query 
            row.style.display = matchStatus && matchSearch ? '' : 'none'; // Show or hide rows based on filters
        });
    }
});
// Function to sort the table based on column index
function sortTable(columnIndex) {
    const table = document.getElementById('jobTable');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const sortedRows = rows.sort((a, b) => {
        const aText = a.children[columnIndex].textContent.trim();
        const bText = b.children[columnIndex].textContent.trim();
        return aText.localeCompare(bText); // Compare text for sorting
    });   
    sortedRows.forEach(row => table.querySelector('tbody').appendChild(row)); // Append sorted rows to the table
}    