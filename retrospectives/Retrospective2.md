TEMPLATE FOR RETROSPECTIVE (Team 16)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done - `4` vs `4`
- Total points committed vs. done - `7` vs `7`
- Nr of hours planned vs. spent (as a team) - `94h50m` vs `99h50m`

**Remember**: a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    12   |        |       51h20m      |      54h       |
| _#4_   |    6     |   2    |     13h30m       |    11h45m          |
| _#5_  |    5     |    1   |       9h30m     |      11h        |
| _#6_  |    5     |    2   |       10h     |      10h       |
| _#7_  |    5     |    2   |       10h30m     |      13h30m        |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)  `2h34m`  vs `2h42m`, standard deviation: `2h01m ` vs `2h15m`
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1: `-0.05` 
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: `10h30m` 
  - Total hours spent: `6h30m`
  - Nr of automated unit test cases: `39`
  - Coverage (if available): `95.9%`
- E2E testing:
  - Total hours estimated: `4h`
  - Total hours spent: `6h`
- Code review 
  - Total hours estimated: `6h`
  - Total hours spent: `4h55m`

*Note: the coverage of unit tests is taken from SonarCloud analysis.*
## ASSESSMENT

- What caused your errors in estimation (if any)?  
  - Underestimation of the new functionalities of the virtual clock (managing the applications linked to the proposals when they expire), and also of a few frontend related tasks.

- What lessons did you learn (both positive and negative) in this sprint? 
  - Positive: by adding automated E2E testing, we were able to control better and speed up our testing phase when changing small details (surely quicker than manual testing).
  - Negative: we need to merge the different branches onto the reference branch (dev) sooner, so we can have more time to solve problems and focus more on style and appearance.

- Which improvement goals set in the previous retrospective were you able to achieve?
  - We implemented automated E2E testing.
  - We arrived to the presentation more prepared, we had some key points to follow and some pre-made data to use during the demo, so the presentation was smooth and easy to follow.
  
- Which ones you were not able to achieve? Why? 
  - We were able to achieve all the goals we set at the end of the previous sprint.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  > Propose one or two
  - Improve the overall style, keeping it simple but more appealing
  - Improve the responsiveness (we have a few components that aren't yet)

- One thing you are proud of as a Team!!
  - We did a great job in presenting the project, and communication between team members was clear and efficient.