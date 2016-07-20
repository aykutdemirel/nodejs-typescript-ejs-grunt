var Student = (function () {
    function Student(firstName, middleInitial, lastName, age) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.age = age;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
    return Student;
}());
function greeter(person) {
    return "Hello, " + person.firstName + " " + person.lastName + " " + person.age;
}
var user = new Student("Jane", "M.", "User", "30");
document.querySelector("#product").innerHTML = greeter(user);
//# sourceMappingURL=main.js.map