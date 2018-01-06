var lastNameCommaFirstName = (name) => {

        var name = name.split(" ")

        if (name.length === 2) {
            var firstName = name[0]
            var lastName = name[1]
            var lastNameCommaFirstName = lastName + " " + firstName;
            return lastNameCommaFirstName
        }

        if (name.length === 3) {
            var firstName = name[0]
            var lastName = name[2]
            var middleName;
            if (name[1].length === 1) {
                middleName = name[1] + "."
            }
            else {
                middleName = name[1]
            }

            var lastNameCommaFirstName = `${lastName} ${firstName} ${middleName}`
            return lastNameCommaFirstName
        }
    }

    // This function removes commas from a string
var removeCommas = (string) => {
return string.split('').filter((letter) => {
    return letter != ','
}).join('')
}

var specialCaseName = (string) => {
    string = string.split(" specialCaseName")
    return `${string[1]} ${string[2]} ${string[0]}`
}

console.log(specialCaseName('Eliana Pintor Marin'))