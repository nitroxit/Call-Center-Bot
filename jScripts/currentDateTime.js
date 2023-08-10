function getCurrentDateTime12HourFormat() {
    const now = new Date();
  
    // Get date components
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
  
    // Get time components
    const hours24 = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
  
    // Convert hours to 12-hour format
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = (hours24 % 12) || 12;
  
    // Construct the formatted string
    const formattedDateTime = `${month}-${day}-${year}-${hours12}-${minutes}-${period}`;
  
    return formattedDateTime;
  }


module.exports = getCurrentDateTime12HourFormat;