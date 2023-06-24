const isValidName = (name)=>{
    let regex = /^[a-zA-Z '.-]+$/;
    return regex.test(name);
};

const isValidPassword = (password)=>{
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};

const isValidEmail = (email)=>{
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

module.exports = {isValidName,isValidEmail,isValidPassword}