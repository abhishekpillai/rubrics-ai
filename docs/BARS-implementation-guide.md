# Behaviorally Anchored Rating Scales (BARS): Implementation Guide

## What Are BARS?

**Behaviorally Anchored Rating Scales (BARS)** are evaluation tools that use specific behavioral examples to define different levels of performance. Instead of vague descriptors like "good" or "poor," BARS describe observable actions that represent each performance level.

## The Research Foundation

### Validity and Reliability

Research shows BARS offer significant psychometric advantages:

- **Higher predictive validity:** Better correlation with actual job performance
- **Greater reliability:** More consistent scoring across different interviewers (inter-rater reliability)
- **Reduced bias:** Less influenced by demographic characteristics or "halo effects"
- **Legal defensibility:** Observable behaviors are more defensible than subjective impressions

**Quote from research:**
> "Using behaviorally anchored rating scales tends to increase the reliability and predictive validity of structured interview scores and may decrease bias against protected groups."

### Why BARS Work Better Than Numeric Scales

**Traditional Numeric Scale Problems:**

```
Rate the candidate's problem-solving: 1 2 3 4 5
```

Issues:
- What does "3" mean? Different interviewers have different standards
- No clear definition of what to look for
- Heavy influence from subjective feelings
- Difficult to compare across interviewers

**BARS Solution:**

```
Rate the candidate's problem-solving:

[5] EXCELLENT: Broke down complex problem into components,
    identified root cause, proposed multiple solutions with
    tradeoffs clearly articulated

[4] GOOD: Identified problem correctly, proposed viable solution
    with some consideration of tradeoffs

[3] MIXED: Understood problem but solution had significant gaps
    or showed limited consideration of alternatives

[2] POOR: Struggled to identify core issue or proposed solution
    that wouldn't work due to missing key constraints

[1] VERY POOR: Could not demonstrate understanding of problem
    or generate any viable approach
```

Benefits:
- Clear behavioral standards
- Reduces subjectivity
- Enables comparison across candidates
- Easier to train interviewers

## BARS Structure

### The Four Levels

Research and practice have converged on **4-level BARS** as optimal:

| Level | Label | Purpose |
|-------|-------|---------|
| 4 | **EXCELLENT** | Exceeds job requirements; exceptional performance |
| 3 | **GOOD** | Meets job requirements solidly; competent performance |
| 2 | **MIXED** | Partially meets requirements; has gaps but shows potential |
| 1 | **POOR** | Does not meet requirements; significant deficiencies |

**Why 4 levels?**
- Enough granularity to differentiate candidates
- Not so many that interviewers struggle to distinguish
- Avoids "middle" option (forces decision: above or below bar)
- Maps well to hiring decisions (hire/maybe/no)

**Alternative: 5 levels**
Some organizations use:
- 5 = Excellent
- 4 = Good
- 3 = Acceptable/Mixed
- 2 = Poor
- 1 = Very Poor

Either works - key is behavioral anchors, not number of levels.

### Components of Each Level

Each performance level should include:

1. **Level descriptor:** Brief label (Poor, Mixed, Good, Excellent)
2. **Behavioral description:** What this performance looks like in 1-2 sentences
3. **Observable indicators:** 2-4 specific behaviors that exemplify this level
4. **Example responses:** (Optional but helpful) What a candidate might say at this level

## Development Process

### Method 1: Traditional BARS Development (Comprehensive)

This is the research-validated approach but requires significant time investment.

**Timeline:** 4-8 weeks
**Participants:** 5-10 subject matter experts (SMEs)

#### Step 1: Identify Critical Incidents (Week 1-2)

Gather examples of actual job behaviors:

**Process:**
- Interview 5-10 current high/medium/low performers
- Ask for specific examples of effective and ineffective performance
- Collect 40-60 "critical incidents" per competency
- Focus on observable actions, not traits

**Example questions:**
- "Tell me about a time when [competency] led to great outcomes"
- "Describe a situation where someone struggled with [competency]"
- "What does excellent [competency] look like in practice here?"

#### Step 2: Cluster and Categorize (Week 2-3)

Group incidents into performance levels:

**Process:**
- SMEs independently sort incidents into performance levels
- Calculate agreement rates (need 70%+ agreement)
- Refine or remove incidents with low agreement
- Identify patterns within each level

**Output:** 10-15 behavioral examples per performance level

#### Step 3: Create Behavioral Anchors (Week 3-4)

