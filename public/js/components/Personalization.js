/* eslint-disable */

// Function to update font size and display current size
export const prso = () => {
  const fontRange = document.getElementById('fontRange');
  const fontsizevalue = document.getElementById('fontRange');
  const headings = document.querySelectorAll('h3, h6 ,h5, p '); // Selecting all <h2>, <h3>, and <p> tags

  const updateFontSize = value => {
    const baseFontSize = 6; // Initial font size
    const fontSizeIncrement = 0.5; // amount to increment or decrement font size by

    // Calculate the font size based on the value
    const calculateFontSize = level => {
      return `${baseFontSize + (level - 1) * fontSizeIncrement}px`;
    };

    headings.forEach(tag => {
      switch (tag.tagName) {
        case 'H3':
          tag.style.fontSize = calculateFontSize(value);
          break;
        case 'H5':
          tag.style.fontSize = calculateFontSize(value - 1);
          break;
        case 'P':
          tag.style.fontSize = calculateFontSize(value - 2);
          break;
        case 'H6':
          tag.style.fontSize = calculateFontSize(value - 2);
          break;
        default:
          tag.style.fontSize = calculateFontSize(value - 2);
      }
    });
  };

  // Update font size and display current size when slider value changes
  if (fontRange) {
    fontRange.addEventListener('input', () => {
      const value = parseInt(fontRange.value);
      console.log(value);
      updateFontSize(value);
      // Function to save font size value to localStorage
      localStorage.setItem('fontSize', value);
    });
  }

  // Function to load font size value from localStorage
  const loadFontSize = () => {
    const savedValue = localStorage.getItem('fontSize');
    console.log(savedValue);
    if (savedValue) {
      updateFontSize(parseInt(savedValue));
    }
    if (fontsizevalue) {
      fontsizevalue.value = savedValue || '2';
    }
  };

  // Call loadFontSize function on page load
  window.addEventListener('load', loadFontSize);
};
