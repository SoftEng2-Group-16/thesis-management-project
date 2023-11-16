# ProposalForm Component Manual Test

## Overview

The `ProposalForm` component is designed to allow professors to create new thesis proposals. It provides two modes: **INSERT MODE** for creating new proposals from scratch and **EDIT MODE** for modifying existing proposals.

## Prerequisites

- Access to the application with the `ProposalForm` component.
- Valid user credentials with professor privileges.

## Test Scenarios

### 1. INSERT MODE

#### Input

- Access the `ProposalForm` component.
- Ensure that the form fields are initially empty.

#### Actions

1. Enter a valid title for the proposal.
2. Select a supervisor from the provided options.
3. Choose internal cosupervisors, if any.
4. Choose external cosupervisors, if any.
5. Enter keywords for the proposal.
6. Enter the type of the proposal.
7. Provide a description for the proposal.
8. Specify requirements for the proposal.
9. Add any additional notes.
10. Select a level (bachelor or master).
11. If the level is master, choose the corresponding degree program (CDS).
12. Set a valid expiration date.
13. Click the "Submit" button.

#### Expected Results

- The form should validate the input.
- If any errors are present, appropriate error messages should be displayed.
- If the input is valid, a success message should be displayed, and the proposal should be submitted.
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

