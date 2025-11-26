// Application JavaScript

// Global state
let currentRegistrations = [];
let currentTab = 'pending';

// DOM elements
const registrationsList = document.querySelector('.registrations-list');
const tabs = document.querySelectorAll('.tab');
const editModal = document.getElementById('editModal');
const checkinModal = document.getElementById('checkinModal');
const qrcodeModal = document.getElementById('qrcodeModal');
const closeButtons = document.querySelectorAll('.close-modal');
const editForm = document.getElementById('editForm');
const checkinForm = document.getElementById('checkinForm');
const eventSelect = document.getElementById('eventSelect');
const qrcodeEventSelect = document.getElementById('qrcodeEventSelect');
const checkinStatus = document.getElementById('checkinStatus');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    loadRegistrations(currentTab);
    setupEventListeners();
    loadCheckinStatus();
});

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Modal close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            editModal.style.display = 'none';
            checkinModal.style.display = 'none';
            qrcodeModal.style.display = 'none';
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === editModal) editModal.style.display = 'none';
        if (e.target === checkinModal) checkinModal.style.display = 'none';
        if (e.target === qrcodeModal) qrcodeModal.style.display = 'none';
    });
    
    // Form submissions
    editForm.addEventListener('submit', handleEditSubmit);
    checkinForm.addEventListener('submit', handleCheckinSubmit);
    
    // Check-in method selection
    document.getElementById('qrcode-checkin').addEventListener('click', () => {
        openQRCodeModal();
    });
    
    document.getElementById('code-checkin').addEventListener('click', () => {
        openCheckinCodeModal();
    });
    
    // Simulate QR code scan
    document.getElementById('simulateScan').addEventListener('click', simulateQRScan);
}

// Switch between tabs
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update active tab UI
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Load registrations for the selected tab
    loadRegistrations(tabName);
}

// Load registrations from API
async function loadRegistrations(status = 'all') {
    showLoading();
    
    try {
        const response = await fetch(`/api/user/registrations?status=${status}`);
        const data = await response.json();
        
        currentRegistrations = data.registrations;
        renderRegistrations(currentRegistrations);
    } catch (error) {
        console.error('Error loading registrations:', error);
        showError('Failed to load registrations');
    }
}

// Render registration cards
function renderRegistrations(registrations) {
    if (registrations.length === 0) {
        registrationsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No registrations found</h3>
                <p>You don't have any ${currentTab} registrations at the moment.</p>
            </div>
        `;
        return;
    }
    
    registrationsList.innerHTML = registrations.map(registration => `
        <div class="registration-card" data-id="${registration.id}">
            <div class="event-image">
                <i class="fas fa-calendar-alt fa-2x"></i>
            </div>
            <div class="event-details">
                <div>
                    <h3 class="event-title">${registration.eventTitle}</h3>
                    <div class="event-info">
                        <span><i class="far fa-calendar"></i> ${registration.eventDate}</span>
                        <span><i class="far fa-clock"></i> ${registration.eventTime}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${registration.eventLocation}</span>
                    </div>
                    <span class="status-badge status-${registration.status}">${getStatusText(registration.status)}</span>
                </div>
                <div class="card-actions">
                    ${getActionButtons(registration)}
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to action buttons
    addActionButtonListeners();
}

// Get status display text
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'approved': 'Approved',
        'rejected': 'Rejected',
        'completed': 'Completed'
    };
    return statusMap[status] || status;
}

// Get appropriate action buttons for registration status
function getActionButtons(registration) {
    switch(registration.status) {
        case 'pending':
            return `
                <button class="btn btn-outline edit-btn">Edit</button>
                <button class="btn btn-danger cancel-btn">Cancel</button>
            `;
        case 'approved':
            return `
                <button class="btn btn-primary reminder-btn">Set Reminder</button>
                <button class="btn btn-outline checkin-btn">Check In</button>
            `;
        case 'rejected':
            return `
                <button class="btn btn-outline details-btn">View Details</button>
            `;
        case 'completed':
            return `
                <button class="btn btn-outline details-btn">View Details</button>
                <button class="btn btn-outline feedback-btn">Feedback</button>
            `;
        default:
            return '';
    }
}

// Add event listeners to action buttons
function addActionButtonListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.registration-card');
            const registrationId = card.getAttribute('data-id');
            openEditModal(registrationId);
        });
    });
    
    // Cancel buttons
    document.querySelectorAll('.cancel-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.registration-card');
            const registrationId = card.getAttribute('data-id');
            cancelRegistration(registrationId);
        });
    });
    
    // Reminder buttons
    document.querySelectorAll('.reminder-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.registration-card');
            const registrationId = card.getAttribute('data-id');
            setReminder(registrationId);
        });
    });
    
    // Check-in buttons
    document.querySelectorAll('.checkin-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.registration-card');
            const registrationId = card.getAttribute('data-id');
            openCheckinOptions(registrationId);
        });
    });
}

// Open edit modal
function openEditModal(registrationId) {
    const registration = currentRegistrations.find(reg => reg.id === parseInt(registrationId));
    
    if (!registration) return;
    
    // In a real app, we would fetch the full registration details
    editModal.style.display = 'flex';
}

