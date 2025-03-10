This folder contains custom JavaScript that will be loaded into Akumina to customize our installation. At the end of the day these all become `digitalworkplace.custom.js`, but we have split them up into multiple original sources.

- `BeforePageLoad.js`: JavaScript loaded here will be packed as a separate entrypoint and will be inserted into the final file without an IIFE to ensure it executes as soon as loaded. Use of it should be minimized.
- `digitalworkplace.custom.js`: This is the main JavaScript file that will be executed. It is the primary entrypoint for our JavaScript.
- `modules`: This folder contains our various modules that are used in `digitalworkplace.custom.js`. 