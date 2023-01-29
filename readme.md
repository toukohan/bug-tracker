# Bug Tracker

A simple issue tracking tool to manage attention and workload depending on user roles.

## Current version

(1.01) I built functionality to create issues and restricted access from dashboard based on user role. Now every user can see the issues they have created in the dashboard. Regular users cannot see issues other than the ones they have created.

I created views for issues and users from where you can select an view individual issue or user. They don't have working functionality yet, but intention for some roles to change the properties of issues and users.

(1.0) I tailored some examples from Bootstrap for my interface and set up different views with ejs. Then I built an user model with Mongoose and authentication with Passport.js.

Created some mock data to play with. (But decided to start creating issues by hand instead.)

# Goals

## Roles

Different user roles will have a different view of the issues:

Admin can see everything. Manager can allocate issues to devs, who can see their particular issues. Regular user can report issues and receive answers.

Goal is to reduce distractions and only have the important things visible to the right people.

## Issues

Categorising issues based on their priority and having different parameters to sort them.

Responses to issues? (like a ticket system)
