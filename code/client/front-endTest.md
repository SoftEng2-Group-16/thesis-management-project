# Manual Testing FE

## ProposalForm Component

The `ProposalForm` component is designed to allow professors to create new thesis proposals. It provides two modes: **INSERT MODE** for creating new proposals from scratch and **EDIT MODE** for modifying existing proposals.

## Prerequisites

- Access to the application with the `ProposalForm` component.
- Valid user credentials with professor privileges.


## Test Scenario 1: Successful Submission

**Input:**
- Access the `ProposalForm` component in INSERT MODE.
- Enter valid data for all required fields.
- Click the "Submit" button.

**Expected Results:**
- The form should validate the input and detect no errors.
- A success message should be displayed, indicating that the proposal was submitted successfully.
- The form should reset, and all fields should be cleared.

## Test Scenario 2: Submission with Validation Errors

**Input:**
- Access the `ProposalForm` component in INSERT MODE.
- Leave one or more required fields empty or provide invalid data.
- Click the "Submit" button.

**Expected Results:**
- The form should detect the validation errors in the input.
- Appropriate error messages should be displayed next to the relevant fields.
- No success message should be displayed.
- The form should not reset, and the entered data (excluding the invalid fields) should remain.



# ThesisProposalsBro
  **Description**: Test1: checking if the filter for title functions.
- **Before**: The user needs to be logged in
- **Actions**:
  - I go to `/thesis` Route
  - I write "sustainable" and then click on the only suggestion (`Sustainable Energy Sources Research`).
  - I click on `Smart Cities Urban Planning` to add it as a parameter.
  - I click on the Searcch button.
  - The only thesis that appear are `Sustainable Energy Sources Research` and `Smart Cities Urban Planning`.
  - I remove `Smart Cities Urban Planning` as a parameter bi clicking on the X next to it.
  - The only thesis that appear is `Sustainable Energy Sources Research`.
- **Result**: The filter worked properly


# ThesisApplications

The `ThesisApplicationsBro` component is responsible for rendering a table of thesis applications based on the user's role. It dynamically fetches and displays applications for teachers and students, and provides a fallback message if no applications are available.

## Scenario 1: Teacher Role - Applications Available

**Test Steps:**
1. Log in as a user with a teacher role.
2. Navigate to the Thesis Applications page.

**Expected Result:**
- The component should render a table with columns: StudentID, Student, Thesis, Type, Date, and Status.
- If applications are available, they should be listed in the table.

## Scenario 2: Student Role - No Applications Available

**Test Steps:**
1. Log in as a user with a student role.
2. Navigate to the Thesis Applications page.

**Expected Result:**
- The component should render a table with columns: Teacher, Thesis, Type, Date, and Status.
- The component should display a message indicating that there are no applications available for students.


  