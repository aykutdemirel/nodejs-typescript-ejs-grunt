class Student {
    fullName: string;
    constructor(public firstName, public middleInitial, public lastName, public age) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

interface Person {
    firstName: string;
    lastName: string;
    age: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstName + " " + person.lastName + " " + person.age;
}

var user = new Student("Jane", "M.", "User", "30");

document.querySelector("#product").innerHTML = greeter(user);