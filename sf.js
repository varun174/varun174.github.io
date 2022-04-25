var oldIndex;
var newQuoteIndex = -1;
var shlokas;
var shlokas_12, shlokas_15, shlokas_16;
var questions;
var nScore = 0;
var blnScored = false;

function loadWords() {
	if(window.localStorage.getItem("chapter") != '')  { document.getElementById('chapters').value = window.localStorage.getItem("chapter") };
	if(window.localStorage.getItem("choice") != '')  { document.getElementById('choice').value = window.localStorage.getItem("choice") };
	nextQuote();
}

function nextQuote() {
	//If no answer is there, highlight the right answer for a second and move.
	if (newQuoteIndex != -1) {
		showAnswer();
	}
	clear();
	
	determineChapter();
	determindNextQuestionNumber();
	
	//Get the question
	document.getElementById("question").innerHTML = questions[newQuoteIndex].question;
	
	//Get the options printed
	objOptions = questions[newQuoteIndex].options;
	var strAllOptions = "";
	if (questions[newQuoteIndex].type == "single") {
		Object.keys(objOptions).forEach(function(key) {
		  strAllOptions = strAllOptions + createRadio(key, objOptions[key])
		})
	}else if (questions[newQuoteIndex].type == "multi") {
		Object.keys(objOptions).forEach(function(key) {
		  strAllOptions = strAllOptions + createCheckbox(key, objOptions[key])
		})
	}
	document.getElementById('AllOptions').innerHTML = strAllOptions;
	
	blnScored = false;
}

function hideCheckbox() {
	document.getElementById('ckb1').style.display = 'none';
	document.getElementById('lckb1').style.display = 'none';
}

function showAll() {
	determineChapter();
	var qsTable = document.getElementById("qsTable");
	var strFullTableContents = '<table class="table table-striped  text-black"><thead><tr><th>#</th><th>Ans:</th><th>Question</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr></thead><tbody>';
	
	questions.forEach(function(obj, index) { 
		strFullTableContents = strFullTableContents + '<tr><td>' + (index+1) + '</td><td class="text-primary">' + obj.answer + '</td><td>' + obj.question + '</td>' + getTR_TD_Options(index) + '</tr>';
	});
	strFullTableContents = strFullTableContents + '</tbody></table>';
	
	qsTable.innerHTML = strFullTableContents;
}

//JS: helper Functions
function determineChapter() {
	var cmbChapter = document.getElementById("chapters");
	if (cmbChapter.value == 1) questions = qbPhonetics;
	if (cmbChapter.value == 2) questions = qbBhagwadGita;
	if (cmbChapter.value == 3) questions = qbSanathanaDharma;
	if (cmbChapter.value == 4) questions = qbMahabaratha;
	if (cmbChapter.value == 5) questions = qbRamayana;
	
	window.localStorage.setItem("chapter", cmbChapter.value);
	
	var cmbChoice = document.getElementById("choice");
	window.localStorage.setItem("choice", cmbChoice.value);
}
function determindNextQuestionNumber() {
	var progressChoice = document.getElementById("choice").value;
	if (progressChoice == 'order' ) { 
		if (newQuoteIndex == questions.length - 1) newQuoteIndex = 0;
		else newQuoteIndex = newQuoteIndex + 1;
	}
	if (progressChoice == 'random' ) {
		do{
			newQuoteIndex = Math.floor(Math.random() * questions.length);
		} while ((newQuoteIndex == oldIndex));
	}
	oldIndex = newQuoteIndex;
}
function clear() {
	document.getElementById("question").innerHTML = "";
	document.getElementById("answer").innerHTML = "";
}

function createRadio(value, optionToBeDisplayed) {	
	return '<div class="form-check"> <input class="form-check-input" type="radio" id="option'+value+'" name="options" value="'+value+'"><label class="form-check-label" for="option'+value+'" id="'+value+'">'+optionToBeDisplayed+'</label><br></div>';
}
function createCheckbox(value, optionToBeDisplayed) {	
	return '<div class="form-check"> <input class="form-check-input" type="checkbox" id="checkbox'+value+'" name="options" value="'+value+'"><label class="form-check-label" for="checkbox'+value+'" id="'+value+'">'+optionToBeDisplayed+'</label><br></div>';
}

function showAnswer() {
	strExpectedValue = highlightAllAnswersGreen();	
	strActualValue = getActualValue();
		
	//If no answer is selected, return;
	if(document.querySelector('input[name="options"]:checked') == null) {
		return;
	}
	
	//console.log('Expec ' + strExpectedValue.trim() + ' Actual ' + strActualValue);
	if(strActualValue == strExpectedValue.trim()) { 
		if (blnScored == false) { nScore = nScore + 1; blnScored = true; }
		document.getElementById('lblScore').innerText = 'Score: ' + nScore;
	}
}

function highlightAllAnswersGreen() {
	var strExpected = "";
	var ans_array = questions[newQuoteIndex].answer.split(',');
	
	if (questions[newQuoteIndex].type == "single") {
		document.getElementById("answer").innerHTML = 'Answer: ' + ans_array;
		document.getElementById(questions[newQuoteIndex].answer).classList.add('bg-success');
		strExpected = questions[newQuoteIndex].answer.trim();
	} else if (questions[newQuoteIndex].type == "multi") {
		document.getElementById("answer").innerHTML = 'Answer: ' + ans_array;
		for(var i = 0; i < ans_array.length; i++) {
			document.getElementById(ans_array[i].trim()).classList.add('bg-success');
			strExpected = strExpected + ',' + ans_array[i].trim();
		}
	}
	return strExpected;
}
function getActualValue() {
	var strExpectedValue = questions[newQuoteIndex].answer;
	var strActualChecked = "";
	
	if (questions[newQuoteIndex].type == "single") {
		if(document.querySelector('input[name="options"]:checked') != null) {
			strActualChecked = document.querySelector('input[name="options"]:checked').value;
			if(strActualChecked != strExpectedValue) {
				document.getElementById(strActualChecked).classList.add('bg-danger');
			}
		}
	} else if (questions[newQuoteIndex].type == "multi") {
		var markedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');
		for (var checkbox of markedCheckbox) {  
			strActualChecked = strActualChecked + ',' + checkbox.value;
			if(!strExpectedValue.includes(checkbox.value)){
				document.getElementById(checkbox.value).classList.add('bg-danger');
			}
		}
	}
	return strActualChecked;
}

