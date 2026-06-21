# JS Fundamentals Demos

This is a collection of simple interactive projects I built over the weekends to practice JavaScript fundamentals. The main goal was to focus on basic concepts like DOM manipulation, arrays, promises, and local storage without relying on complex frameworks or libraries.

All projects share a similar clean design with a purple color palette. The code is structured to be straightforward and easy to read.

## Projects

### Calculator
A basic interactive calculator. It handles standard math operations and updates the display. The main thing I practiced here was event delegation by handling button clicks from the main grid. It also uses promises to simulate saving calculation history.

### Counter
A step counter where you can add, subtract, and reset the number based on a custom step input. It features a logging system that records actions. I used promises with set timeouts here to simulate how an asynchronous save operation would work in a real application.

### To-Do
A straightforward to-do list app. You can add tasks, cross them off, and clear completed ones. The focus of this demo was manipulating arrays and utilizing local storage so the data persists when you refresh the browser page.

## Challenges I Encountered

1. **State vs. DOM Syncing**: In the calculator, I ran into a bug where pressing equals wouldn't calculate properly and just showed a weird "null" string. It turned out I had a typo in my state object keys (`preValue` instead of `prevValue`). JavaScript just silently returns `undefined` for missing object keys instead of throwing a loud error, which made it tricky to track down. I learned how important it is to keep the `state` object strictly synced as the single source of truth before updating the HTML display.

2. **How Promises Actually Work**: When trying to fake an asynchronous database save for the action logs, I initially misunderstood how promises delay execution. I learned that the code inside a `new Promise()` executor runs synchronously right away. To actually make the code wait, I had to put the `resolve()` call inside the `setTimeout()` callback.

3. **CSS Complexity**: I initially tried to use advanced CSS functions like `clamp()` and lots of `rem` math for responsive font sizing. It got way too complicated to manage quickly, so I went back to standard `px` values. It made the styling much easier to read and tweak.

## Setup and Running

Since everything is written in vanilla HTML, CSS, and JS, there is no build process or `npm install` required. 

You can literally just double-click the `index.html` file inside any of the project folders to open it directly in your web browser.

If you prefer to run it through a local development server (which is good practice to avoid local file protocol issues), you can run one of these commands in your terminal:

```bash
# Navigate to the main directory
cd JS_fundamentals_demos

# If you have Node.js installed, you can run:
npx serve .

# Or if you have Python installed, you can run:
python -m http.server 8000
```

Then just click on the `calculator`, `counter`, or `to-do` folders in the browser directory listing to see them live.