// Handle edit form submission
async function handleEditSubmit(e) {
    e.preventDefault();
    
    // In a real app, we would send the updated data to the server
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert('Registration updated successfully!');
        editModal.style.display = 'none';
        
        // Reload registrations to reflect changes
        loadRegistrations(currentTab);
    } catch (error) {
        alert('Failed to update registration. Please try again.');
    }
}

// Cancel registration
async function cancelRegistration(registrationId) {
    if (!confirm('Are you sure you want to cancel this registration?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/registrations/${registrationId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Registration cancelled successfully');
            loadRegistrations(currentTab);
        } else {
            throw new Error('Failed to cancel registration');
        }
    } catch (error) {
        console.error('Error cancelling registration:', error);
        alert('Failed to cancel registration. Please try again.');
    }
}

// Set reminder for event
async function setReminder(registrationId) {
    try {
        const response = await fetch(`/api/registrations/${registrationId}/reminder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reminderEnabled: true,
                reminderTime: "1 hour before",
                notificationMethods: ["email", "push"]
            })
        });
        
        if (response.ok) {
            alert('Reminder set successfully! You will be notified before the event.');
        } else {
            throw new Error('Failed to set reminder');
        }
    } catch (error) {
        console.error('Error setting reminder:', error);
        alert('Failed to set reminder. Please try again.');
    }
}

// Open check-in options
function openCheckinOptions(registrationId) {
    // For simplicity, we'll just open the QR code modal
    openQRCodeModal();
}

// Open QR code check-in modal
function openQRCodeModal() {
    // Populate event select dropdown
    populateEventSelect(qrcodeEventSelect);
    qrcodeModal.style.display = 'flex';
}

// Open check-in code modal
function openCheckinCodeModal() {
    // Populate event select dropdown
    populateEventSelect(eventSelect);
    checkinModal.style.display = 'flex';
}

// Populate event select dropdown with approved events
function populateEventSelect(selectElement) {
    const approvedEvents = currentRegistrations.filter(reg => reg.status === 'approved');
    
    selectElement.innerHTML = approvedEvents.map(event => `
        <option value="${event.eventId}">${event.eventTitle} - ${event.eventDate}</option>
    `).join('');
    
    if (approvedEvents.length === 0) {
        selectElement.innerHTML = '<option value="">No approved events available</option>';
    }
}

// Handle check-in form submission
async function handleCheckinSubmit(e) {
    e.preventDefault();
    
    const eventId = parseInt(eventSelect.value);
    const checkinCode = document.getElementById('checkinCode').value;
    
    if (!eventId || !checkinCode) {
        alert('Please select an event and enter the check-in code');
        return;
    }
    
    if (checkinCode.length !== 6) {
        alert('Please enter a valid 6-digit check-in code');
        return;
    }
    
    try {
        const response = await fetch('/api/checkin/code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventId,
                checkinCode
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Check-in successful!');
            checkinModal.style.display = 'none';
            loadCheckinStatus();
        } else {
            alert(data.error || 'Check-in failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during check-in:', error);
        alert('Check-in failed. Please try again.');
    }
}

// Simulate QR code scan
async function simulateQRScan() {
    const eventId = parseInt(qrcodeEventSelect.value);
    
    if (!eventId) {
        alert('Please select an event first');
        return;
    }
    
    // Simulate QR code data
    const qrCodeData = `EVENT_${eventId}_CHECKIN_${Date.now()}`;
    
    try {
        const response = await fetch('/api/checkin/qrcode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventId,
                qrCodeData
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('QR Code check-in successful!');
            qrcodeModal.style.display = 'none';
            loadCheckinStatus();
        } else {
            alert(data.error || 'QR Code check-in failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during QR code check-in:', error);
        alert('QR Code check-in failed. Please try again.');
    }
}

// Load and display check-in status
async function loadCheckinStatus() {
    try {
        const response = await fetch('/api/user/checkins');
        const data = await response.json();
        
        if (data.checkins && data.checkins.length > 0) {
            const latestCheckin = data.checkins[data.checkins.length - 1];
            checkinStatus.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Check-in Status:</strong> You have successfully checked in to "${latestCheckin.eventTitle}"
                    <div>Check-in Time: ${formatDateTime(latestCheckin.checkinTime)}</div>
                </div>
            `;
        } else {
            checkinStatus.innerHTML = `
                <i class="fas fa-info-circle"></i>
                <div>
                    <strong>Check-in Status:</strong> You haven't checked in to any events yet.
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading check-in status:', error);
        checkinStatus.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <strong>Check-in Status:</strong> Unable to load check-in information.
            </div>
        `;
    }
}

// Format date and time for display
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show loading state
function showLoading() {
    registrationsList.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner"></i>
            <p>Loading registrations...</p>
        </div>
    `;
}

// Show error message
function showError(message) {
    registrationsList.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Error</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="loadRegistrations(currentTab)">Try Again</button>
        </div>
    `;
}