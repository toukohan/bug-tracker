# Bug Stalker

A simple issue tracking tool to manage attention and workload depending on user roles.

# Current version

## 1.07

Added a search bar for searching issue titles and contents.

Added responsiveness to screen size.

(1.06)

Improved styles: added link color to issues and users, lined up texts and buttons in issue view.

Made the issue views display similar on the dashboard.

(1.05)

Added set priority to issue.

(1.05)

Styling changes.

Ability (for managers and admins) to add people to their team

Settings page from bottom left by clicking the username link (just to remove people from team at the moment)

Dashboard populates Help -department issues and issues assigned to the (at the moment)

Changed colors for the demo user login buttons

Assigning dropdown menu populated with the people from your team.

(1.04)

Added dotenv. Changed to Atlas database.

Testing different priority visuals.

Added new styling to "create".

Added checkNotAuthenticated to redirect back to dashboard if the session is alive.

Made an assigning feature on dashboard.

Added bootstrap styling to some of the default buttons and inputs.

Create User feature.

(1.03)

Added ability to add and remove departments for users.

Created a team property for users, which doesn't have any functionality.

Added "created by" and "assigned to" sections of issues on the dashboard. Fixed new sorting functionality to dashboard.

Added ability to assign issues for users and to open/close them.

Tinkered with some of the css. Different visual for closed issues.

Separated some of the routing to different files.

(1.02)
Managed to make the issue sorting functional. Issues are now searched based on user departments (only on issues view).

User roles can now be edited by admin.

Created a temporary solution to make the demo users functional.

Made some partials views to make later editing easier.

(1.01)
I built functionality to create issues and restricted access from dashboard based on user role. Now every user can see the issues they have created in the dashboard. Regular users cannot see issues other than the ones they have created.

I created views for issues and users from where you can select an view individual issue or user. They don't have working functionality yet, but intention for some roles to change the properties of issues and users.

(1.0) I tailored some examples from Bootstrap for my interface and set up different views with ejs. Then I built an user model with Mongoose and authentication with Passport.js.

Created some mock data to play with. (But decided to start creating issues by hand instead.)

# Lessons learned

If I started again, I would maybe try to break the goal down to more clear ideas. Now I was building the models on the go and they were getting cumbersome to manage.

I would start making the ejs partial views from the beginning. Now I found myself fixing same things on different views too many times. So maybe having a more clear idea on the views would be beneficial before starting to write the code.

I got a better understanding of asynchronous code, when I was trying to figure out multiple database calls per one request.

# Goals

## Projects (new)

At the moment all users are getting the issues from the same general source. So I was thinking about an ability to create projects that would be tied to the user who creates them. Then they would be able to invite other users to work with their project.

## Roles

Different user roles will have a different view of the issues:

Admin can see everything. Manager can allocate issues to devs, who can see their particular issues. Regular user can report issues and receive answers.

Goal is to reduce distractions and only have the important things visible to the right people.

## Issues

Categorising issues based on their priority and having different parameters to sort them.

Responses to issues? (like a ticket system)

Saving creator as user object (instead of just user.id) for easier more user based issue queries?