Write descriptions for each level:

**Process:**
- Synthesize incidents into behavioral descriptions
- Use specific, observable language
- Avoid personality traits or adjectives
- Focus on what candidate says/does, not how you feel

**Quality check:**
- Can two people read this and score the same way?
- Is it based on observable behavior?
- Is it clearly different from adjacent levels?
- Is it job-relevant?

#### Step 4: Validate and Refine (Week 4-8)

Test the BARS:

**Process:**
- New raters (not developers) use BARS to score practice interviews
- Calculate inter-rater reliability (goal: >0.75 agreement)
- Identify ambiguous anchors and refine
- Repeat until reliable

**If inter-rater reliability is low (<0.70):**
- Behavioral anchors may be too vague
- Levels may overlap
- Need more specific observable indicators

### Method 2: Efficient BARS Development (Practical)

Streamlined approach that maintains quality while reducing time.

**Timeline:** 1-2 weeks
**Participants:** 2-3 SMEs + hiring manager

#### Step 1: Define Competencies (Day 1)

What are you measuring?
- Extract 3-5 critical competencies from job description
- Define each competency in 1-2 sentences
- Ensure they're observable through interview

#### Step 2: Create Interview Questions (Day 1-2)

2-3 questions per competency:
- Mix behavioral ("Tell me about a time...") and situational ("What would you do...")
- Ensure questions can elicit evidence of competency
- Write predetermined follow-ups

#### Step 3: Draft Behavioral Anchors (Day 2-3)

For each question, describe four performance levels:

**Template:**

```
POOR (1-2 points):
- What would a weak response include?
- What would be missing?
- What red flags might appear?

MIXED (3 points):
- What would a partially satisfactory response include?
- What gaps or concerns might exist?
- What shows potential despite weaknesses?

GOOD (4 points):
- What would a solidly competent response include?
- What indicates meeting the job requirements?
- What evidence of relevant experience/judgment?

EXCELLENT (5 points):
- What would an exceptional response include?
- What shows depth of expertise/judgment?
- What indicates exceeding job requirements?
```

#### Step 4: Calibrate with Examples (Day 4-5)

Test with actual responses:
- Have 2-3 raters independently score 3-5 practice responses
- Discuss discrepancies
- Refine anchors based on what caused confusion
- Repeat until >80% agreement

### Method 3: AI-Assisted BARS Development (Emerging)

Use LLMs to draft initial BARS, then human refinement.

**Process:**
1. Provide competency definition and job context to LLM
2. Ask LLM to generate 4-level BARS with behavioral indicators
3. SMEs review and refine for job-specificity
4. Calibrate with real examples

**Advantages:**
- Fast initial draft (minutes vs. days)
- Can generate multiple variations to choose from
- Good starting point for refinement

**Limitations:**
- May generate generic rather than job-specific anchors
- Requires validation with actual responses
- No substitute for SME knowledge and calibration

**Best Practice:** Use AI as first draft, then follow Method 2 refinement process.

## Example BARS by Competency

### Example 1: Analytical Thinking

**Competency Definition:** Ability to break down complex problems, identify patterns, and generate solutions based on evidence and logic.

**Interview Question:** "Describe a situation where you had to analyze a complex problem. How did you approach it, and what was the outcome?"

#### BARS:

**EXCELLENT (5 points)**
- Systematically broke down problem into components and identified root causes
- Gathered and analyzed relevant data before proposing solutions
- Considered multiple solution approaches with explicit tradeoffs
- Described both short-term fixes and long-term preventions
- Outcome showed clear impact and validated analysis

**GOOD (4 points)**
- Identified the problem correctly and gathered relevant information
- Proposed a viable solution with some consideration of tradeoffs
- Showed logical reasoning from problem to solution
- Outcome was positive or candidate learned from suboptimal result
- Some evidence of systematic approach

**MIXED (3 points)**
- Understood the problem at surface level but missed some complexity
- Solution had merit but also significant gaps or oversights
- Limited consideration of alternatives or tradeoffs
- Reasoning was somewhat unclear or had logical gaps
- Outcome unclear or candidate struggled to articulate learning

**POOR (1-2 points)**
- Could not clearly identify the core problem or confused symptoms with root cause
- Proposed solution would not work or missed key constraints
- No evidence of systematic analysis or consideration of alternatives
- Could not articulate clear reasoning or learning
- Vague generalities rather than specific example

