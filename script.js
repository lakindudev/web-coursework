document.addEventListener('DOMContentLoaded', () => {
  displayPrompt();
});

const steps = [
  [ // Step 1 - Personal Information
      { label: "What's your name?", field: "name", type: "text" },
      { label: "what's your surname?", field: "surname", type: "email" },
      { label: "What's your age?", field: "age", type: "number" },
      { label: "What's your gender?", field: "gender", type: "text" }
  ],
  [ // Step 2 - Personal Interest and Hobbies
      { label: "What's your rational?", field: "rational", type: "text" },
      { label: "What's your task?", field: "task", type: "text" },
      { label: "What's your place?", field: "place", type: "text" },
      { label: "What's your type of assignment?", field: "assignment", type: "text" }
  ],
  [ // Step 3 - Work and Goals
      { label: "What's your area of studies?", field: "studyArea", type: "text" },
      { label: "What's your highest degree?", field: "degree", type: "text" },
      { label: "What's your university?", field: "university", type: "text" },
      { label: "What's your completion year?", field: "year", type: "number" }
  ]
];
let currentStep = 0; // Track the current step
let currentPrompt = 0; // Track the current prompt within the step
const responses = {};

function skipPrompt() {
  const stepPrompts = steps[currentStep];
  const prompt = stepPrompts[currentPrompt];
  responses[prompt.field] = "N/A"; // Mark the answer as "N/A"
  currentPrompt++;
  displayPrompt(); // Display the next prompt or step
  displayProfileOutput(); // Optionally update the profile output, if needed
}

function displayPrompt() {
  const promptEl = document.getElementById('prompts');
  const nextBtn = document.getElementById('nextBtn');
  const skipBtn = document.getElementById('skipBtn'); // Ensure you have a reference to the "Skip" button

  // Check if there are more steps to display
  if (currentStep < steps.length) {
    const stepPrompts = steps[currentStep];

    // Check if there are more prompts within the current step
    if (currentPrompt < stepPrompts.length) {
      const prompt = stepPrompts[currentPrompt];
      // Display the current prompt
      promptEl.innerHTML = `<h3>Step ${currentStep + 1} of ${steps.length}</h3><label>${prompt.label}<br/><input type="${prompt.type}" id="inputField"></label>`;
      nextBtn.style.display = 'inline'; // Show the "Next" button
      skipBtn.style.display = 'inline'; // Show the "Skip" button
    } else {
      // If there are no more prompts in the current step, move to the next step
      currentStep++;
      currentPrompt = 0;
      if (currentStep < steps.length) {
        displayPrompt(); // Display the first prompt of the next step
      } else {
        // If all steps are completed
        promptEl.innerHTML = ''; // Clear the prompts area
        nextBtn.style.display = 'none'; // Hide the "Next" button
        skipBtn.style.display = 'none'; // Hide the "Skip" button
      }
    }
    updateProgressBar(); // Optionally, update the progress bar with each prompt
  }
}

function nextPrompt() {
  const inputField = document.getElementById('inputField');
  if (inputField && inputField.value.trim() !== '') {
      const stepPrompts = steps[currentStep];
      const prompt = stepPrompts[currentPrompt];
      responses[prompt.field] = inputField.value.trim();
      currentPrompt++;
      displayPrompt(); // Display the next prompt or step
      displayProfileOutput(); // Update the profile output with the latest answer
  }
}

function updateProgressBar() {
  const totalPrompts = steps.flat().length; // Flatten the steps array to get the total number of prompts
  const promptsCompleted = (currentStep * steps[0].length) + currentPrompt; // Calculate the number of completed prompts accurately
  const progress = (promptsCompleted / totalPrompts) * 100;
  const progressBar = document.getElementById('progress-bar');
  const progressPercentage = document.getElementById('progressPercentage');
  progressBar.innerHTML = `<div style="width:${progress}%;"></div>`;
  progressPercentage.innerHTML = `${Math.round(progress)}%`;
}

function displayProfileOutput() {
  const profileOutput = document.getElementById('profileOutput');
  profileOutput.innerHTML = ''; // Clear previous output

  // Check if all steps are completed
  const allStepsCompleted = currentStep >= steps.length;

  steps.forEach((step, stepIndex) => {
      const stepResponsesExist = step.some(prompt => responses[prompt.field] !== undefined);

      if (stepResponsesExist) {
          const stepHeader = document.createElement('h3');
          stepHeader.textContent = `Step ${stepIndex + 1}`;
          profileOutput.appendChild(stepHeader);

          step.forEach(prompt => {
              if (responses[prompt.field] !== undefined) {
                  const responseDiv = document.createElement('div');
                  responseDiv.classList.add('response-item');

                  const responseParagraph = document.createElement('p');
                  responseParagraph.innerHTML = `<strong>${prompt.label}  :</strong>&nbsp;&nbsp; ${responses[prompt.field]}`;
                  
                  responseDiv.appendChild(responseParagraph);

                  // Only append the edit button if all steps have been completed
                  if (allStepsCompleted) {
                      const editButton = document.createElement('button');
                      editButton.innerHTML = '✏️';
                      editButton.classList.add('edit-btn');
                      editButton.setAttribute('onclick', `editResponse('${prompt.field}')`);
                      responseDiv.appendChild(editButton);
                  }

                  profileOutput.appendChild(responseDiv);
              }
          });
      }
  });
}


let editingField = null; // Track which field is being edited

function editResponse(field) {
  editingField = field; // Set the currently editing field
  const editForm = document.getElementById('editForm');
  const editInput = document.getElementById('editInput');
  
  // Pre-fill the form with the existing answer
  editInput.value = responses[field];
  
  // Show the edit form
  editForm.style.display = 'flex';
}

function submitEdit() {
  const editInput = document.getElementById('editInput');
  const editForm = document.getElementById('editForm');
  
  // Update the response with the new value
  if (editingField && editInput.value.trim() !== '') {
    responses[editingField] = editInput.value.trim();
    
    // Hide the edit form
    editForm.style.display = 'none';
    
    // Redisplay all answers with the updated information
    displayProfileOutput();
  }
}