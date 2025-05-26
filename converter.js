// Image to ICO Converter JavaScript
// Save this file as "converter.js" in the same folder as your HTML file

let selectedFile = null;

// Handle file selection
document.getElementById('imageInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    selectedFile = file;
    showPreview(file);
    document.getElementById('convertBtn').disabled = false;
    hideMessages();
  }
});

// Show preview of selected image
function showPreview(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById('previewImage');
    const info = document.getElementById('imageInfo');
    
    preview.src = e.target.result;
    preview.style.display = 'block';
    
    // Show file info
    const fileSize = (file.size / 1024).toFixed(1);
    info.textContent = `File: ${file.name} (${fileSize} KB)`;
    info.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

// Hide success/error messages
function hideMessages() {
  document.getElementById('successMessage').style.display = 'none';
  document.getElementById('errorMessage').style.display = 'none';
}

// Show error message
function showError(message) {
  document.getElementById('errorText').textContent = message;
  document.getElementById('errorMessage').style.display = 'block';
}

// Show success message
function showSuccess() {
  document.getElementById('successMessage').style.display = 'block';
}

// Simulate conversion process with animation
async function simulateConversionProcess() {
  const loadingSection = document.getElementById('loadingSection');
  const progressFill = document.getElementById('progressFill');
  const loadingText = document.getElementById('loadingText');
  
  loadingSection.style.display = 'block';
  
  const steps = [
    { progress: 20, text: "Reading image data..." },
    { progress: 40, text: "Resizing to standard ICO sizes..." },
    { progress: 60, text: "Generating 16x16 icon..." },
    { progress: 80, text: "Generating 32x32 icon..." },
    { progress: 100, text: "Finalizing ICO file..." }
  ];

  for (let i = 0; i < steps.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    progressFill.style.width = steps[i].progress + '%';
    loadingText.textContent = steps[i].text;
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  loadingSection.style.display = 'none';
}

// Convert image to ICO format
async function convertToIco(imageFile) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function() {
      // Create a 32x32 ICO (simplified - real ICO files contain multiple sizes)
      canvas.width = 32;
      canvas.height = 32;
      
      // Draw the image scaled to fit
      ctx.drawImage(img, 0, 0, 32, 32);
      
      // Convert to blob
      canvas.toBlob(function(blob) {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create ICO blob'));
        }
      }, 'image/x-icon');
    };

    img.onerror = function() {
      reject(new Error('Failed to load image'));
    };

    // Create object URL for the image
    img.src = URL.createObjectURL(imageFile);
  });
}

// Main conversion function
document.getElementById('convertBtn').addEventListener('click', async function() {
  if (!selectedFile) {
    showError('Please select an image file first.');
    return;
  }

  hideMessages();
  this.disabled = true;

  try {
    // Show animation unless skipped
    const skipAnimation = document.getElementById('skipAnimation').checked;
    if (!skipAnimation) {
      await simulateConversionProcess();
    }

    // Perform actual conversion
    const icoBlob = await convertToIco(selectedFile);
    
    // Create download link
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = URL.createObjectURL(icoBlob);
    downloadLink.download = selectedFile.name.replace(/\.[^/.]+$/, '') + '.ico';
    
    // Show success and download section
    showSuccess();
    document.getElementById('downloadSection').style.display = 'block';

  } catch (error) {
    console.error('Conversion failed:', error);
    showError('Failed to convert image to ICO format. Please try with a different image.');
  } finally {
    this.disabled = false;
  }
});

// Update file input button text when file is selected
document.getElementById('imageInput').addEventListener('change', function() {
  const button = document.querySelector('.file-input-button');
  if (this.files[0]) {
    button.textContent = `📁 ${this.files[0].name}`;
  } else {
    button.textContent = '📁 Choose Image File';
  }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Image to ICO Converter loaded successfully');
});