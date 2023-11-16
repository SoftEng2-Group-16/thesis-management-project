TEMPLATE FOR RETROSPECTIVE (Team 16)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done - `3` vs `3`
- Total points committed vs. done - `10` vs `10`
- Nr of hours planned vs. spent (as a team) - `72h30m` vs `96h15m`

**Remember**a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    15   |      |      48h30m      |      60h        |
| _#1_   |    5    |    3   |      8h      |    14h25m          |
| _#2_   |    5   |     5   |       9h    |        16h55m      |
| _#3_   |    4     |   2     |      7h      |      4h55m        |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average;: `2h25m` vs `3h12m`, standard deviation: `2.48` vs `3.07` (estimate and actual)
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1: `-0,247`

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: `5h`
  - Total hours spent: `5h`
  - Nr of automated unit test cases: `9`
  - Coverage (if available): not available
- E2E testing:
  - Total hours estimated: `2h30m`
  - Total hours spent: `1h`
- Code review 
  - Total hours estimated: `3h30m`
  - Total hours spent: `3h30m`
  

## ASSESSMENT

- What caused your errors in estimation (if any)?
  - Low familiarity with testing environment and procedures
  - Bugs that took quite a bit to solve

- What lessons did you learn (both positive and negative) in this sprint?
  - Positive: by improving collaboration, we were able to deliver a much better app
  - Negative: testing should be carried out much closer to the development phase (at least unit tesing)


- Which improvement goals set in the previous retrospective were you able to achieve?
  - Better management of the project: branches, code reviews and PRs
  - Better presentation
  - Improved communication between teammates
  
- Which ones you were not able to achieve? Why?
  - We didn't improve much our estimation phase, we underestimated quite a bit the effort each task needed (we also had a minor problem with the YouTrack reports for time management)

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > Propose one or two
  - Improve our testing phase, by focusing more on integration and e2e tests and studying the technologies required
  - Improve presentation by preparing a template with real data to use while showing features to the stakeholders (like meaningful thesis proposals, to use for inserting in a form)

- One thing you are proud of as a Team!!
  - We received compliments by the stakeholders about how easy-to-use and understandable our application was.
