"use strict";

// sample data - expanded Star Wars characters with varied ages
const users = [
  { id: 1, name: "Luke Skywalker", age: 23 },
  { id: 2, name: "Darth Vader", age: 45 },
  { id: 3, name: "Princess Leia", age: 23 },
  { id: 4, name: "Obi-Wan Kenobi", age: 57 },
  { id: 5, name: "Yoda", age: 900 },
  { id: 6, name: "Han Solo", age: 32 },
  { id: 7, name: "Chewbacca", age: 234 },
  { id: 8, name: "R2-D2", age: 33 },
  { id: 9, name: "C-3PO", age: 112 },
  { id: 10, name: "Padmé Amidala", age: 27 },
];

// broken test data for exercise 6
const usersBroken = [
  { id: 1, name: "Ahsoka Tano", age: 40 },
  { id: 2, age: 55 },
  { id: 3, name: "Bo-Katan Kryze", age: 35 },
  { id: 4, name: "Wilhuff Tarkin", age: 80 },
  { id: 5, age: 45 },
  { id: 6, name: "Lando Calrissian", age: 50 },
  { id: 7, name: "Din Djarin", age: 48 },
  { id: 8, age: 36 },
  { id: 9, name: "Poe Dameron", age: 42 },
  { id: 10, name: "Mitth'raw'nuruodo", age: 65 },
];

window.addEventListener("load", onLoadFunc);

function onLoadFunc()
{
  let nameList;
  let i;

  // 1. Print out the names of each character in the console, then render them in the HTML list with id "names-list"
  nameList = document.getElementById('names-list');
  i = 0;
  console.log("1. Print out the names of each character in the console.");
  for(i=0; i<users.length; i++)
  {
    console.log(users[i].name);
    const nameListLi = document.createElement('li');
    nameListLi.textContent = users[i].name;
    nameList.appendChild(nameListLi);
  }

  // 2. Print out the names of characters whose age is less than 40 in the console, then render them in the HTML list with id "young-characters-list"
  nameList = document.getElementById('young-characters-list');
  i = 0;
  console.log("2. Print out the names of characters whose age is less than 40 in the console.");
  for(i=0; i<users.length; i++)
  {
    if(users[i].age < 40)
    {
      console.log(users[i].name);
      const nameListLi = document.createElement('li');
      nameListLi.textContent = users[i].name;
      nameList.appendChild(nameListLi);
    }
  }

  // 3. Create a reusable function that takes any array and uses logic to render a list of character names in the HTML. Use this function to populate the list with id "function-list"
  printName(users);
  
  // 4. Create a function that takes an array and an age threshold parameter. The function should only display characters whose age is below the given number. Render results in the list with id "age-filter-list"
  printNameAgeCheck(users, 40);

  // 5. Add error handling to your functions that will log an error message using console.error() if any object doesn't have a "name" property. Display any error messages in the div with id "error-messages"
  printNameCheckError(users);

  // 6. Test your error handling by creating a second array that's intentionally broken (missing name properties) and passing it to your functions. Verify that your error handling works correctly and displays errors in the div with id "broken-array-errors"
  printNameCheckErrorBroken(usersBroken);
}

function printName(nameArray)
{
  const outputList = document.getElementById('function-list');
  let i = 0;
  for(i=0; i<nameArray.length; i++)
  {
    const outputListLi = document.createElement('li');
    outputListLi.textContent = nameArray[i].name;
    outputList.appendChild(outputListLi);
  }
}

function printNameAgeCheck(nameArray, age)
{
  const outputList = document.getElementById('age-filter-list');
  let i = 0;
  for(i=0; i<nameArray.length; i++)
  {
    if(nameArray[i].age < age)
    {
      const outputListLi = document.createElement('li');
      outputListLi.textContent = nameArray[i].name;
      outputList.appendChild(outputListLi);
    }
  }
}

function printNameCheckError(nameArray)
{
  const outputList = document.getElementById('error-handling-list');
  const errorMessage = document.getElementById('error-messages');
  let i = 0;
  for(i=0; i<nameArray.length; i++)
  {
    try
    {
      if(!nameArray[i].hasOwnProperty("name"))
      {
        throw (nameArray[i].id);
      }
      else
      {
        const outputListLi = document.createElement('li');
        outputListLi.textContent = nameArray[i].name;
        outputList.appendChild(outputListLi);
      }
    }
    catch(err)
    {
      console.error("ID: " + err + " has no name.");
      errorMessage.innerHTML = errorMessage.innerHTML + "<br />ID: " + err + " has no name.";
    }
  }
}

function printNameCheckErrorBroken(nameArray)
{
  const outputList = document.getElementById('broken-array-list');
  const errorMessage = document.getElementById('broken-array-errors');
  let i = 0;
  for(i=0; i<nameArray.length; i++)
  {
    try
    {
      if(!nameArray[i].hasOwnProperty("name"))
      {
        throw (nameArray[i].id);
      }
      else
      {
        const outputListLi = document.createElement('li');
        outputListLi.textContent = nameArray[i].name;
        outputList.appendChild(outputListLi);
      }
    }
    catch(err)
    {
      console.error("ID: " + err + " has no name.");
      errorMessage.innerHTML = errorMessage.innerHTML + "<br />ID: " + err + " has no name.";
    }
  }
}
