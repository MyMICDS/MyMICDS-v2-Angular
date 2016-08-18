# TODO
- Settings page
  - Use class alias in portal schedule
- Update data if changed in another tab (socket.io?)
- Optimize for mobile

- Optimization
  - Webpack?
  - HTTP 2?
  - Make planner response faster?

- Fix Schedule Parser to include lunch / Advisory

# Not as Important
- More modules in homepage
- View schedule in next / previous day
- Check if classes belong to any user
- 404 Page
- Prevent empty titles in planner
- Fix Daily Bulletin crashing if no PDF's
- Typeahead for teacher names

# Problems
- Fix URL title in confirmation page
- Email confirmation is slow
- Reset password button has blue text instead of white
- Reset password need to add 'Wait a few minutes or check spam' just like registration
- Login crashes if invalid password
- Schedule is default schedule if you logout and log back in or something
- When add a class and directly try to add an alias, it says "**Error adding alias** Invalid class id!" until you refresh the page
- Changes don't take effect after the class has been created
- Some checkboxes aren't disabled for the aliases even though they should
- Fix styling when viewing planner modal
- Disable deletion (possibly editing?) of Canvas events
- Fix Daily Bulletin date displayed at the top
- Fix date pipes for iOS Safari
- Add link to Canvas assignment
- Add 'Quick Links' to the navbar or possibly make it a Homepage module?
- Be able to cross out events in Planner
- Cache Canvas and Portal Events for speed (maybe lunch too?)