function getTR_TD_Options(index) {
	objOptions = questions[index].options;
	str = "";
	Object.keys(objOptions).forEach(function(key) {
		str = str + "<td>" + objOptions[key] + "</td>" 
		//<td>' + obj.option2 + '</td><td>' + obj.option3 + '</td><td>' + obj.option4 + '</td>
	})
	return str;
}


//================Shlokas
qbPhonetics = [

{
  "question": "2. What is Capital of India?",
  "type": "single",
  "options" : {
	"A": "Delhi",
	"B": "Bangalore",
	"C": "15"
  },
  "answer": "A"
},
{
  "question": "3. Color of Rose",
  "type": "multi",
  "options" : {
	"A": "Red",
	"B": "Blue",
	"C": "Green"
  },
  "answer": "A,B"
},

{ "question": "Given the following trigger implementation:trigger leadTrigger on Lead (before update){final ID BUSINESS_RECORDTYPEID = '012500000009Qad';for(Lead thisLead : Trigger.new){if(thisLead.Company != null && thisLead.RecordTypeId != BUSINESS_RECORDTYPEID){ thisLead.RecordTypeId = BUSINESS_RECORDTYPEID;}}}The developer receives deployment errors every time a deployment is attempted from Sandbox to Production.What should the developer do to ensure a successful deployment?","type": "single","options" : {"A": "Ensure BUSINESS_RECORDTYPEID is retrieved using Schema.Describe calls.","B": "Ensure a record type with an ID of BUSINESS_RECORDTYPEID exists on Production prior to deployment.","C": "Ensure BUSINESS_RECORDTYPEID is pushed as part of the deployment components.","D": "Ensure a record type with an ID of BUSINESS_RECORDTYPEID exists on Production prior to deployment."},"answer": "C"},

{ "question": "In which of the following environments can Developers write code? Select all that apply.","type": "multi","options" : {"A": "Developer edition production org","B": "Enterprise edition production org","C": "Enterprise edition Sandbox org","D": "Professional edition Sandbox org"},"answer": "A,C"},

{ "question": "Which two types of code represent the controller in model-view-controller (MVC) architecture on the Lightning Platform?(Select two answers.)","type": "multi","options" : {"A": "StandardController system methods that are referenced by VisualforceCorrect. The MVC architecture on the Lightning Platform splits the Controller into two parts. They both do operations and execute the logic. One takes care of the client side, and the other handles the server side.","B": "JavaScript that is used to make a menu item display itself Incorrect. JavaScript when used to manipulate the display of menu items is included in the View in the MVC architecture.","C": " A static resource that contains CSS and images Incorrect. Static resources provide the View in the MVC architecture.","D": "Custom Apex and JavaScript code that is used to manipulate dataCorrect. The MVC architecture on the Lightning Platform splits the Controller into two parts. They both do operations and execute the logic. One takes care of the client side, and the other handles the server side."},"answer": "A,D"},

{ "question": "Which of these is an accurate statement about ''with sharing'' keywords? Select all that apply.","type": "multi","options" : {"A": "Inner classes inherit the sharing setting from the container class","B": "Either inner classes or outer classes can be declared as ''with sharing'', but not both","C": "Inner classes do not inherit the sharing setting from the container class","D": "Both inner classes and outer classes can be declared as ''with sharing''"},"answer": "C,D"},

{ "question": "In the given code, from where does the Boolean inherit its value? _x000D_Boolean b = true;","type": "single","options" : {"A": "Class","B": "Object","C": "Enum","D": "String"},"answer": "B"},

{ "question": "Which of these is a characteristic of the Lightning Component framework? Select all that apply. ","type": "multi","options" : {"A": "It has an event-driven architecture.","B": "It works with the existing VF pages","C": "It uses XML as its data format.","D": "It includes responsive components"},"answer": "A,D"},

{ "question": "A developer needs to create a custom Interface in Apex. Which three considerations must the developer keep in mind while developing the Apex Interface?Choose 3 answers","type": "multi","options" : {"A": "A method implementation can be defined within the Apex Interface.","B": " The Apex interface class access modifier can be set to Private, Public, or Global.","C": "The apex class must be declared using the interface keyword.","D": "New method can be added to a public interface within a released package.","E": "New method can be added to a public interface within a released package."},"answer": "A,C,E"},

{ "question": "A developer is asked to create a Visualforce page that displays some Accountfields as well as fields configured on the page layout for related Contacts.How should the developer implement this request?","type": "single","options" : {"A": "Use the tag","B": "Create a controller extension","C": "Add a method to the standard controller.","D": "Use the <apex:relatedList> tag."},"answer": "D"},

{ "question": "Which annotation exposes an Apex class as a RESTful web service?","type": "single","options" : {"A": "AuraEnabled","B": "HttpInvocable","C": "RestResource annotation","D": "Remote Action"},"answer": "C"},

{ "question": "The sales management team at Universal Containers requires thatthe Lead Source field of the Lead record be populated when a Lead is converted.What should be used to ensure that a user populates the Lead Source field prior to converting a Lead?","type": "single","options" : {"A": "Process Builder","B": "Workflow Rule","C": "Validation Rule","D": "Formula field"},"answer": "C"},

{ "question": "A development team wants to use a deployment script lo automatically deploy to a sandbox during their development cycles.Which two tools can they use to run a script that deploysto a sandbox?Choose 2 answers","type": "multi","options" : {"A": "Change sets","B": "Developer Console","C": "Ant Migration Tool","D": "SFDX CLI"},"answer": "C,D"},

{ "question": "A company has been adding data to Salesforce and has not done a good Job oflimiting the creation of duplicate Lead records. The developer is considering writing an Apex process to identify duplicates and merge the records together.Which two statements are valid considerations when using merged?Choose 2 answers","type": "multi","options" : {"A": "External ID fields can be used with the merge method.","B": "Merge is supported with accounts, contacts, cases, and leads.","C": " The field values on the master record are overwritten by the records being merged.","D": "The merge method allows up to three records, including the master and two additional records with the same sObject type, to be merged into the master record."},"answer": "B,D"},

{ "question": "In the following example, which sharing context will myMethod execute whenit is invoked?","type": "single","options" : {"A": "Sharing rules will not be enforced for the running user","B": "Sharing rules MI be enforced for the running user.","C": "Sharing rules will be inherited from the calling context.","D": "Sharing rules Ail be enforced by the instantiating class."},"answer": "C"},

{ "question": "Universal Containers wants to back up all of the data and attachments in its Salesforce org once month. Which approach should a developer use to meet this requirement?","type": "single","options" : {"A": "Use the Data loader command line","B": "Define a Data export scheduled job","C": "Create a Schedulable Apex class","D": "Schedule a report."},"answer": "B"},

{ "question": "When creating a record with a Quick Action, what is the easiest way to post a feed item?","type": "single","options" : {"A": "By selecting create feed item on the quick action.","B": "By selecting create case feed on the new record.","C": "By adding a workflow rule on the new record.","D": "By adding a trigger on the new record."},"answer": "A"},

{ "question": "Which three code lines are required to create a Lightning component on a Visualforce page? Choose 3 answers","type": "multi","options" : {"A": "$Lightning.useComponent","B": "<apex:includeLightning/>","C": "$Lightning.use (Missed)","D": "$Lightning.createComponent","E": "$Lightning.createComponent"},"answer": "B,C,D"},

{ "question": "developer created this Apex trigger that calls MyClass .myStaticMethod: trigger myTrigger on Contact(before insert) ( MyClass.myStaticMethod(trigger.new, trigger.oldMap); } The developer creates a test class with a test method that calls MyClass.mystaticMethod, resulting in 81% overall code coverage. What happens when the developer tries to deploy the trigger and two classes to production, assuming no other code exist?","type": "single","options" : {"A": "The deployment fails because the Apex trigger has no code coverage.","B": "The deployment passes because the Apex code has required (>75%) code coverage.","C": "The deployment fails because no assertions were made in the test method.","D": "The deployment passes because both classes and the trigger were included in the deployment."},"answer": "A"},

{ "question": "A change set deployment from a sandbox to production fails due to a failure in a managed package unit test.The developer spoke with the manager package owner and they determined it is a false positive and can be ignored. What should the developer do to successfully deploy?","type": "single","options" : {"A": " Select 'Run local tests' to run all tests in the org that are not in the managed package.","B": "Select 'Fast Deploy' to run only the tests that are in the change set.","C": "Select 'Run local tests' to run only the tests that are in the change set.","D": "Edit the managed package's unit test."},"answer": "A"},

{ "question": "A Visualforce page has a standard controller for an object that has a lookup relationship to a parent object. How can a developer display data from the parent record on the page?","type": "single","options" : {"A": "By using merge field syntax to retrieve data from the parent record.","B": "By adding a second standard controller to the page for the parent record.","C": "By using a roll-up formula field on the child record to include data from the parent record.","D": "By using SOQL on the Visualforce page to query for data from the parent record."},"answer": "A"},

{ "question": "A developer needs to create records for the object Property__c. The developer creates the following code block:List propertiesToCreate = helperClass.createProperties();try { // line 3 } catch (Exception exp ) { //exception handling } Which line of code would the developer insert at line 3 to ensure that at least some records are created, even if a few records have errors and fail to be created?","type": "single","options" : {"A": "insert propertiesToCreate;","B": "Database.insert(propertiesToCreate, System.ALLOW_PARTIAL);","C": "Database.insert(propertiesToCreate);","D": "Database.insert(propertiesToCreate, false);"},"answer": "D"},

{ "question": "When the number of record in a recordset is unknown, which control statement should a developer use to implement a set of code that executes for every record in the recordset, without performing a .size() or .length() method call?","type": "single","options" : {"A": "Do { } While (Condition)","B": "For (variable : list_or_set) { }","C": "For (init_stmt, exit_condition; increment_stmt) { }","D": "While (Condition) { ... }"},"answer": "B"},

{ "question": "If apex code executes inside the execute() method of an Apex class when implementing the Batchable interface, which statement are true regarding governor limits? Choose 2 answers","type": "multi","options" : {"A": "The apex governor limits are reset for each iteration of the execute() mrthod.","B": "The Apex governor limits might be higher due to the asynchronous nature of the transaction.","C": "The Apex governor limits are relaxed while calling the costructor of the Apex class.","D": "The Apex governor limits cannot be exceeded due to the asynchronous nature of the transaction"},"answer": "A,B"},

{ "question": "Given the following block code: try{ List retrievedRecords = [SELECT Id FROM Account WHERE Website = null]; }catch(Exception e){ //manage exception logic } What should a developer do to ensure the codeexecution is disrupted if the retrievedRecordslist remains empty after the SOQL query?","type": "single","options" : {"A": " Replace the retrievedRecords variable declaration from ftount to a single Account.","B": "Check the state of the retrieveRecords variable and throw a custom exception if the variable is empty.","C": " Check the state of the retrievedRecords variable and use System.assert(false) if the variable is empty","D": "Check the state of the retrievedRecords variable and access the first element of the list if the variable is empty."},"answer": "C"},

{ "question": "A developer needs to create a baseline set of data (Accounts, Contacts, Products, Assets) for an entire suite of testallowing them to test independent requirements various types of Salesforce Cases.Which approach can efficiently generate the required data for each unit test?","type": "single","options" : {"A": "Create a nock using the Stud API","B": "Create test data before Test.startTest() in the unittest.","C": "Add @isTest(seeAllData=true) at the start of the unit test class.","D": " Use @TestSetup with a viod method."},"answer": "D"},

{ "question": "What is the order of operations when a record is saved in Salesforce?","type": "single","options" : {"A": "Workflow, process flows, triggers, commit","B": "Workflow, triggers, process flows, commit","C": "Triggers, workflow, process flows, commit","D": "Process flows, triggers, workflow, commit"},"answer": "C"},

{ "question": "What is the preferred way to reference web content such as images, stylesheets, JavaScript, and other libraries that is used in Visualforce pages?","type": "single","options" : {"A": "Uploading the content as a Static Resource","B": "Accessing the content from a third-party CDN","C": "Uploading the content in the Documents tab","D": "Accessing the content from Chatter Files"},"answer": "A"},

{ "question": "What is the result when a Visualforce page calls an Apex controller, which in turn calls another Apex class, causing the code to hit a Governor Limit?","type": "single","options" : {"A": "All changes up to the error are saved","B": "All changes before a save point are saved","C": "All changes are saved in the first Apex class","D": "All changes up to the error are rolled back."},"answer": "D"},

{ "question": "In a single record, a user selects multiple values from a multi-select pick list. How are the selected values represented in Apex?","type": "single","options" : {"A": "As a String with each value separated by a comma","B": "As a Set<String> with each value as an element in the set","C": "As a List<String> with each value as an element in the list","D": "As a String with each value separated by a semicolon"},"answer": "D"},

{ "question": "A developer runs the following anonymous code block: List<Account> acc = [SELECT Id FROM Account LIMIT 10;]; Delete acc; Database.emptyRecycleBin(acc); system.debug(Limits.getDMLStatements() + ', '+Limits.getLimitsDMLStatements()); What is the result?","type": "single","options" : {"A": "2150","B": "150,2","C": "11150","D": "150,11"},"answer": "A"},

{ "question": "A developer needs to automatically populate the Reports To field in a contact record based on the values of the related Account and Department fields in the contact record. Which two trigger types should the developer create? (Select two answers.)","type": "multi","options" : {"A": " before update","B": "after update","C": " before insert","D": "after insert"},"answer": "A,C"},

{ "question": "Which of the following statements about the IF-ELSE statement are true?Choose 2 answers.","type": "multi","options" : {"A": "An IF-ELSE statement permits a choice to be made between two possible execution paths.","B": "An IF statement can be followed by a discretionary ELSE statement, which executes when the Boolean expression is false.","C": "An IF-ELSE statement provides a secondary path of execution when an IF clause evaluates to true.","D": "An IF-ELSE statement can have any number of possible execution paths."},"answer": "A,B"},

{ "question": "Which of the following statements related to Apex best practices about avoiding SOQL queries inside For Loops are true?Choose 3 answers.","type": "multi","options" : {"A": "By moving queries outside of for loops, the code will run faster, and is less likely to exceed governor limits.","B": "When queries are placed inside a for loop, a query is executed on each iteration and the governor limit is easily exceeded.","C": "The following code is an example of improper SOQL limit utilization: for (Account a : [SELECT Id, Name From Account Limit 1000]) { //code_block }","D": " If a developer needs to query, query once, retrieve all the necessary data in a single query, then iterate over the results.","E": " If a developer needs to query, query once, retrieve all the necessary data in a single query, then iterate over the results."},"answer": "A,B,D"},

{ "question": "What are valid use cases for using a controller extension in a Visualforce page?Choose 2 answers.","type": "multi","options" : {"A": " To override the edit action of a standard controller","B": "To add a new action in the Visualforce page","C": "To replace the standard controller entirely","D": "To set any page to always run in system mode"},"answer": "A,B"},

{ "question": "Which of the following can be used to update existing standard and custom fields on child records automatically when a parent record is modified?Choose 3 answers.","type": "multi","options" : {"A": "Process Builder","B": "workflow Rules","C": "Apex triggers","D": "formula field","E": "formula field"},"answer": "A,C,E"},

{ "question": "Global Containers requires that when saving an opportunity record, a check is performed to determine if the opportunity amount is the highest value in the current year for all opportunities in the org. If so, a checkbox on the opportunity record should be marked and an email should be sent to the record owner's manager. What Salesforce feature should be recommended to handle this requirement?Choose 1 answer.","type": "single","options" : {"A": "Flow Builder","B": "workflow Rules","C": "Formula field","D": "Apex trigger"},"answer": "A"},

{ "question": "Which of the files below can the $ContentAsset global value provider reference?Choose 3 answers.","type": "multi","options" : {"A": "images","B": "CSS files","C": "Javascript files","D": "HTML files","E": "HTML files"},"answer": "A,B,C"},

{ "question": "Cosmic Solutions is using Salesforce Connect to allow Salesforce users of the company to view orders that exist in an external order management system. Each order record has a unique record identifier in the external system which is visible in Salesforce via Salesforce Connect. Salesforce is used to create shipment records. Since each order can be associated with one or more shipments, the sales director of the company would like to allow users to choose an order while creating a shipment record in Salesforce. Which of the following should a developer define on the 'Shipment__c' object for this use case?Choose 1 answer.","type": "single","options" : {"A": "External Lookup Relationship Field","B": "Indirect Lookup Relationship Field","C": "Lookup Relationship Field","D": "Master-Detail Relationship Field"},"answer": "A"},

{ "question": "Since Aura application events follow the traditional publish-subscribe model, which method is used to fire an event?","type": "single","options" : {"A": "ernit()","B": "registerEvent()","C": "fireEvent()","D": "fire()"},"answer": "D"},

{ "question": "A developer created a Visualforce page and custom controller to display the account type field as shown below. Custom controller code: public class customCtrlr{ private Account theAccount; public String actType; public customCtrlr() { theAccount = [SELECT Id, Type FROM Account WHERE Id = :apexPages.currentPage().getParameters().get('id')]; actType = theAccount.Type; } } Visualforce page snippet: The Account Type is {!actType} The value of the account type field is not being displayed correctly on the page. Assuming the custom controller is property referenced on the Visualforce page, what should the developer do to correct the problem?","type": "single","options" : {"A": "Change theAccount attribute to public.","B": "Convert theAccount.Type to a String.","C": "Add with sharing to the custom controller.","D": "Add a getter method for the actType attribute."},"answer": "D"},

{ "question": "For which three items can a trace flag be configured?Choose 3 answers","type": "multi","options" : {"A": "Process Builder","B": "User","C": "Apex class","D": "Apex trigger","E": "Apex trigger"},"answer": "B,C,D"},

{ "question": "A developer must provide a custom user interface when users edit a Contact. Users must be able to use the interface in Salesforce Classic and Lightning Experience.What should the developer do to provide the custom user interface?","type": "single","options" : {"A": "Override the Contact's Edit button with a Lightning component in Salesforce Classic and a Lightning component in Lightning Experience.","B": "Override the Contact's Edit button with a Visualforce page in Salesforce Classic and a Lightning component in Lightning Experience.","C": "Override the Contact's Edit button with a Lightning page in Salesforce Classic and a Visualforce page in Lightning Experience.","D": "Override the Contact's Edit button with a Visualforce page in Salesforce Classic and a Lightning page inLightning Experience."},"answer": "B"},

{ "question": "Universal Containers has large number of custom applications that were built using a third-party javaScript framework and exposed using Visualforce pages. The Company wants to update these applications to apply styling that resembles the look and feel of Lightning Experience. What should the developer do to fulfill the business request in the quickest and most effective manner?","type": "single","options" : {"A": "Incorporate the Salesforce Lightning Design System CSS stylesheet into the JavaScript applications.","B": "Enable Available for Lightning Experience, Lightning Communities, and the mobile app on Visualforce pages used by the custom application.","C": "Rewrite all Visualforce pages asLightning components.","D": "Set the attribute enableLightning to true in the definition."},"answer": "D"},

{ "question": "A customer wants to add a custom validation to the ''contact save'' process. Before a contact is created, the customer wants to include the validation, which checks if the associated account is active. This validation should be active for all UI as well as integration requests. Which design accomplishes this goal?","type": "single","options" : {"A": "A custom Web service","B": "A ''before insert'' Trigger","C": "A custom Visualforce controller","D": "A client-side S-control"},"answer": "B"},


//Himanshi

{ "question": "Given the following trigger implementation:trigger leadTrigger on Lead (before update){final ID BUSINESS_RECORDTYPEID = '012500000009Qad';for(Lead thisLead : Trigger.new){if(thisLead.Company != null && thisLead.RecordTypeId != BUSINESS_RECORDTYPEID){ thisLead.RecordTypeId = BUSINESS_RECORDTYPEID;}}}The developer receives deployment errors every time a deployment is attempted from Sandbox to Production.What should the developer do to ensure a successful deployment?","type": "single","options" : {"A": "Ensure BUSINESS_RECORDTYPEID is retrieved using Schema.Describe calls.","B": "Ensure a record type with an ID of BUSINESS_RECORDTYPEID exists on Production prior to deployment.","C": "Ensure BUSINESS_RECORDTYPEID is pushed as part of the deployment components.","D": "Ensure a record type with an ID of BUSINESS_RECORDTYPEID exists on Production prior to deployment."},"answer": "C"},

{ "question": "Which three statements are true regarding custom exceptions in Apex? (Choose three.)","type": "multi","options" : {"A": "A custom exception class name must end with ''Exception''.","B": "A custom exception class cannot contain member variables or methods.","C": "A custom exception class must extend the system Exception class.","D": "A custom exception class can implement one or many interfaces.","E": "A custom exception class can implement one or many interfaces."},"answer": "A,D,E"},

{ "question": "The sales management team at Universal Containers requires that the Lead Source field of the Lead record be populated when a Lead is converted. What should be used to ensure that a user populates the Lead Source field prior to converting a Lead?","type": "single","options" : {"A": "A. Process Builder","B": "B. workflow Rule","C": "C. Validation Rule","D": "D. Formula Field"},"answer": "C"},

{ "question": "Which standard field is required when creating a new contact record?","type": "single","options" : {"A": "A. FirstName","B": "B. Name","C": "C. LastName","D": "D. AccountId"},"answer": "C"},

{ "question": "Which process automation should be used to send an outbound message without using Apex code?","type": "single","options" : {"A": "Workflow Rule","B": "Process Builder","C": "Approval Process","D": "Flow Builder"},"answer": "A"},

{ "question": "What is true of a partial sandbox that is not true of a full sandbox?","type": "multi","options" : {"A": "More frequent refreshes.","B": "Only includes necessary metadata","C": "Use of change sets","D": "Limited to 5 GB of data."},"answer": "A,D"},

{ "question": "In which order does Salesforce execute events upon saving a record?","type": "single","options" : {"A": "Before Triggers; Validation Rules; After Triggers; Assignment Rules; Workflow Rules; Commit","B": "Validation Rules; Before Triggers; After Triggers; Workflow Rules; Assignment Rules; Commit","C": "Before Triggers; Validation Rules; After Triggers; Workflow Rules; Assignment Rules; Commit","D": "Validation Rules; Before Triggers; After Triggers; Assignment Rules; Workflow Rules; Commit"},"answer": "D"},

{ "question": "In which two trigger types can a developer modify the new sObject records that are obtained by the trigger.new context? Choose 2 answers","type": "multi","options" : {"A": "Before insert","B": "Before update","C": "After update","D": "After insert"},"answer": "A,B"},

{ "question": " How can a developer avoid exceeding governor limits when using Apex Triggers? (Choose 2)","type": "multi","options" : {"A": "By using Maps to hold data from query results","B": "By using the Database class to handle DML transactions","C": "By performing DML transactions on a list of sObjects.","D": "By using a helper class that can be invoked from multiple triggers"},"answer": "A,C"},

{ "question": "Opportunity opp=[select id ,stagename from opportunity limit 1] Given the code above, how can a developer get the label for the stagename field?","type": "single","options" : {"A": "Call''opp.stagename.label''","B": "Call''opp.stagename.getdescribe().getlabel()''","C": "Call ''opportunity.stagename.label''","D": "Call''opportunity.stagename.getdescribe().getlabel()''"},"answer": "D"},

{ "question": "what is considered the primary purpose for creating Apex tests?","type": "single","options" : {"A": "To guarantee at least 50% of code is covered by unit tests before it is deployed","B": "To confirm every trigger in executed at least once","C": "To confirm all classes and triggers compile successfully","D": "To ensure every use case of the application is covered by a test"},"answer": "D"},

{ "question": "An Account trigger updates all related Contacts and Cases each time an Account is saved using the following two DML statements:","type": "single","options" : {"A": "The Account save succeeds, Contacts are updated, but Cases are not.","B": "The Account save is retried using a smaller trigger batch size.","C": "The Account save succeeds and no Contacts or Cases are updated","D": "The Account save fails and no Contacts or Cases are updated"},"answer": "D"},

{ "question": "Assignment rules allow Leads and Cases to be automatically assigned to users and queues based on criteria defined by the system administrator.","type": "single","options" : {"A": "True","B": "False","C": "","D": ""},"answer": "A"},

{ "question": "If you can solve a business need using either a workflow or a trigger, which should you use?","type": "single","options" : {"A": "Workflow","B": "Trigger","C": "Process Builder","D": "Flow"},"answer": "A"},

{ "question": "Which three steps allow a custom SVG to be included in a Lightning web component? Choose 3 answers","type": "multi","options" : {"A": "Upload the SVG as a static resource.","B": "Import the static resource and provide a getter for it in JavaScript.","C": "Reference the getter in the HTML template.","D": "Reference the import in the HTML template.","E": "Reference the import in the HTML template."},"answer": "A,B,C"},

{ "question": "A developer uses a loop to check each Contact in a list. When a Contact with the Title of “Boss” is found, the Apex method should jump to the first line of code outside of the for loop. Which Apex solution will let the developer implement this requirement?","type": "single","options" : {"A": "break;","B": "Continue","C": " Next","D": "Exit"},"answer": "A"},

{ "question": "The values 'High', 'Medium', and 'Low' are Identified as common values for multiple picklist across different object. What is an approach a developer can take to streamline maintenance of the picklist and their values, while also restricting the values to the ones mentioned above?","type": "single","options" : {"A": "Create the Picklist on each object and use a Global Picklist Value Set containing the Values.","B": "Create the Picklist on each object as a required field and select ''Display values alphabeticaly, not in the order entered''.","C": "Create the Picklist on each object and select ''Restrict picklist to the values defined in the value set''.","D": "Create the Picklist on each and add a validation rule to ensure data integrity."},"answer": "A"},

{ "question": "What does the context variable Trigger.old represent in an update operation?","type": "single","options" : {"A": "The previous version values of the records firing the trigger","B": "The current values of the records firing the trigger","C": "A map of IDs to the old version of the record","D": "The same values of Trigger.new"},"answer": "A"},

{ "question": "Which code displays the content of Visualforce page as PDF?","type": "single","options" : {"A": "&lt;apex:page contentype '' application/pdf'')","B": "&lt;apex:page readeras'' application/pdf''&gt;","C": " &lt;apex:page readerAs= ''application/pdf''&gt;","D": "&lt;apex:page renderAs=''pdf''&gt;"},"answer": "D"},

{ "question": "The __________ function prints the value of variable so that we can use this to debug or to get to know what value the variable holds currently.","type": "single","options" : {"A": "System()","B": "debug()","C": "System.debug()","D": "System.identify()"},"answer": "C"},

{ "question": "How to associate a standard List controller with visualforce page?","type": "single","options" : {"A": "&lt;apex:page standardController=”Account”&gt;","B": "&lt;apex:page standardController=”Account” recordSetVar=”accounts”&gt;","C": "&lt;apex:page controller=”Account” &gt;","D": "&lt;apex:page Controller=”MYControllerName” extensions=”Class1, Class2,..”&gt;"},"answer": "B"},

{ "question": "Which of the following is related to View layer in MVC Model ?","type": "single","options" : {"A": " Workflow Rules","B": "Validation Rules","C": "Visual force Pages","D": "Custom Objects","E": "Custom Objects"},"answer": "C"},

{ "question": "What are two ways for a developer to execute tests in an org?","type": "multi","options" : {"A": "Tooling API","B": "Bulk API","C": "Developer console","D": "Matadata API"},"answer": "A,C"},

{ "question": "What is the value of the Trigger.old context variable in a Before Insert trigger?","type": "single","options" : {"A": "An empty list of sObjects","B": "null","C": "A list of newly created sObjects without IDS","D": "Undefined"},"answer": "B"},

{ "question": "A developer is creating a test coverage for a class and needs to insert record to validate funtionality.which method annotations should be used to create records for every method in the test class?","type": "single","options" : {"A": "@BeforeTest","B": "isTest(SeeAllData=True)","C": "@TestSetup","D": "@PreTest"},"answer": "C"},

{ "question": "What type of error handling are there?","type": "single","options" : {"A": "Only SOAP errors","B": "Undefined fault errors","C": "API - returned SOAP fault message and general API errors","D": "JUST API errors"},"answer": "C"},

{ "question": "what are the three languages used in the visualforce page?","type": "single","options" : {"A": "Javascript, CSS, HTML","B": "C++, CSS, query","C": "Apex, Json, SQL","D": "C++,Json,query"},"answer": "A"},

{ "question": "Which exception type cannot be caught?","type": "single","options" : {"A": "NoAccessException","B": "CalloutException","C": "Custom Exception","D": "LimitException"},"answer": "D"},

{ "question": "A developer needs to create a baseline set of data (Accounts, Contacts, Products, Assets) for an entire suite of test allowing them to test independent requirements various types of Salesforce Cases.Which approach can efficiently generate the required data for each unit test?","type": "single","options" : {"A": "Create a nock using the Stud API","B": "Create test data before Test.startTest() in the unit test.","C": "Use @TestSetup with a viod method.","D": "Add @isTest(seeAllData=true) at the start of the unit test class."},"answer": "C"},

{ "question": "What can used to delete components from production?","type": "single","options" : {"A": "A change set deployment with a destructivechanges XML file","B": "An ant migration tool deployment with a destructivechanges XML file and an empty package .xml file","C": "A change set deployment with the delete option checked","D": "An ant migration tool deployment with destructivechanges xml file and the components to delete in the package .xml file"},"answer": "B"},

{ "question": "A developer is asked to create a Visualforce page that displays some Account fields as well as fields configured on the page layout for related Contacts.How should the developer implement this request?","type": "single","options" : {"A": "Add a method to the standard controller","B": "Use the &lt;apex:include&gt; tag.","C": "Create a controller extension.","D": "Use the &lt;apex:relatedList&gt; tag."},"answer": "A"},

{ "question": "Universal Containers stores the availability date on each Line Item of an Order and Orders are only shipped when all of the Line Items are available. Which method should be used to calculate the estimated ship date for an Order?","type": "single","options" : {"A": "Use a DAYS formula on each of the availability date fields and a COUNT Roll-Up Summary field on the Order.","B": "Use a LATEST formula on each of the latest availability date fields.","C": "Use a Max Roll-Up Summary field on the Latest availability date fields.","D": "Use a CEILING formula on each of the Latest availability date fields"},"answer": "C"},

{ "question": "Universal Containers stores Orders and Line Items in Salesforce. For security reason, financial representatives are allowed to see information on the Order such as order amount, but they are not allowed to see the Line items on the Order. Which type of relationship should be used?","type": "single","options" : {"A": " Indirect lookup","B": "Direct Lookup","C": "Master Detail","D": " Lookup"},"answer": "C"},

{ "question": "A developer has a Visualforce page and custom controller to save Account records. The developer wants to display any validation rule violation to the user. How can the developer make sure that validation rule violations are displayed?","type": "single","options" : {"A": "Perform the DML using the Database.upsert() method","B": "Use a try/catch with a custom exception class.","C": "Include &lt;apex:message&gt; on the Visualforce page.","D": " Add cuatom controller attributes to display the message."},"answer": "C"},

{ "question": "Cloudy Computing are busy refining their support processes using Service Cloud. They have enabled Email-to-Case (yay!) but would also like the customer to receive email confirmation that their query has been received when submitting via Email-to-Case. What feature will meet this requirement?","type": "single","options" : {"A": "Process Builder","B": "Auto-Response rule","C": "Case-Response Rule","D": "Email-to-Case"},"answer": "B"},

{ "question": "When an Opportunity is closed won, an Order record should automatically be created. As the Administrator, what solution should you recommend?","type": "single","options" : {"A": "Tick ‘Create Order’ on the opportunity record","B": "Create an order record using Process Builder","C": " Create an Order record using Workflow","D": "Create an Order record using APEX"},"answer": "B"},

{ "question": "Given below is the Apex Statement : Account myAccount = [SELECT Id, Name FROM Account]; What occurs when more than one Account is returned by the SOQL query?","type": "single","options" : {"A": "The variable, myAccount, is automatically cast to the List data type.","B": "An unhandled exception is thrown and the code terminates.","C": "The first Account returned is assigned to myAccount.","D": " The query fails and an error is written to the debug log."},"answer": "B"},

{ "question": "A developer wants to import 500 Opportunity records into a sandbox. Why should the developer choose to use data Loader instead of Data Import Wizard?","type": "single","options" : {"A": "Data Loader automatically relates Opportunities to Accounts.","B": "Data Import Wizard can not import all 500 records.","C": "Data Loader runs from the developer's browser.","D": "Data Import Wizard does not support Opportunities."},"answer": "D"},

{ "question": "How should a developer write unit tests for a private method in an Apex class?","type": "single","options" : {"A": "Mark the Apex class as global.","B": "Use the SeeAllData annotation.","C": "Add a test method in the Apex class.","D": "Use the TestVisible annotation."},"answer": "D"},

{ "question": "A developer is debugging the following code to determinate why Accounts are not being created Account a = new Account(Name = 'A'); Database.insert(a, false); How should the code be altered to help debug the issue?","type": "single","options" : {"A": "Add a System.debug() statement before the insert method","B": "Set the second insert method parameter to TRUE","C": "Collect the insert method return value a Saveresult record","D": "Add a try/catch around the insert method"},"answer": "C"},

{ "question": "Which resources can be included in a Lightning Component bundle?","type": "multi","options" : {"A": "Apex Class","B": "Adobe Flash","C": "JavaScript","D": "Documentation"},"answer": "C,D"},

{ "question": "On a visualforce page with a custom controller, how should a developer retrieve a record by using ID parameter that is passed on the URL?","type": "single","options" : {"A": "Use the constructor method for the controller.","B": "Use the $Action.View method in the visualforce page.","C": "Create a new PageReference object with the Id.","D": " Use the &lt;apex:detail&gt; tag in the visualforce page"},"answer": "D"},

{ "question": "Why would a developer use Test.startTest() and Test.stopTest()?","type": "single","options" : {"A": "To avoid Apex code coverage requirements for the code between lines.","B": "To start and stop anonymous block execution when executing anonymous Apex code.","C": "To indicate test code so that it does not impact Apex line count governor limits","D": "To create additional set of governor limits during the execution of single test class."},"answer": "D"},

{ "question": "A developer has following trigger that fires after insert and creates a child Case whenever a new case is created. List&lt;Case&gt; childCases = new List&lt;Case&gt;(); Case child = new Case (ParentId = parent.Id; Subject = parent.Subject);for ( Case parent : Trigger.new ){Case child = new Case (ParentId = parent.Id; Subject = parent.Subject); childCases.add(child);} Insert ChildCases; What happens after the block of code executes","type": "single","options" : {"A": "Multiple child cases are created for each parent case in trigger.new","B": " A child case is created for each parent case in trigger.new","C": "The trigger enters in the infinite loop and eventually fails.","D": "The trigger fails if the Subject field on the parent is blank."},"answer": "C"},

{ "question": "An SObject named Application__c has a lookup relationship to another SObject named Position__c. Both Application__c and Position__c have a picklist named Status__c. When the Status__c field on Position__c is updated, the Status__c field on Application__c needs to be populated automatically with the same value, and execute a workflow rule on Application__c. How can a developer accomplish this?","type": "single","options" : {"A": "By changing Application__c.Status__c into roll-up summary field.","B": "By changing Application__c.Status__c into a formula field.","C": "By using an Apex trigger with a DML operation","D": "By configuring a cross object field update with a workflow."},"answer": "B"},

{ "question": "Which standard field needs to be populated when a developer inserts new Contact record programmatically?","type": "single","options" : {"A": "AccountId","B": "Name","C": "LastName","D": "FirstName"},"answer": "C"},

{ "question": "A developer writes a trigger on the Account object on the before update event that increments a count field. A workflow rule also increments the count field every time that an Account is created or updated.The field update in the workflow rule is configured to not re-evaluate workflow rules. What is the value of the count field if an Account is inserted with an initial value of zero, assuming no other automation logic is implemented on the Account?","type": "single","options" : {"A": "2","B": "1","C": "4","D": "3"},"answer": "A"},

{ "question": "When a user edits the Postal Code on an Account, a custom account text field named ''Timezone'' must be updated based on the values in a PostalCodeToTimeZone__c custom object. 		How can a developer implement this feature?																																							","type": "single","options" : {"A": "Build an Account Approval Process.","B": "Build a Workflow Rule.","C": "Build an Account Assignment Rule.","D": "Build a Flow with Flow Builder."},"answer": "D"},

{ "question": "What is the result of the following code snippet?public void dowork(Account acct){    for (Integer i=0; i &lt;= 200; i++){        insert acct;    }}","type": "single","options" : {"A": "201 Accounts are inserted.","B": "200 Accounts are inserted.","C": "0 Accounts are inserted.","D": "1 Account is inserted"},"answer": "C"},

{ "question": " How does the lightning component framework help developers implement solutions faster?","type": "single","options" : {"A": " By providing device- awareness for mobile and desktops","B": "By providing code review standards and processes.","C": "By providing an agile process with default steps.","D": "By providing change history and version control."},"answer": "A"},

{ "question": " How can a developer check the test coverage of active Process Builder and flows before deploying them in a Changeset?","type": "single","options" : {"A": "Use SOQL and the Tooling API.","B": "Use the code coverage setup page","C": "Use the Flow Properties page.","D": "Use the Apex Test Result class"},"answer": "A"},

{ "question": "How can a developer avoid exceeding governor limits when using Apex Triggers? (Choose 2)","type": "multi","options" : {"A": "By using Maps to hold data from query results","B": "By using the Database class to handle DML transactions","C": "By performing DML transactions on a list of sObjects.","D": " By using a helper class that can be invoked from multiple triggers"},"answer": "A,C"},




]
