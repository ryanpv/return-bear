# Return-Bear Task

## Task

The task here is to create a simple web app to look up a phone number of a text message. A set of data is provided in the JSON file. The web app must return the dataset with the longest "prefix" that matches the phone number. The message should be returned with any urls highlighted and clickable. 

I use React Typescript for my frontend and Express Typescript for my backend. My solutions are below:

### Front-end

For my front-end I created a simple form with two fields, an input for the phone number, and a textarea for the text message. Below the form, I created a div that will show the results. The displayed results are simply the "linkified" message and the object properties of the JSON data matched (prefix, operator, country, region). I left out any styling to focus my time on the solution. 

Now for the logic.

Instead of sending the phone number and message together to the backend, I decided to separate the two in different states. The phone number is sent to the backend, while the message is handled on the front end. The main reasoning for this is because the message itself will have nothing to do with the phone number matching. The message only needs to be returned with any and all URLs highlighted and clickable.