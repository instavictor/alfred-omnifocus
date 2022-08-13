# alfred-omnifocus

Omnifocus JXA Scripting in Alfred Workflows.

Download the [Alfred workflow here](./dist/Create%20Omnifocus%20Task.alfredworkflow).

## Dependencies

1. [Alfred with Powerpack](https://www.alfredapp.com/)
1. [Omnifocus Pro](https://www.omnigroup.com/omnifocus/)

## Description

This adds a `todo` shortcut command to create OmniFocus tasks via Alfred.  It takes commands and passes it through to OmniFocus' API.

There are a few custom features:
- Uses `@` to prefix dates instead of `#`.
- Uses `#` to prefix tags instead of `@`.
- Provide feedback when a tag does not exist in the app, e.g. 'Warning: no `abc` tag found!`

## Usage

`todo I must do something! @tomorrow #work #home $60 min //some notes`
- `!` after the text flags the task as important
- `#` sets a tag.  If a tag does not exist, there will be a warning displayed.  For now, they **must be created manually** in the app.
- `::` sets the project.
- `@` sets a date. If there is only one, it sets the `due date`. If there are two, the first sets the `defer date`, and the second sets the `due date`.  Here are some examples:
    - `@tomorrow 3.30p` -> sets the due date for 3:30 PM tomorrow
    - `@tomorrow` -> sets the due date for 5 PM tomorrow
    - `@3.30p` -> sets the due date for 3:30 PM today
    - `@today` -> sets the due date for 5 PM today
- `$` sets the task duration.
- `//` sets the note for the task.

## Resources

- [Gist of JXA and OmniFocus relevant links](https://gist.github.com/instavictor/fb5f632dce2f686949577c00e9bfb3b0)