### Example 2: Collaboration

**Competency Definition:** Ability to work effectively with others, including seeking input, resolving disagreements, and achieving shared goals.

**Interview Question:** "Tell me about a time when you had to work with someone who had a very different perspective or approach. How did you handle it?"

#### BARS:

**EXCELLENT (5 points)**
- Actively sought to understand the other person's perspective and reasoning
- Found common ground and built on areas of agreement
- Proposed compromise or synthesis that incorporated both viewpoints
- Outcome improved due to incorporating diverse perspectives
- Maintained positive relationship throughout disagreement

**GOOD (4 points)**
- Listened to and acknowledged the other person's viewpoint
- Worked to find mutually acceptable solution
- Communicated own perspective clearly without dismissing others
- Reached resolution that enabled progress
- Relationship remained professional

**MIXED (3 points)**
- Some attempt to understand other perspective but limited depth
- Either deferred entirely or pushed own view without synthesis
- Resolution more about compromise than true collaboration
- Some tension in relationship but ultimately functional
- Learning somewhat superficial

**POOR (1-2 points)**
- Dismissed or didn't seriously consider other perspective
- Framed situation as "me vs. them"
- Escalated to manager rather than attempting resolution
- Damaged relationship or burned bridge
- No evidence of learning or growth from experience

### Example 3: Technical Problem-Solving (Software Engineering)

**Competency Definition:** Ability to diagnose technical issues, design solutions, and make tradeoffs between competing concerns (performance, maintainability, time-to-ship).

**Interview Question:** "Walk me through a challenging technical problem you solved. What made it difficult, and how did you approach it?"

#### BARS:

**EXCELLENT (5 points)**
- Clearly explained technical complexity (root cause, constraints, edge cases)
- Described systematic debugging/investigation approach
- Considered multiple solution approaches with explicit tradeoffs (time/space/maintainability)
- Solution was elegant and addressed root cause, not just symptoms
- Demonstrated learning that transferred to future problems

**GOOD (4 points)**
- Adequately explained the technical challenge
- Showed logical approach to investigation and solution
- Proposed solution that worked, with some consideration of tradeoffs
- Some evidence of technical depth and sound reasoning
- Outcome was successful

**MIXED (3 points)**
- Explained problem at high level but missed technical nuance
- Approach was somewhat ad-hoc or trial-and-error without system
- Solution worked but may not have addressed root cause or considered alternatives
- Limited discussion of tradeoffs or constraints
- Unclear whether learning was deep or just "got it working"

**POOR (1-2 points)**
- Could not clearly explain the technical problem or why it was challenging
- No systematic approach evident, relied heavily on others or luck
- Solution unclear or would likely not work/scale
- No consideration of alternatives or tradeoffs
- Vague generalities rather than technical specifics

## Implementation Best Practices

### 1. Focus on Observable Behaviors

**Good behavioral anchors:**
- "Broke problem into sub-components"
- "Considered three alternative approaches"
- "Asked clarifying questions before proposing solution"
- "Acknowledged uncertainty and proposed way to validate"

**Bad behavioral anchors (too subjective):**
- "Showed good judgment"
- "Demonstrated strong leadership"
- "Was creative"
- "Seemed confident"

**Rule:** If two people could watch/hear the same response and disagree on whether the behavior occurred, it's not observable enough.

### 2. Differentiate Levels Clearly

Each level should be distinctly different from adjacent levels:

