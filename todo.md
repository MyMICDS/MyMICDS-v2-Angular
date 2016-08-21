# TODO
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
- 404 Page
- Fix Daily Bulletin crashing if no PDF's
- Typeahead for teacher names

# **VERY IMPORTANTE!!!!**
- Add rainbow colors for specifically user pshort

# Problems

## General
- Fix date pipes for iOS Safari
- Add 'Quick Links' to the navbar or possibly make it a Homepage module?
- Cache Canvas and Portal Events for speed (maybe lunch too?)
- shoot forgot Google Analytics

## Home Page
- Schedule is default schedule if you logout and log back in or something
- Customize labels when you hover over progress bar
- Fix schedule when it shortens Collaborative period to 'US'
- Progress bar no funciona si the user isn't logged in.

## Lunch Page
- Lunch doesn't show up for Monday or Tuesday on weekend

## Planner
- Fix styling when viewing planner modal
- Disable deletion (possibly editing?) of Canvas events
- Add link to Canvas assignment
- Be able to cross out events in Planner
- Change URL to be /planner/{year}/{month} if you select next or previous month
- Show dark text if event color is too bright

## Settings Page
- Separate Settings sections into their own component.
  - Add Canvas / Portal link submission component to help page too

## Daily Bulletin
- Fix Daily Bulletin date displayed at the top
- Daily Bulletin don't use Google Docs for viewing emails

## Login System
- Login crashes if invalid password

## Registration
- Fix URL title in confirmation page
- Email confirmation is slow
- Reset password button has blue text instead of white
- Reset password need to add 'Wait a few minutes or check spam' just like registration
