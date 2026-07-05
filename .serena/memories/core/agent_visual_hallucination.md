# Lesson: sub-agents hallucinate visual reports

Twice in the same session, when I asked a sub-agent to "look at this screenshot and report what you see," the agent produced a long, detailed, plausible-sounding visual report that was **completely false** — the actual screenshot showed a fully designed page and the agent reported "raw unstyled HTML."

This is expensive. It cost an extra redesign cycle (a third "fix" agent was dispatched to add Material Design styling that was already there) and a confused user.

## Root cause

Sub-agents receiving an image + a prompt to describe it appear to default to **plausible-text generation** rather than actual image parsing. They produce visual reports that match what a generic prompt response would say, not what the image actually contains. The model's vision capabilities exist, but the agent is not reliably using them when the prompt gives it a narrative frame ("report what you see" can be satisfied by inventing a narrative).

## Mitigation (in order of cost)

1. **Don't ask sub-agents to describe images.** Take the screenshot yourself with `browser_take_screenshot`, then verify with **hard pixel evidence**:
   ```python
   from PIL import Image
   img = Image.open('landing.png')
   teal = sum(1 for y in range(0, h, 2) for x in range(0, w, 2)
              for r, g, b in [img.getpixel((x, y))]
              if abs(r-0)<25 and abs(g-106)<25 and abs(b-106)<25 and r+g+b < 300)
   ```
   The numbers are objective. The agent's text is not.

2. **Use `browser_evaluate` for live layout checks.** This is more reliable than screenshots for layout/structure questions:
   ```js
   document.querySelector('h1').getBoundingClientRect()
   getComputedStyle(document.querySelector('.x')).getPropertyValue('--y')
   matchMedia('(prefers-color-scheme: dark)').matches
   ```

3. **When delegating implementation, ask the sub-agent to output concrete measurable results**, not descriptions:
   - "Run the layout probe, report h1.width, h1.height, labels.x, lanes.right, etc."
   - "Report teal pixel count, ink pixel count, track line count, empty bin count."
   - NOT "describe what the page looks like."

4. **Build a healthy skepticism into the orchestrator's verification step.** When the sub-agent reports "everything looks great," treat that as a signal to *check*, not as a green light. The "looks great" report is exactly when the hallucination is most expensive.

## When agents CAN be trusted on visual

- If the agent reports a **build error or a number that contradicts an earlier number I saw**, that's usually reliable (it's concrete data, not visual).
- If the agent is reporting **what files they created/edited and what each file does** (textual, not visual), that's usually reliable.
- If the agent is reporting **what they "see" in a screenshot or rendered page**, that is **not reliable** without cross-check.

## When this is most likely

- The agent has been running for several tool calls and is being asked to wrap up.
- The prompt is "report what you see" with no concrete measurement request.
- The screenshot is of a design that took many iterations to reach — the agent's training data biases it toward reporting "looks normal" even if the design is unusual.

## Concrete fix to apply in future prompts

Instead of:
> "Take a screenshot and describe what you see"

Use:
> "Take a screenshot. Then run this Python check on the saved file and report the numbers. Do not describe the visual content."

Or for live layout:
> "Run this browser_evaluate and report the JSON. Do not describe what the page looks like."
