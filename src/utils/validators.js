
export const validateInput = (name, value) => {
    const nameRegex = /^[\p{L}]+$/u;
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/i;

    if (!value) return "";
  
    if (name === "email" && !emailRegex.test(value)) {
      return "Invalid email. Please enter correct format.";
    }
  
    if ((name === "lastName" || name === "firstName") && !nameRegex.test(value)) {
      return "Invalid name. Please enter correct format.";
    }
  
    return ""; // không có lỗi
  };