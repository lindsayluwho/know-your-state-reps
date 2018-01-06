var lastNameCommaFirstName = (name) => {

        var name = name.split(" ")

        if (name.length === 2) {
            var firstName = name[0]
            var lastName = name[1]
            var lastNameCommaFirstName = lastName + ", " + firstName;
            console.log(lastNameCommaFirstName)
            return lastNameCommaFirstName
        }

        if (name.length === 3) {
        	var firstName = name[0]
            var lastName = name[2]
            console.log(name);
            var middleName;
            if (name[1].length === 1) {
            	middleName = name[1] + "."
            }
            else {
            	middleName = name[1]
            }

            console.log(middleName);
           	var lastNameCommaFirstName = `${lastName}, ${firstName} ${middleName}`
            console.log(lastNameCommaFirstName)
            return lastNameCommaFirstName
        }
}

console.log(lastNameCommaFirstName('Eliana Pintor Marin'))