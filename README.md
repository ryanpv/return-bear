# Return-Bear Task

## Task

The task here is to create a simple web app to look up a phone number of a text message. A set of data is provided in the JSON file. The web app must return an object from the dataset with the longest "prefix" that matches the phone number. The message should be returned with any urls highlighted and clickable. 

I use React Typescript for my frontend and Express Typescript for my backend. My solutions are below:

### Front-end

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

