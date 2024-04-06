# Return-Bear Task

## Task

The task here is to create a simple web app to look up a phone number of a text message. A set of data is provided in the JSON file. The web app must return an object from the dataset with the longest "prefix" that matches the beginning of the phone number. The message should be returned with any urls highlighted and clickable. 

I use React Typescript for my frontend and Express Typescript for my backend. Below will be instructions on how to run the tests/project, and a breakdown of my solution for this task.

## Scripts To Run

### Front-end tests
To run tests for the front-end, cd into the client directory and run `npm run coverage`. This will run tests and repeat if any changes occur.

### Back-end tests
To run tests for the back-end, cd into the server directory and run `npm run test`. This will also run tests and repeat them if any changes occur.

## Run the project
After cloning the repository, if you are running docker, simply cd into the project directory and you can run `docker-compose up`.

Otherwise, you can first cd into both the client directory and server directory and run `npm install`. Then while in the client directory, run the react script `npm start`. In the server directory, run `npm run dev`. This will execute the concurrently library to allow nodemon to run with tsc to retranspile and restart the server code changes.

## Solutions

### Front-end

For my solution, I have separated the handling of the messages and phone number. Messages will be parsed for URLs on the front-end using the library react-linkify. Although it would bring some overhead, this library is a straightforward and simplified solution that can detect URLs while easily being integrated with react components. It would reduce the amount of code needed to write for regEx matching. Additionally, handling messages on the front-end has more benefits, such as reducing server memory usage, processing, and network usage. Though messages can be small in size, dealing with a larger scale of requests can decrease performance. Furthermore, with security concerns in production environments, sending more form data to the back-end for processing would require additional code and library(ies) to validate and sanitize the data. Therefore, even more time and resources would be required. 

Using regEx would be a valid solution as well when handling messages on the front-end. However, trying to match URLs with regEx alone introduces complexity resulting in more challenges to maintain the code. A good benefit for regEx usage would be more flexibility with its customization. If the task was looking to match specific URLs/prefixes/domains then regEx would be the better option. Though, as this task seeks to find all possible URLs, I believe react-linkify would be the better option.

### Testing (front-end)

I added some simple testing to make sure the component renders and the expect results are returned. The first is a check for the form inputs to be in the document. The second test checks that with a valid phone number input, the correct response is returned. The third test returns a 400 status and checks if the error message is rendered when there is an error with the fetch function.

### Back-end
The back-end required a bit more time and logic to produce. A simple solution would be to loop through the entire array dataset and return the object that had the longest matching prefix. Of course, also accounting for any duplicate prefix values. A simple solution of a single loop that offers a linear time complexity with less code for maintenance. To add a possible optimization to this solution could be sorting the dataset, iterating from longest prefix to shortest, and then exiting once there is a match. However, there would still be a chance for iterations needing to continue through the entire dataset. Thus, eliminating the benefit of improved speed.

To improve performance, at the trade-off of introducing slightly more code and complexity, I have implemented a two pointer approach. The benefit is that it is able to traverse the dataset with about half the amount of iterations, which means quicker execution of the task and also at linear time. With a smaller dataset there may not be a significant difference in performance. However, at scale this optimization should be more apparent than the former solution.

As I mentioned earlier, more code and complexity for this task introduces more conditions to be considered. For the task to succeed, the solution needs to find a prefix match and replace it should a longer match is found. Since I found that the provided dataset included some duplicate prefix values from different locations, I also added consideration for those cases to avoid overwriting the result. The use of the two pointer approach requires the solution to also account for situations where both pointers have the same prefix value. This is to also avoid overwriting of results.

### Testing (back-end)

For testing on the backend, I kept it simple and tested the expected API responses. If the correct value format (string of numbers) sent, then a status 200 should be returned. Otherwise, incorrect values such as letters or other non-number characters should return a status 400.

This is the end of my explanation for the solution of this task.