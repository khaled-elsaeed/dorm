console.clear();

function ready(fn) {
   if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(fn, 1);
      document.removeEventListener('DOMContentLoaded', fn);

   } else {
      document.addEventListener('DOMContentLoaded', fn);
   }
}

ready(function () {

   // Global Constants

   const progressForm = document.getElementById('progress-form');

   const tabItems = progressForm.querySelectorAll('[role="tab"]'),
      tabPanels = progressForm.querySelectorAll('[role="tabpanel"]');

   let currentStep = 0;


   // Form Validation

   /*****************************************************************************
 * Allow Student to enter only one option (gpa or certification(type & result))
 * Depending on year of study option
 * level one newcomer --> certification(type & result) else gpa
 * with clearing the input of hidden fields
 */

function toggleFields(level) {
   var certField = document.getElementById('certificationTypeSection');
   var gpaField = document.getElementById('gpaSection');
   var certType_input = document.getElementById('certificationType');
   var certResult_input = document.getElementById('certificationScore');
   var gpa_input = document.getElementById('cgpa');

   if (level == '0') {
       certField.style.display = 'block';
       gpaField.style.display = 'none';
       gpa_input.removeAttribute('required');
       gpa_input.value = "";
       certType_input.setAttribute('required', '');
       certResult_input.setAttribute('required', '');
   } else {
       certField.style.display = 'none';
       gpaField.style.display = 'block';
       gpa_input.setAttribute('required', '');
       certType_input.removeAttribute('required');
       certResult_input.removeAttribute('required');
       certResult_input.value = "";
       certType_input.value = "";
   }
}


let yearOfStudyValue; // Declare a variable outside the event listener scope

document.getElementById('yearOfStudy').addEventListener('change', function (event) {
   yearOfStudyValue = event.target.value;
   toggleFields(yearOfStudyValue);
});


/*****************************************************************************
* Validation functions for Government ID and Student ID
*/

const isValidGovernmentId = val => {
   const passportRegex = /^[A-Z0-9]{6,20}$/;
   const governorateIdRegex = /^[0-9]{14}$/;
   const regex = new RegExp(`(${passportRegex.source})|(${governorateIdRegex.source})`);
   return regex.test(val);
};


const validateGovernmentId = field => {
   const val = field.value.trim();

   if (val === '' && field.required) {
       return { isValid: false };
   } else {
       if (isValidGovernmentId(val)) {
           return { isValid: true };
       }
       return { isValid: false, message: 'Please provide a valid Government-issued ID.' };
   }
};

const isValidStudentId = val => {
   const studentIdRegex = /^[0-9]{9}$/; // Matches exactly 9 digits
   return studentIdRegex.test(val);
};

const validateStudentId = field => {
   const val = field.value.trim();

   if (val === '' && field.required) {
       return { isValid: false };
   } else {
       if (isValidStudentId(val)) {
           return { isValid: true };
       }
       return { isValid: false, message: 'Please provide a valid Student ID.' };
   }
};


/*****************************************************************************
* Validation functions for CGPA and Certification Score
*/

const isValidCgpa = val => {
   const cgpaRegex = /^(?:[0-3](?:\.\d{1,2})?|4(?:\.0{1,2})?)$/;
   return cgpaRegex.test(val);
};

const validateCgpa = field => {
   const val = field.value.trim();

   if (val === '' && field.required) {
       return { isValid: false };
   } else {
       if (isValidCgpa(val)) {
           return { isValid: true };
       }
       return { isValid: false, message: 'Please provide a valid CGPA (0 < CGPA <= 4).' };
   }
};

const isValidCertificationScore = val => {
   const certificationScoreRegex = /^(?:50(?:\.\d{1,2})?|[5-9]\d(?:\.\d{1,2})?|9[0-9](?:\.\d{1,2})?)$/;
   return certificationScoreRegex.test(val);
};

const validateCertificationScore = field => {
   const val = field.value.trim();

   if (val === '' && field.required) {
       return { isValid: false };
   } else {
       if (isValidCertificationScore(val)) {
           return { isValid: true };
       }
       return { isValid: false, message: 'Please provide a valid Score (50 < Score <= 100).' };
   }
};


/*****************************************************************************
* Event listeners for CGPA and Certification Score inputs
*/


const cgpaInput = document.getElementById('cgpa');

cgpaInput.addEventListener('input', function (event) {
    const input = event.target;
    let value = input.value.replace(/[^\d.]/g, ''); // Remove non-digit characters except decimal point

    // Ensure only two decimal places
    const parts = value.split('.');
    if (parts.length > 1) {
        value = parts[0] + '.' + parts[1].slice(0, 2); // Take only two decimal places
    }

    // Automatically add decimal after first digit
    if (value.length > 1 && value.indexOf('.') === -1) {
        value = value.slice(0, 1) + '.' + value.slice(1); // Insert decimal after second digit
    }

    input.value = value;
});

cgpaInput.addEventListener('keydown', function (event) {
    if (event.key === 'Backspace') {
        const input = event.target;
        let value = input.value;

        // If backspace is pressed and the cursor is before the decimal point, remove the previous digit
        const decimalIndex = value.indexOf('.');
        const selectionStart = input.selectionStart;
        if (selectionStart > 0 && selectionStart <= decimalIndex) {
            value = value.slice(0, selectionStart - 1) + value.slice(selectionStart);
            input.value = value;
            input.setSelectionRange(selectionStart - 1, selectionStart - 1);
            event.preventDefault(); // Prevent the default backspace behavior
        }
    }
});




const certificationScoreInput = document.getElementById('certificationScore');

certificationScoreInput.addEventListener('input', function (event) {
    const input = event.target;
    let value = input.value.replace(/[^\d.]/g, ''); // Remove non-digit characters except decimal point

    // Ensure only two decimal places
    const parts = value.split('.');
    if (parts.length > 1) {
        value = parts[0] + '.' + parts[1].slice(0, 2); // Take only two decimal places
    }

    // Automatically add decimal after second digit
    if (value.length > 2 && value.indexOf('.') === -1) {
        value = value.slice(0, 2) + '.' + value.slice(2); // Insert decimal after second digit
    }

    input.value = value;
});

certificationScoreInput.addEventListener('keydown', function (event) {
    if (event.key === 'Backspace') {
        const input = event.target;
        let value = input.value;

        // If backspace is pressed and the cursor is before the decimal point, remove the previous digit
        const decimalIndex = value.indexOf('.');
        const selectionStart = input.selectionStart;
        if (selectionStart > 0 && selectionStart <= decimalIndex) {
            value = value.slice(0, selectionStart - 1) + value.slice(selectionStart);
            input.value = value;
            input.setSelectionRange(selectionStart - 1, selectionStart - 1);
            event.preventDefault(); // Prevent the default backspace behavior
        }
    }
});






   /*****************************************************************************
    * Expects a string.
    *
    * Returns a boolean if the provided value *reasonably* matches the pattern
    * of a real email address.
    *
    * NOTE: There is no such thing as a perfect regular expression for email
    *       addresses; further, the validity of an email address cannot be
    *       verified on the front end. This is the closest we can get without
    *       our own service or a service provided by a third party.
    *
    * RFC 5322 Official Standard: https://emailregex.com/
    */


   /*****************************************************************************
    * Expects a string.
    *
    * Returns a boolean if the provided value *reasonably* matches the pattern
    * of a US phone number. Optional extension number.
    */

   const isValidPhone = val => {
      const regex = /^((\+|00)?20(10|11|12|15)|010|011|012|015)\d{8}$/;
      return regex.test(val);
   };


   /*****************************************************************************
    * Expects a string.
    *
    * Returns a boolean if the provided value *reasonably* matches the pattern
    * of a real email address.
    *
    * NOTE: There is no such thing as a perfect regular expression for email
    *       addresses; further, the validity of an email address cannot be
    *       verified on the front end. This is the closest we can get without
    *       our own service or a service provided by a third party.
    *
    * RFC 5322 Official Standard: https://emailregex.com/
    */

   const isValidEmail = val => {
      const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

      return regex.test(val);
   };

   /*****************************************************************************
    * Expects a Node (input[type="text"] or textarea).
    */

   const validateText = field => {
      const val = field.value.trim();

      if (val === '' && field.required) {
         return {
            isValid: false
         };
      } else {
         return {
            isValid: true
         };
      }
   };


   /*****************************************************************************
    * Expects a Node (select).
    */

   const validateSelect = field => {
      const val = field.value.trim();

      if (val === '' && field.required) {
         return {
            isValid: false,
            message: 'Please select an option from the dropdown menu.'
         };
      } else {
         return {
            isValid: true
         };
      }
   };

   /*****************************************************************************
    * Expects a Node (fieldset).
    */

   const validateGroup = fieldset => {
      const choices = fieldset.querySelectorAll('input[type="radio"], input[type="checkbox"]');

      let isRequired = false,
         isChecked = false;

      for (const choice of choices) {
         if (choice.required) {
            isRequired = true;
         }

         if (choice.checked) {
            isChecked = true;
         }
      }

      if (!isChecked && isRequired) {
         return {
            isValid: false,
            message: 'Please make a selection.'
         };
      } else {
         return {
            isValid: true
         };
      }
   };

   /*****************************************************************************
    * Expects a Node (input[type="radio"] or input[type="checkbox"]).
    */

   const validateChoice = field => {
      return validateGroup(field.closest('fieldset'));
   };

   /*****************************************************************************
    * Expects a Node (input[type="tel"]).
    */

   const validatePhone = field => {
      const val = field.value.trim();

      if (val === '' && field.required) {
         return {
            isValid: false
         };
      } else if (val !== '' && !isValidPhone(val)) {
         return {
            isValid: false,
            message: 'Please provide a valid EG phone number.'
         };
      } else {
         return {
            isValid: true
         };
      }
   };

   /*****************************************************************************
    * Expects a Node (input[type="email"]).
    */

   const validateEmail = field => {
      const val = field.value.trim();

      if (val === '' && field.required) {
         return {
            isValid: false
         };
      } else if (val !== '' && !isValidEmail(val)) {
         return {
            isValid: false,
            message: 'Please provide a valid email address.'
         };
      } else {
         return {
            isValid: true
         };
      }
   };

   /*****************************************************************************
    * Expects a Node (input[type="file"]).
    */

   const validateFileInput = field => {
      const file = field.files[0]; // Get the selected file

      if (!file) { // Check if a file is selected
         return {
            isValid: false,
            message: 'Please select a file.'
         };
      } else {
         return {
            isValid: true
         };
      }
   };


   /*****************************************************************************
    * Expects a Node (field or fieldset).
    *
    * Returns an object describing the field's overall validity, as well as
    * a possible error message where additional information may be helpful for
    * the user to complete the field.
    */

   const getValidationData = field => {
      if(field.id == "governmentId"){
         return validateGovernmentId(field);
      }else if(field.id == "studentId"){
         console.log(field);

         return validateStudentId(field);
      }else if(field.id == "cgpa" && field.required){
         return validateCgpa(field);
      }else if(field.id == "certificationScore" && field.required ){
         return validateCertificationScore(field);
      }else if (field.type === 'text' || field.type === 'textarea' || field.type === 'date') {
         return validateText(field);
      } else if (field.type === 'select-one') {
         return validateSelect(field);
      } else if (field.type === 'fieldset') {
         return validateGroup(field);
      } else if (field.type === 'radio' || field.type === 'checkbox') {
         return validateChoice(field);
      } else if (field.type === 'tel') {
         return validatePhone(field);
      } else if (field.type === 'email') {
         return validateEmail(field);
      } else if (field.type === 'file') {
         return validateFileInput(field);
      } else {
         throw new Error(`The provided field type '${field.tagName}:${field.type}' is not supported in this form.`);
      }
   };


   /*****************************************************************************
    * Expects a Node (field or fieldset).
    *
    * Returns the field's overall validity based on conditions set within
    * `getValidationData()`.
    */

   const isValid = field => {
      return getValidationData(field).isValid;

   };

   /*****************************************************************************
    * Expects an integer.
    *
    * Returns a promise that either resolves if all fields in a given step are
    * valid, or rejects and returns invalid fields for further processing.
    */

   const validateStep = currentStep => {
      const fields = tabPanels[currentStep].querySelectorAll('fieldset, input:not([type="radio"]):not([type="checkbox"]), select, textarea');

      const invalidFields = [...fields].filter(field => {
         return !isValid(field);
      });

      return new Promise((resolve, reject) => {
         if (invalidFields && !invalidFields.length) {
            resolve();
         } else {
            reject(invalidFields);
         }
      });
   };

   // Form Error and Success

   const FIELD_PARENT_CLASS = 'form__field',
      FIELD_ERROR_CLASS = 'form__error-text';

   /*****************************************************************************
    * Expects a Node (fieldset) that contains any number of radio or checkbox
    * input elements, and a string representing the group's validation status.
    */

   function updateChoice(fieldset, status, errorId = '') {
      const choices = fieldset.querySelectorAll('[type="radio"], [type="checkbox"]');

      for (const choice of choices) {
         if (status) {
            choice.setAttribute('aria-invalid', 'true');
            choice.setAttribute('aria-describedby', errorId);
         } else {
            choice.removeAttribute('aria-invalid');
            choice.removeAttribute('aria-describedby');
         }
      }
   }


   /*****************************************************************************
    * File upload
    */
   var dropContainer = document.getElementById("dropcontainer");
   var fileInput = document.getElementById("invoice");

   dropContainer.addEventListener("dragover", function (e) {
      // prevent default to allow drop
      e.preventDefault();
   }, false);

   dropContainer.addEventListener("dragenter", function () {
      dropContainer.classList.add("drag-active");
   });

   dropContainer.addEventListener("dragleave", function () {
      dropContainer.classList.remove("drag-active");
   });

   dropContainer.addEventListener("drop", function (e) {
      e.preventDefault();
      dropContainer.classList.remove("drag-active");
      fileInput.files = e.dataTransfer.files;
   });

   /*****************************************************************************
    *  get data from json files to populate select
    */
   // Function to fetch data from the server
   async function getData(url = "") {
      try {
         const response = await fetch(url, {
            method: "GET", // Use GET method for fetching data
            headers: {
               "Content-Type": "application/json"
            }
         });
         return response.json();
      } catch (error) {
         console.error("Error in getData:", error);
         throw new Error("Failed to fetch data");
      }
   }

   async function getNationalitiesData() {
      const data = await getData('assets/data/nationalities.json');
      return data;
   }

   async function populateNationalitiesSelect() {
      try {
         const data = await getNationalitiesData();
         var select = document.getElementById('nationality');
         select.innerHTML = '';
         var defaultOption = document.createElement('option');
         defaultOption.value = '';
         defaultOption.textContent = 'Select Nationality';
         defaultOption.disabled = true;
         defaultOption.selected = true;
         select.appendChild(defaultOption);

         data.forEach(function (nationality) {
            var option = document.createElement('option');
            option.value = nationality;
            option.textContent = nationality;
            select.appendChild(option);
         });
      } catch (error) {
         console.error('Error populating nationalities select:', error);
      }
   }

   async function getGovernoratesData() {
      const data = await getData('assets/data/governorates.json');
      return data;
   }

   async function populateGovernoratesSelect() {
      try {
         const data = await getGovernoratesData();
         const governorates = data[2].data;
         var select = document.getElementById('addressGovernorate');

         select.innerHTML = '';
         var defaultOption = document.createElement('option');
         defaultOption.value = '';
         defaultOption.textContent = 'Select Governorate';
         defaultOption.disabled = true;
         defaultOption.selected = true;
         select.appendChild(defaultOption);

         governorates.forEach(function (governorate) {
            var option = document.createElement('option');
            option.value = governorate.governorate_name_en;
            option.textContent = governorate.governorate_name_en;
            option.setAttribute('data-governorate-id', governorate.id);
            select.appendChild(option);
         });
      } catch (error) {
         console.error('Error populating governorates select:', error);
      }
   }

   var cities = [];

   async function getCitiesData() {
      const data = await getData('assets/data/cities.json');
      cities = data[2].data;
   }

   async function filterCitiesByGovernorateId(governorateId) {
      const filteredCities = cities.filter(city => city.governorate_id == governorateId);
      return filteredCities;
   }

   async function populateCitiesSelect(filteredCitites) {
      try {
         var select = document.getElementById('addressCity');
         select.innerHTML = '';
         var defaultOption = document.createElement('option');
         defaultOption.value = '';
         defaultOption.textContent = 'Select City';
         defaultOption.disabled = true;
         defaultOption.selected = true;
         select.appendChild(defaultOption);

         filteredCitites.forEach(function (city) {
            var option = document.createElement('option');
            option.value = city.city_name_en;
            option.textContent = city.city_name_en;
            select.appendChild(option);
         });
      } catch (error) {
         console.error('Error populating governorates select:', error);
      }
   }


   // Function to populate cities select based on selected governorate
   async function populateCitiesSelectByGovernorate() {
      try {
         const select = document.getElementById('addressGovernorate');
         const selectedOption = select.selectedOptions[0];
         const governorateId = selectedOption.getAttribute('data-governorate-id');
         const filteredCitites = await filterCitiesByGovernorateId(governorateId);
         populateCitiesSelect(filteredCitites);
      } catch (error) {
         console.error('Error populating cities select:', error);
      }
   }

   // Call functions to populate dropdowns
   populateNationalitiesSelect();

   document.getElementById('addressGovernorate').addEventListener('change', populateCitiesSelectByGovernorate);


   /*****************************************************************************
    *  Functions to fetch and populate faculties and programs
    */

   let faculties = [];

   async function getFacultiesData() {
      try {
         const data = await getData('assets/data/faculties.json');
         faculties = data.faculties;
      } catch (error) {
         console.error('Error fetching faculties data:', error);
      }
   }

   async function populateFacultiesSelect() {
      await getFacultiesData();
      const select = document.getElementById('faculty');
      select.innerHTML = '';

      const defaultOption = createOption('', 'Select Faculty', {
         disabled: true,
         selected: true
      });
      select.appendChild(defaultOption);

      faculties.forEach(faculty => {
         const option = createOption(faculty.faculty, faculty.faculty, {
            'data-faculty-id': faculty.id
         });
         select.appendChild(option);
      });
   }

   async function populateProgramsSelectByFaculty() {
      try {
         const select = document.getElementById('faculty');
         const selectedOption = select.selectedOptions[0];
         const facultyId = selectedOption.getAttribute('data-faculty-id');
         const filteredFaculty = faculties.find(faculty => faculty.id === parseInt(facultyId));
         populateProgramsSelect(filteredFaculty.programs);
      } catch (error) {
         console.error('Error populating programs select:', error);
      }
   }

   function populateProgramsSelect(programs) {
      const select = document.getElementById('program');
      select.innerHTML = '';

      const defaultOption = createOption('', 'Select Program', {
         disabled: true,
         selected: true
      });

      select.appendChild(defaultOption);

      programs.forEach(program => {
         const option = createOption(program, program);
         select.appendChild(option);
      });
   }

   function createOption(value, text, attributes = {}) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = text;

      // Set additional attributes
      for (const attr in attributes) {
         option.setAttribute(attr, attributes[attr]);
      }

      return option;
   }


   /*****************************************************************************
    *  Event listener for faculty change
    */

   document.getElementById('faculty').addEventListener('change', populateProgramsSelectByFaculty);


   /*****************************************************************************
    * Expects a Node (field or fieldset) that either has the class name defined
    * by `FIELD_PARENT_CLASS`, or has a parent with that class name. Optional
    * string defines the error message.
    *
    * Builds and appends an error message to the parent element, or updates an
    * existing error message.
    *
    * https://www.davidmacd.com/blog/test-aria-describedby-errormessage-aria-live.html
    */

   function reportError(field, message = 'Please complete this required field.') {
      const fieldParent = field.closest(`.${FIELD_PARENT_CLASS}`);

      if (progressForm.contains(fieldParent)) {
         let fieldError = fieldParent.querySelector(`.${FIELD_ERROR_CLASS}`),
            fieldErrorId = '';

         if (!fieldParent.contains(fieldError)) {
            fieldError = document.createElement('p');

            if (field.matches('fieldset')) {
               fieldErrorId = `${field.id}__error`;

               updateChoice(field, true, fieldErrorId);
            } else if (field.matches('[type="radio"], [type="checkbox"]')) {
               fieldErrorId = `${field.closest('fieldset').id}__error`;

               updateChoice(field.closest('fieldset'), true, fieldErrorId);
            } else {
               fieldErrorId = `${field.id}__error`;

               field.setAttribute('aria-invalid', 'true');
               field.setAttribute('aria-describedby', fieldErrorId);
            }

            fieldError.id = fieldErrorId;
            fieldError.classList.add(FIELD_ERROR_CLASS);

            fieldParent.appendChild(fieldError);
         }

         fieldError.textContent = message;
      }
   }

   /*****************************************************************************
    * Expects a Node (field or fieldset) that either has the class name defined
    * by `FIELD_PARENT_CLASS`, or has a parent with that class name.
    *
    * https://www.davidmacd.com/blog/test-aria-describedby-errormessage-aria-live.html
    */

   function reportSuccess(field) {
      const fieldParent = field.closest(`.${FIELD_PARENT_CLASS}`);

      if (progressForm.contains(fieldParent)) {
         const fieldError = fieldParent.querySelector(`.${FIELD_ERROR_CLASS}`);

         if (fieldParent.contains(fieldError)) {
            if (field.matches('fieldset')) {
               updateChoice(field, false);
            } else if (field.matches('[type="radio"], [type="checkbox"]')) {
               updateChoice(field.closest('fieldset'), false);
            } else {
               field.removeAttribute('aria-invalid');
               field.removeAttribute('aria-describedby');
            }

            fieldParent.removeChild(fieldError);
         }
      }
   }

   /*****************************************************************************
    * Expects a Node (field or fieldset).
    *
    * Reports the field's overall validity to the user based on conditions set
    * within `getValidationData()`.
    */

   function reportValidity(field) {
      const validation = getValidationData(field);

      if (!validation.isValid && validation.message) {
         reportError(field, validation.message);
      } else if (!validation.isValid) {
         reportError(field);
      } else {
         reportSuccess(field);
      }
   }

   // Form Progression

   /*****************************************************************************
    * Resets the state of all tabs and tab panels.
    */

   function deactivateTabs() {
      // Reset state of all tab items
      tabItems.forEach(tab => {
         tab.setAttribute('aria-selected', 'false');
         tab.setAttribute('tabindex', '-1');
      });

      // Reset state of all panels
      tabPanels.forEach(panel => {
         panel.setAttribute('hidden', '');
      });
   }

   /*****************************************************************************
    * Expects an integer.
    *
    * Shows the desired tab and its associated tab panel, then updates the form's
    * current step to match the tab's index.
    */

   function activateTab(index) {
      const thisTab = tabItems[index],
         thisPanel = tabPanels[index];

      // Close all other tabs
      deactivateTabs();

      // Focus the activated tab for accessibility
      thisTab.focus();

      // Set the interacted tab to active
      thisTab.setAttribute('aria-selected', 'true');
      thisTab.removeAttribute('tabindex');

      // Display the associated tab panel
      thisPanel.removeAttribute('hidden');

      // Update the current step with the interacted tab's index value
      currentStep = index;
   }

   /*****************************************************************************
    * Expects an event from a click listener.
    */

   function clickTab(e) {
      activateTab([...tabItems].indexOf(e.currentTarget));
   }

   /*****************************************************************************
    * Expects an event from a keydown listener.
    */

   function arrowTab(e) {
      const {
         keyCode,
         target
      } = e;

      /**
       * If the current tab has an enabled next/previous sibling, activate it.
       * Otherwise, activate the tab at the beginning/end of the list.
       */

      const targetPrev = target.previousElementSibling,
         targetNext = target.nextElementSibling,
         targetFirst = target.parentElement.firstElementChild,
         targetLast = target.parentElement.lastElementChild;

      const isDisabled = node => node.hasAttribute('aria-disabled');

      switch (keyCode) {
         case 37: // Left arrow
            if (progressForm.contains(targetPrev) && !isDisabled(targetPrev)) {
               activateTab(currentStep - 1);
            } else if (!isDisabled(targetLast)) {
               activateTab(tabItems.length - 1);
            }
            break;
         case 39: // Right arrow
            if (progressForm.contains(targetNext) && !isDisabled(targetNext)) {
               activateTab(currentStep + 1);
            } else if (!isDisabled(targetFirst)) {
               activateTab(0);
            }
            break;
      }
   }

   /*****************************************************************************
    * Expects a boolean.
    *
    * Updates the visual state of the progress bar and makes the next tab
    * available for interaction (if there is a next tab).
    */

   // Immediately attach event listeners to the first tab (happens only once)
   tabItems[0].addEventListener('click', clickTab);
   tabItems[0].addEventListener('keydown', arrowTab);

   function handleProgress(isComplete) {
      const currentTab = tabItems[currentStep],
         nextTab = tabItems[currentStep + 1];

      if (isComplete) {
         currentTab.setAttribute('data-complete', 'true');

         /**
          * Verify that there is, indeed, a next tab before modifying or listening
          * to it. In case we've reached the last item in the tablist.
          */

         if (progressForm.contains(nextTab)) {
            nextTab.removeAttribute('aria-disabled');

            nextTab.addEventListener('click', clickTab);
            nextTab.addEventListener('keydown', arrowTab);
         }

      } else {
         currentTab.setAttribute('data-complete', 'false');
      }
   }

   // Form Interactions

   /*****************************************************************************
    * Returns a function that only executes after a delay.
    *
    * https://davidwalsh.name/javascript-debounce-function
    */

   const debounce = (fn, delay = 500) => {
      let timeoutID;

      return (...args) => {
         if (timeoutID) {
            clearTimeout(timeoutID);
         }

         timeoutID = setTimeout(() => {
            fn.apply(null, args);
            timeoutID = null;
         }, delay);
      };
   };

   /*****************************************************************************
    * Waits 0.5s before reacting to any input events. This reduces the frequency
    * at which the listener is fired, making the errors less "noisy". Improves
    * both performance and user experience.
    */

   progressForm.addEventListener('input', debounce(e => {
      const {
         target
      } = e;


      validateStep(currentStep).then(() => {

         handleProgress(true);

      }).catch(() => {

         handleProgress(false);

      });

      reportValidity(target);
   }));

   /****************************************************************************/

   let isGovernoratesPopulated = false;
   let isCitiesDataLoaded = false;
   let isFacultiesPopulated = false;

   progressForm.addEventListener('click', e => {
      const {
         target
      } = e;

      if (target.matches('[data-action="next"]')) {
         validateStep(currentStep).then(() => {
            if (currentStep === 1) {
               if (!isGovernoratesPopulated) {
                  console.log(isGovernoratesPopulated);
                  populateGovernoratesSelect();
                  isGovernoratesPopulated = true;
               }
               if (!isCitiesDataLoaded) {
                  getCitiesData();
                  isCitiesDataLoaded = true;
               }
            } else if (currentStep === 2) {
               if (!isFacultiesPopulated) {
                  populateFacultiesSelect();
                  isFacultiesPopulated = true;
               }
            }
            handleProgress(true);

            // Progress to the next step
            activateTab(currentStep + 1);
         }).catch(invalidFields => {
            // Update the progress bar (step incomplete)
            handleProgress(false);

            // Show errors for any invalid fields
            invalidFields.forEach(field => {
               reportValidity(field);
            });

            // Focus the first found invalid field for the user
            invalidFields[0].focus();
         });
      }

      if (target.matches('[data-action="prev"]')) {
         // Revisit the previous step
         activateTab(currentStep - 1);
      }
   });


   // Form Submission


   /****************************************************************************/

   function disableSubmit() {
      const submitButton = progressForm.querySelector('[type="submit"]');

      if (progressForm.contains(submitButton)) {

         // Update the state of the submit button
         submitButton.setAttribute('disabled', '');
         submitButton.textContent = 'Submitting...';

      }
   }

   /****************************************************************************/

   function handleSuccess(response) {
      const thankYou = progressForm.querySelector('#progress-form__thank-you');

      // Clear all HTML Nodes that are not the thank you panel
      while (progressForm.firstElementChild !== thankYou) {
         progressForm.removeChild(progressForm.firstElementChild);
      }

      thankYou.removeAttribute('hidden');

      // const rejectContainer = thankYou.querySelector('.reject-container');
      const thankYouContainer = thankYou.querySelector('.thank-you-container'); // Changed to .thank-you-container

      // if (response.success === "reject") {
      //    rejectContainer.removeAttribute('hidden');
      //    const rejectDescription = thankYou.querySelector('#rejectDescrition');
      //    rejectDescription.textContent = response.reason;
      // } else {
         
         thankYouContainer.removeAttribute('hidden'); // Corrected variable name
      // }

   }


   /****************************************************************************/

   function handleError(error) {
      const submitButton = progressForm.querySelector('[type="submit"]');
      const existingErrorText = progressForm.querySelector('.form__error-text');

      // If an existing error message is found, don't display another one
      if (existingErrorText) {
         return;
      }

      if (progressForm.contains(submitButton)) {
         const errorText = document.createElement('p');

         // Reset the state of the submit button
         submitButton.removeAttribute('disabled');
         submitButton.textContent = 'Submit';

         // Display an error message for the user
         errorText.classList.add('m-0', 'form__error-text');
         errorText.textContent = `Sorry, your submission could not be processed.
        Please try again. If the issue persists, please contact our support
        team. Error message: ${error}`;

         submitButton.parentElement.prepend(errorText);
      }
   }


   /****************************************************************************/


   progressForm.addEventListener('submit', e => {
      // Prevent the form from submitting
      e.preventDefault();

      // Validate the current step before submitting
      validateStep(currentStep)
         .then(() => {
            // Get the API endpoint using the form action attribute
            const form = e.currentTarget,
               API = new URL(form.action);

            // Indicate that the submission is working
            disableSubmit();

            const formData = new FormData(form);

            fetch(API, {
                  method: 'POST',
                  body: formData
               })
               .then(response => {
                  if (!response.ok) {
                     throw new Error(response.statusText);
                  }
                  return response.json();
               })
               .then(data => {
                  if (data.success) {
                     handleSuccess(data);
                  } else {
                     handleError(data)
                  }
               })
               .catch(error => {
                  handleError(error);
               });
         })
         .catch(invalidFields => {
            // If the step is not valid, show errors for any invalid fields
            invalidFields.forEach(field => {
               reportValidity(field);
            });

            // Focus the first found invalid field for the user
            invalidFields[0].focus();
         });
   });


});