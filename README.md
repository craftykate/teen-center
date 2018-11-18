# Components
* **App** state: user
  * **Layout** stateless
    * **Header** stateless
      * Logo
      * Log out link
    * Children:
      * **Admin log in** stateless
        * Form to log in
      * **Admin Report** state: full report
        * Full report
        * Day report
      * **Student check in** state: current students
        * Sign in form
          * Pop up confirmation window
        * **Sign up form**
        * **Daily attendance**
    * **Footer**

# State
* User 
  * Student or admin
* Today's current students
  * [{name, timeIn, timeOut}]
* Full report
  * [{from, to, uniqueKids, totalVisits}]
* Day report
  * [{day, [{name, timeIn, timeOut}]}]

# To Do
* Order attendance list by time in - or by first name? Probably name
* Change times to 12 hr
* Make sure app still works when user has timed out
* Change favicon

## Stories
* ~~Admin can log in to student account so students can sign in but can't access admin features~~
* The sign in page shows a running list of who signed in that day, when they arrived and when they left. This should have a refresh link in case two computers are used to sign in and student doesn't see their name
* New student registers with their personal info
* ~~Student enters their student id, signing in to the teen center, marking the time they arrived~~
* Student sees their name and school and a link to update their personal data when they sign in and an error message if their id isn't found
* Student can update their data after signing in to teen center
* ~~Student signs out of the teen center, marking the time they left - probably with a sign out link next to their name on the attendance roll~~
* ~~There is a "sign everyone out" button under the attendance roll to sign everyone out at once who forgot to sign out already - I actually don't think this is necessary. It's better to know they didn't sign out so the time out is in question if needed later~~
* ~~Admin can log out~~

* Admin can log in to admin account
* Admin can choose a date and enter in id's and time in and time out to sign students in for a previous date
* Admin can get a report for a certain time range showing number of unique students and number of total visits
* Admin can get a report for a certain day showing who signed in and when they signed in and out
* Admin can look up a student by ID to get their info. Possibly by name too, but that's way down the line

## Post Development
* Upload to internet
* Update meta property tags on index.html
* Move database over to Lynn, make sure to update variables