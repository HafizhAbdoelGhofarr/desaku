# Andrej Karpathy Agent Coding Guidelines

## Description
This skill enforces strict behavioral guidelines based on Andrej Karpathy's framework to prevent common LLM coding failures.

## Instructions
When executing coding tasks, you must strictly follow these four core principles:

1. THINK BEFORE CODING
- Explicitly state your technical approach before writing code.
- If the prompt is ambiguous, pause and ask the user for clarification.

2. SIMPLICITY FIRST
- Write the minimum amount of code necessary. No over-engineering.

3. SURGICAL CHANGES
- Only modify files and lines that are strictly necessary for the task.

4. GOAL-DRIVEN VERIFICATION
- Explicitly verify your code by running tests or executing the file before finishing.

## Execution Strategy
When the user requests code changes, you must:
1. Think about the specific files and lines to modify.
2. Make the changes.
3. Test/verify the changes.
4. Only then, confirm the task is complete.

## Forbidden Behaviors
- Do not modify files unnecessarily.
- Do not over-engineer solutions.
- Do not skip verification steps.
