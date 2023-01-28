# Bug Tracker
A simple issue tracking tool to manage attention and workload depending on user roles.

## Current version

I tailored some examples from Bootstrap for my interface and set up different views with ejs. Then I built an user model with Mongoose and authentication with Passport.js.

Created some mock data to play with.


# Goals

## Roles

Different user roles will have a different view of the issues:

Admin can see everything. Manager can allocate issues to devs, who can see their particular issues. Regular user can report issues and receive answers.

Goal is to reduce distractions and only have the important things visible to the right people.

## Issues

Categorising issues based on their priority and having different parameters to sort them.

