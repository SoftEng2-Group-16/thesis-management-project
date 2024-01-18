TEMPLATE FOR RETROSPECTIVE (Team 16)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)
- [license](#license)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done - `4` vs `4`
- Total points committed vs done - `14` vs `14`
- Nr of hours planned vs spent (as a team) - `96h15m` vs `95h 50m`

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed: 

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   16      |    -   |     52h45m       |        48h20m      |
| _#13_   |    8     |    5   |      18h30m      |       21h15m       |
| _#14_   |      4   |    2   |       6h30m     |        6h      |
| _#15_   |    4     |     2  |       5h30m     |    5h40m          |
| _#26_   |     5    |    5   |       13h     |       14h35m       |


> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation): average est. `2h 36m` vs spent `2h35m`, standard deviation est. `2h` vs spent `1h 54m`
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1: `0,004347826`

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated - `7h30m` 
  - Total hours spent - `8h20m`
  - Nr of automated unit test cases - `76`
  - Coverage (if available) - `88.8%`
- E2E testing:
  - Total hours estimated - `13h30m`
  - Total hours spent - `12h30m`
- Code review 
  - Total hours estimated - `6h30m`
  - Total hours spent - `6h55m`
- Technical Debt management:
  - Total hours estimated- `45m`
  - Total hours spent- `45m`
  - Hours estimated for remediation by SonarQube: `43m`
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: `43m` 
  - Hours spent on remediation: `45m` 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): `0.2%`
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): `Reliability`: `A`, `Security`: `A`, `Mantainability`: `A`
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - We needed less time than expected to complete all the e2e testing, but we spent more time than planned dealing with the general frontend appearence and some minor bugs.
- What lessons did you learn (both positive and negative) in this sprint?
  - **Positive**: during the holidays we were quite far away from each other, and also had to deal with different projects and strict deadlines, but through proper organization and by sticking to the Scrum process we were able to succesfully deliver all the features we committed to .
  - **Negative**: we didn't find an efficient method to show the automatic proposal expiration, so that part of the presentation was a bit slow and confusing even if the functionality was present and working.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - We checked more carefully all the requirements from the PO and the FAQ document, avoiding last minute surprises or wrong behaviour of the app.
  - We finished the development phase earlier, and we were able to concentrate only on tests and bug fixing during the last days of the sprint.
  
- Which ones you were not able to achieve? Why?
  - None

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  > Propose one or two
  - Since we gained skills with the workflow and more confidence, potentially we might commit to more story points.
  - We should find a way to better show the automatic expiration and archiviation of a proposal (there won't be another demo, but we still need to produce the demo video).

- One thing you are proud of as a Team!!
  - Our presentations were (almost) always well prepared, and the work organization became more and more efficient during the sprints.


  ## LICENSE
  **Chosen license**: `MIT`

  It's a very permissive license and encourages the freedom to use and modify our software.  Since it provides significant flexibility to both users and us developers, tt is often used for projects like this one.

  Why we chose it:
  1. It allows basically everyone to use our software product, including commercial or private uses, and also to use it under a different license (probably Polito IT staff will want to do that if they decide to use our code).
  2. It frees us of responsability or liability if less careful users use our software as it is now without checking it, and consequently receive damage from it.