**Poor Differentiation:**
```
GOOD: Shows strong analytical skills
EXCELLENT: Shows very strong analytical skills
```
(What's the difference?!)

**Clear Differentiation:**
```
GOOD: Identifies problem and proposes viable solution

EXCELLENT: Systematically breaks down problem, considers multiple
solutions with tradeoffs, and articulates clear reasoning
```

### 3. Make Levels Job-Relevant

"Excellent" should mean "exceeds this job's requirements," not "world-class expert."

**For Entry-Level Role:**
- EXCELLENT = What a strong mid-level person would demonstrate
- GOOD = Solid entry-level performance
- MIXED = Shows potential but needs development
- POOR = Not ready for this role

**For Senior Role:**
- EXCELLENT = Expert-level, could lead/mentor others
- GOOD = Independently competent at senior level
- MIXED = Mid-level trying to reach senior (may be close)
- POOR = Doesn't meet senior bar

### 4. Include "Non-Signals" Guidance

Tell interviewers what NOT to evaluate:

**Example for Communication Competency:**

```
NON-SIGNALS (do NOT evaluate these):
- Accent or speaking style
- Introversion vs. extroversion
- Nervousness or filler words
- Speed of response
- Whether you'd "grab a beer" with them

SIGNALS (DO evaluate these):
- Clarity of explanation
- Logical structure of response
- Ability to adapt explanation to audience
- Responsiveness to follow-up questions
```

This explicitly counteracts common biases.

### 5. Calibrate Interviewers

**Process:**
1. All interviewers independently score 2-3 practice responses using BARS
2. Compare scores and discuss discrepancies
3. Align on interpretation of behavioral anchors
4. Repeat until >80% agreement

**Frequency:**
- Initial training: 3-4 practice examples
- Quarterly recalibration: 1-2 examples
- When scores drift: Additional calibration

### 6. Separate Scoring from Recommendations

**What interviewers should provide:**
- Scores on each BARS dimension (1-5)
- Detailed notes on what candidate said/did
- Quotes or examples supporting scores

**What interviewers should NOT provide:**
- Overall hire/no-hire recommendation
- Comparison to other candidates
- Gut feeling assessments

**Why:**
- Enables independent review
- Reduces confirmation bias
- Allows hiring committee to see patterns
- Makes individual interviewer bias visible

## Common Challenges and Solutions

### Challenge 1: "This takes too long to develop"

**Reality Check:**
- Method 1 (comprehensive): 4-8 weeks upfront
- Method 2 (efficient): 1-2 weeks upfront
- Method 3 (AI-assisted): 2-3 days upfront

**ROI:**
- Reusable across multiple hiring cycles
- ~40 min saved per interview (Google data)
- Better hires = massive long-term value
- Breaks even after 5-10 interviews

### Challenge 2: "BARS feel too rigid"

**Response:**
- Behavioral anchors are for scoring, not for conducting interview
- Interview can still be conversational and adaptive
- Follow-up questions can explore nuance
- Structure is in evaluation, not in interaction

**Analogy:** Rubric is like a ruler - measuring tool doesn't constrain what you're measuring.

### Challenge 3: "Candidates don't fit neatly into levels"

**Response:**
- Most candidates will be between levels - that's okay
- Use half-points (2.5, 3.5) if needed
- BARS provide anchors, not rigid boxes
- Document why you scored between levels

**Example:**
"Scored 3.5 - showed good problem decomposition (4-level) but solution had some gaps (3-level)"

### Challenge 4: "Different interviewers still disagree"

**Diagnosis:**
- Check inter-rater reliability (calculate % agreement)
- If <70%, behavioral anchors may be unclear
- If 70-85%, acceptable range - discuss extreme outliers
- If >85%, excellent - no action needed

**Solutions:**
- Refine vague anchors
- Add more specific behavioral indicators
- Provide example responses for each level
- Additional calibration training

### Challenge 5: "Candidates without direct experience score poorly"

**Response:**
- Situational questions ("What would you do...") for those lacking experience
- Transfer of skills from different contexts counts
- BARS should evaluate quality of reasoning, not just presence of experience
- Consider separate BARS for behavioral vs. situational questions

## Measuring BARS Effectiveness

### Metrics to Track

**Process Metrics:**
- Inter-rater reliability (target: >0.75)
- Time to complete scoring (should decrease with practice)
- Interviewer satisfaction with clarity of rubrics

**Outcome Metrics:**
- Correlation between interview scores and job performance
- Adverse impact ratios across demographic groups
- Offer acceptance rates by score range
- First-year retention by score range

**Validation Study:**
Track interview scores vs. performance ratings 6-12 months after hire:

| Interview Score Range | Avg Performance Rating | Correlation |
|--------------------|----------------------|-------------|
| 4.0-5.0 (Excellent) | 4.2 / 5.0 | r = 0.51 |
| 3.0-3.9 (Good) | 3.5 / 5.0 | |
| 2.0-2.9 (Mixed) | 2.8 / 5.0 | |
| 1.0-1.9 (Poor) | 2.1 / 5.0 | |

**Goal:** Strong positive correlation (r > 0.40) validates BARS are predictive.

### Continuous Improvement

**Quarterly Review:**
1. Calculate inter-rater reliability - is it maintaining?
2. Review extreme score disagreements - what caused them?
3. Check if any behavioral anchors are ambiguous
4. Update based on feedback from interviewers
5. Refresh with new example responses

**Annual Validation:**
1. Run full validity study (scores vs. performance)
2. Check for adverse impact across demographics
3. Compare pass-through rates to quality of hires
4. Major updates to BARS if needed

## BARS Templates

### Template 1: Blank BARS (Copy and Complete)

```markdown
**Competency:** [Name]

**Definition:** [What this competency means in 1-2 sentences]

**Interview Question:** [Your behavioral or situational question]

**EXCELLENT (5 points)**
- Behavioral indicator 1
- Behavioral indicator 2
- Behavioral indicator 3
- What this looks like: [Example]

**GOOD (4 points)**
- Behavioral indicator 1
- Behavioral indicator 2
- Behavioral indicator 3
- What this looks like: [Example]

**MIXED (3 points)**
- Behavioral indicator 1
- Behavioral indicator 2
- Behavioral indicator 3
- What this looks like: [Example]

**POOR (1-2 points)**
- Behavioral indicator 1
- Behavioral indicator 2
- Behavioral indicator 3
- What this looks like: [Example]

**NON-SIGNALS (Do NOT evaluate):**
- Non-signal 1
- Non-signal 2
```

### Template 2: Scoring Sheet

```markdown
**Candidate:** _______________  **Date:** _______________
**Interviewer:** ______________  **Role:** _______________

**Competency 1: [Name]**
Score: [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5

Evidence/Notes:
[What did the candidate say/do that supports this score?]

**Competency 2: [Name]**
Score: [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5

Evidence/Notes:
[What did the candidate say/do that supports this score?]

[Repeat for each competency]

**Overall Notes:**
[Any additional observations, concerns, or highlights]

**DO NOT INCLUDE:** Hire/no-hire recommendation
```

## Advanced Topics

### Multi-Dimensional BARS

For complex competencies, use sub-dimensions:

**Leadership Competency:**
- Dimension 1: Strategic Thinking (1-5 BARS)
- Dimension 2: People Development (1-5 BARS)
- Dimension 3: Decision-Making (1-5 BARS)

Each gets its own question and BARS.

### Weighted BARS

Not all competencies are equally important:

| Competency | Weight | Score | Weighted Score |
|-----------|--------|-------|----------------|
| Technical Skill | 40% | 4 | 1.6 |
| Collaboration | 30% | 3 | 0.9 |
| Communication | 30% | 5 | 1.5 |
| **Total** | **100%** | | **4.0** |

Allows differential emphasis while maintaining structure.

### Experience-Level Adjusted BARS

Different BARS for entry/mid/senior:

**Problem-Solving: Senior Level**
- EXCELLENT: Architected system-level solution considering long-term implications
- GOOD: Designed module-level solution with solid engineering tradeoffs
- MIXED: Solved immediate problem but limited broader thinking
- POOR: Could not propose viable approach

**Problem-Solving: Entry Level**
- EXCELLENT: Systematically worked through problem with clear logic
- GOOD: Identified problem and proposed reasonable solution
- MIXED: Needed significant guidance but showed learning
- POOR: Could not engage with problem effectively

## Key Takeaways

1. **BARS use observable behaviors, not subjective impressions** - This is the core principle that drives all benefits.

2. **Four levels (Poor/Mixed/Good/Excellent) work well** - Enough differentiation without too much complexity.

3. **Development takes time upfront but pays off** - 1-8 weeks initially, then reusable; breaks even after 5-10 interviews.

4. **Calibration is essential** - Even perfect BARS fail without interviewer alignment on what each level means.

5. **Validate with actual outcomes** - Track scores vs. job performance to ensure predictive validity.

6. **Include non-signals guidance** - Explicitly tell interviewers what NOT to evaluate.

7. **Separate scoring from hiring decisions** - Interviewers provide evidence; committees decide.

8. **Continuous improvement required** - Review and refine quarterly based on data and feedback.

## Resources

- Kell, H. J., Rittmayer, A. D., Crook, A. E., & Motowidlo, S. J. (2017). Exploring methods for developing behaviorally anchored rating scales for evaluating structured interview performance. *ETS Research Report Series*.

- Smith, P. C., & Kendall, L. M. (1963). Retranslation of expectations: An approach to the construction of unambiguous anchors for rating scales. *Journal of Applied Psychology, 47*(2), 149-155.

---

**Last Updated:** January 2025
**Source:** Research literature and organizational psychology best practices
