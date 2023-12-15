TEMPLATE FOR RETROSPECTIVE (Team 16)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done - `5` vs `5`
- Total points committed vs done - `17` vs `17`
- Nr of hours planned vs spent (as a team) - `95h` vs `95h 5m`

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    15     |    -   |     54h30m       |       46h50m       |
| _#8_   |    5     |    2   |      9h15m      |       12h50m       |
| _#9_   |    3     |    8   |      10h30m      |       7h45m       |
| _#10_   |    5     |    2   |       6h45m     |       9h35m       |
| _#11_   |    4     |    2   |      5h      |      3h35m        |
| _#12_   |    5     |    3   |      9h      |       14h30m       |


> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation): average est. `2h34m` - spent `2h34m`; standard deviation est. `2h52m` - spent `2h14m`
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1: `-0,001`

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated - `3h` 
  - Total hours spent - `4h15m`
  - Nr of automated unit test cases - `56`
  - Coverage (if available) - `88%`
- E2E testing:
  - Total hours estimated - `11h`
  - Total hours spent - `7h45m`
- Code review 
  - Total hours estimated - `3h`
  - Total hours spent - `3h10m`
- Technical Debt management:
  - Total hours estimated- `3h`
  - Total hours spent- `3h20m`
  - Hours estimated for remediation by SonarQube: `32m`
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: `32m` 
  - Hours spent on remediation: `45m` 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): `0,5%`
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): `maintainability`
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - The appearance of bugs and the time we spent fixing them, that we weren't expecting when developing the user stories made us under estimate some tasks.
- What lessons did you learn (both positive and negative) in this sprint?
  - **Positive**: by preparing useful data beforehand, we are able to arrive at the demo with a clearer presentation and it's easier to present.
  - **Negative**: using unfamiliar devices during the presentation can be unproductive and slow a bit the person who's presenting.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - We achieved both improvements goal we set during last retrospective (responsiveness and general look of the application).
  
- Which ones you were not able to achieve? Why?
  - None

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  > Propose one or two
  - Anticipate the development phase, in order to have all the functionalities ready to be tested at least 3 days before demo (so we have more time to fix eventual bugs)
  - Be sure to check all the requirements from the PO, both from the FAQ file and the Telegram channel

- One thing you are proud of as a Team!!
  - We are always able to deliver the stories we commit to, and we adapt quite quickly to unexpected issues inside the team.