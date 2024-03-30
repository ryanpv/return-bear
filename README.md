# Return-Bear Task

## Task

The task here is to create a simple web app to look up a phone number of a text message. A set of data is provided in the JSON file. The web app must return an object from the dataset with the longest "prefix" that matches the beginning of the phone number. The message should be returned with any urls highlighted and clickable. 

I use React Typescript for my frontend and Express Typescript for my backend. My solutions are below:

## Front-end

For my front-end I created a simple form with two fields, an input for the phone number, and a textarea for the text message. Below the form, I created a div that will show the results. The displayed results are simply the "linkified" message and the object properties of the JSON data matched (prefix, operator, country, region). I left out any styling to focus more time on the solution. 

For the logic, I decided to separate the phone number and message into their own states. The phone number is sent to the backend, while the message is handled on the front end. The main reasoning for this is because the message itself will have nothing to do with the phone number matching. The message only needs to be returned with any and all URLs highlighted and clickable. My solution for this was to use the library react-linkify. It abstracts all the matching needed for URL prefixes and domain extensions. It also reduces the amount of data being sent back and forth between client-server. The message will be "linkified" as soon as its typed/pasted into the textarea.

The phone number gets sent to the backend for processing and if there are any matches, it will return an object with the longest prefix. The logic on the backend will be explained later, but in general it may return multiple matches. This is because the dataset includes different objects that share the same value for the prefix property, but the other properties have different values. For example:
    {
        "prefix": 1,
        "operator": null,
        "country_code": 1,
        "country": "USA",
        "region": null
    },
    {
        "prefix": 1,
        "operator": null,
        "country_code": 1,
        "country": "Canada",
        "region": null
    },

My backend logic returns a single object, but with the different values concatenated to show all matches. As sometimes the result may include duplicate data (ie. { country: 'Canada', 'Canada' }), I cleaned up the results a bit to remove duplicates and any trailing commas/empty spaces. This was done by iterating through the values, creating a 'Set' for unique values, and then chaining some built-in array methods to remove the unecessary characters.

### Testing (front-end)

I added some simple testing to make sure the component renders and the expect results are returned. The first is a check for the form inputs to be in the document. The second test checks that with a valid phone number input, the correct response is returned. The third test returns a 400 status and checks if the error message is rendered.

## Back-end

The back-end required a bit more time and logic. A simple solution would be to loop through the entire array dataset and return the object that had the longest matching prefix. If there were any objects that shared the same prefix value, the other property values would be concatenated. However, to improve performance I implemented the two pointer method to traverse the dataset array at the very first index (startIndex) and very last index (endIndex). This cuts the number of iterations in half, and therefore improving time complexity. An improved solution, but still a few conditions to consider. I have separated my if statements into three separate sections:
* Currently stored object prefix value matches the object prefix value of the current iteration
* Checking and replacing the currently stored prefix with a longer one if it exists
* Setting the initial matched value (stored value/variable === null)

Some of the if statements are in this specific order to avoid overwriting/skipping over values. I will explain them in a bit more detail.

### Setting the initial matched value (stored value/variable === null)
The first if statement section finds and stores the initial matched prefix value. The very first if statement in this section covers the edge case of the dataset not being sorted by prefix values. Should the startIndex prefix value and endIndex prefix value be the same during the same iteration, then the values will be concatenated with join(). The following if statements in the section would simply store whichever prefix value matches the phone number if they are not the same and continue the loop.

### Currently stored object prefix value matches the object prefix value of the current iteration
In this section, if a prefix value has already been stored and matches with either of the prefix values from both startIndex and endIndex of the iteration, the rest of the property values will be joined. Whether the startIndex prefix value is compared first or the endIndex is does not matter as this code block is not looking to replace any values. 

### Checking and replacing the currently stored prefix with a longer one if it exists
This section of if statements is fairly self-explanatory. It replaces the stored object with another object that has a longer prefix matching the phone number. The order of comparison for the startIndex prefix value or endIndex prefix value does not matter for this either. This targets the iterations where one prefix value is longer than the other and is also longer than the stored prefix value. If the iteration falls on two objects with the same prefix value that are longer than the stored prefix value, the above if statement section will catch it first. Hence why it is placed before this if statement section. Otherwise, any subsequent if statement can overwrite the values as they are executed synchronously.

The loop completes once the start index value and end index value meet in the middle and the stored/initialized value is returned to the front-end. 

### Testing (back-end)

For testing on the backend, I kept it simple and tested the expected API responses. If the correct value format (string of numbers) sent, then a status 200 should be returned. Otherwise, incorrect values such as letters or other non-number characters should return a status 400.

This is the end of my explanation for the solution of this task.