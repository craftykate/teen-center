# Pages

_Check for comments and refactoring_
* ~~App.js~~
* ~~Layout.js~~
  * ~~Header.js~~
    * ~~Authorize.js~~
      * ~~AuthorizeForm.js~~
  * ~~Footer.js~~
* Checkin.js
  * Signin.js
    * ~~Register.js~~
      * ~~RegisterForm.js~~
  * ~~AttendanceList.js~~
* Reports.js
  * StudentInfo.js
  * SingleDay.js
* utils:
  * axios-signin.js
  * fire.js
  * variables.js
* custom.scss

# To Do
* Move messages to their own fixed spot

**Checkin**
* ~~Order attendance list by time in - or by first name? Probably name~~
* ~~Change times to 12 hr~~
* Make sure starting a new day erases attendance list

**Style**
* Set min-width on wrapper
* Change favicon

**General Site**
* Focus cursor in fields
* Which firebase modules do i need?
* Build one place for all error/success messages

**Firebase**
* Make sure app still works when user has timed out
* Maybe add a section in database for just ids so all info about every student isn't sent every time someone signs in
* Add validation (like an id added to attendance log must exist in student logs) in firebase 

**Login**
* Add password recovery to admin login (https://firebase.google.com/docs/auth/web/manage-users)

**Register**
* ~~Totally reformat registration function~~
* ~~Message and agree are getting posted to database~~
* ~~Add "Register and sign in now" button~~
* ~~Some sort of feedback when they register successfully~~

## Stories

**Student Side**
* ~~Admin can log in to student account so students can sign in but can't access admin features~~
* ~~The sign in page shows a running list of who signed in that day, when they arrived and when they left. This should have a refresh link in case two computers are used to sign in and student doesn't see their name~~
* ~~New student registers with their personal info~~
* ~~Student enters their student id, signing in to the teen center, marking the time they arrived~~
* Student sees their name and school and a link to update their personal data when they sign in and an error message if their id isn't found
* Student can update their data after signing in to teen center
* ~~Student signs out of the teen center, marking the time they left - probably with a sign out link next to their name on the attendance roll~~
* ~~There is a "sign everyone out" button under the attendance roll to sign everyone out at once who forgot to sign out already - I actually don't think this is necessary. It's better to know they didn't sign out so the time out is in question if needed later~~
* ~~Admin can log out~~

**Admin Side**
* ~~Admin can log in to admin account~~
* Admin can choose a date and enter in id's and time in and time out to sign students in for a previous date
* Admin can get a report for a certain time range showing number of unique students and number of total visits
* Admin can get a report for a certain day showing who signed in and when they signed in and out
* Admin can look up a student by ID to get their info. Possibly by name too, but that's way down the line

## Post Development
* Take out console.logs for database hits
* Upload to internet
* Update meta property tags on index.html
* Move database over to Lynn, make sure to update variables.js. Add myself as a user on database