// Content Editor Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const isAdmin = localStorage.getItem('userRole') === 'admin';
    
    if (isAdmin) {
        initializeContentEditor();
    }
    
    function initializeContentEditor() {
        // Add edit button to the page
        const editButton = document.createElement('button');
        editButton.id = 'toggleEditMode';
        editButton.innerHTML = '<i class="fas fa-edit"></i> Edit Content';
        editButton.className = 'btn btn-primary position-fixed';
        editButton.style.bottom = '70px';
        editButton.style.right = '20px';
        editButton.style.zIndex = '1000';
        document.body.appendChild(editButton);
        
        // Add save button (initially hidden)
        const saveButton = document.createElement('button');
        saveButton.id = 'saveContent';
        saveButton.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        saveButton.className = 'btn btn-success position-fixed';
        saveButton.style.bottom = '120px';
        saveButton.style.right = '20px';
        saveButton.style.zIndex = '1000';
        saveButton.style.display = 'none';
        document.body.appendChild(saveButton);
        
        // Add cancel button (initially hidden)
        const cancelButton = document.createElement('button');
        cancelButton.id = 'cancelEdit';
        cancelButton.innerHTML = '<i class="fas fa-times"></i> Cancel';
        cancelButton.className = 'btn btn-danger position-fixed';
        cancelButton.style.bottom = '170px';
        cancelButton.style.right = '20px';
        cancelButton.style.zIndex = '1000';
        cancelButton.style.display = 'none';
        document.body.appendChild(cancelButton);
        
        // Add editor style indicator
        const editorIndicator = document.createElement('div');
        editorIndicator.id = 'editorIndicator';
        editorIndicator.textContent = 'Editing Mode';
        editorIndicator.className = 'position-fixed bg-warning text-dark px-3 py-2';
        editorIndicator.style.top = '70px';
        editorIndicator.style.left = '50%';
        editorIndicator.style.transform = 'translateX(-50%)';
        editorIndicator.style.borderRadius = '5px';
        editorIndicator.style.zIndex = '1000';
        editorIndicator.style.display = 'none';
        document.body.appendChild(editorIndicator);
        
        // Store original content
        let originalContent = {};
        
        // Toggle edit mode
        editButton.addEventListener('click', function() {
            const editableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .card-title, .card-text, .lead');
            
            // Store original content and make elements editable
            editableElements.forEach((element, index) => {
                // Skip elements in the navbar and footer
                if (element.closest('.navbar') || element.closest('.footer')) {
                    return;
                }
                
                originalContent[index] = element.innerHTML;
                element.contentEditable = true;
                element.dataset.editable = true;
                element.style.border = '1px dashed #ffc107';
                element.style.padding = '5px';
                element.style.borderRadius = '3px';
                
                // Add hover effect
                element.addEventListener('mouseover', function() {
                    if (this.dataset.editable === 'true') {
                        this.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';
                    }
                });
                
                element.addEventListener('mouseout', function() {
                    if (this.dataset.editable === 'true') {
                        this.style.backgroundColor = '';
                    }
                });
            });
            
            // Show save and cancel buttons
            saveButton.style.display = 'block';
            cancelButton.style.display = 'block';
            editorIndicator.style.display = 'block';
            editButton.style.display = 'none';
        });
        
        // Save changes
        saveButton.addEventListener('click', function() {
            const editableElements = document.querySelectorAll('[data-editable="true"]');
            
            // In a real application, you would send the changes to a server here
            // For this demo, we'll just show a success message
            
            // Remove editable attributes
            editableElements.forEach(element => {
                element.contentEditable = false;
                element.removeAttribute('data-editable');
                element.style.border = '';
                element.style.padding = '';
                element.style.borderRadius = '';
                element.style.backgroundColor = '';
                
                // Remove event listeners (simplified approach)
                element.onmouseover = null;
                element.onmouseout = null;
            });
            
            // Show success message
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-success position-fixed';
            alertDiv.style.top = '70px';
            alertDiv.style.left = '50%';
            alertDiv.style.transform = 'translateX(-50%)';
            alertDiv.style.zIndex = '1001';
            alertDiv.innerHTML = 'Content updated successfully!';
            document.body.appendChild(alertDiv);
            
            // Remove alert after 3 seconds
            setTimeout(() => {
                alertDiv.remove();
            }, 3000);
            
            // Reset buttons
            saveButton.style.display = 'none';
            cancelButton.style.display = 'none';
            editorIndicator.style.display = 'none';
            editButton.style.display = 'block';
        });
        
        // Cancel editing
        cancelButton.addEventListener('click', function() {
            const editableElements = document.querySelectorAll('[data-editable="true"]');
            
            // Restore original content
            editableElements.forEach((element, index) => {
                element.innerHTML = originalContent[index];
                element.contentEditable = false;
                element.removeAttribute('data-editable');
                element.style.border = '';
                element.style.padding = '';
                element.style.borderRadius = '';
                element.style.backgroundColor = '';
                
                // Remove event listeners (simplified approach)
                element.onmouseover = null;
                element.onmouseout = null;
            });
            
            // Reset buttons
            saveButton.style.display = 'none';
            cancelButton.style.display = 'none';
            editorIndicator.style.display = 'none';
            editButton.style.display = 'block';
        });
    }
});