## Bluemix Installation

To deploy this application in your own bluemix account, do the following:

1. Fork this project to your own repository. To do this click the 'FORK PROJECT' button in Jazz Hub. In the dialog, type in the name for your new project and make sure to uncheck "Make this a Bluemix Project" option for the time being. Click create and follow further instructions on the page.

2. In the "Build & Deploy" section of Bluemix DevOps Services add a stage and:
    * In the input settings section select your newly cloned repository and branch;
    * Select manual stage trigger (bottom of the menu);
    * Next, in the jobs section click to add a new job of type 'build';
    * Select builder type npm and in the build shell command uncomment the line for Node v0.12. The shell command should look like this:
        ```
        #!/bin/bash
        export PATH=/opt/IBM/node-v0.12/bin:$PATH
        npm install --production
        ```
    * In the same stage add another job of Deploy type;
    * Paste this into the deploy script. Don't forget to change the bracketed parameters.
        * [application_name] is the hostname that you will be able to use for reaching the application. I.e. https://[application_name].mybluemix.net/
        * [admin_email] and [admin_password] are the login information for your master admin account.
        * When you change the bracketed parameters, make sure to remove the square brackets in the actual shell command.
        ```
        #!/bin/bash
        cf create-service sqldb sqldb_free scores-sql
        cf create-service Object-Storage Free scores-object-storage
        cf create-service sendgrid free scores-sendgrid
        cf push "${CF_APP}" -n [application_name] -c "node server/app.js install [admin_email] [admin_password]"
        ```
    * Click SAVE and return to Pipeline view.

3. Run the setup stage that you just created once until stage status changes to 'Succeeded'.
4. When the stage has successfully completed go to your Bluemix application dashboard and stop the application.
5. Inside the application dashboard (in Bluemix) navigate to the Environment variables and create a new user-defined variable called "jwtKey". This is the encryption key for security tokens. Make sure the encryption key is at least 200 character strong preferably random string.
6. Now that the security token is set, go back to DevOps (hub.jazz.net) Build & Deploy and modify the Deploy job in the setup stage. Change the shell command to this and run the stage again:
    ```
    #!/bin/bash
    cf push "${CF_APP}" -n [application_name] -c "node server/app.js"
    ```
7. You may now create a new event with the admin account that you created in steps 3 and 4.


## Usage
### Roles
The application has the following roles:
1. Administrator - creates events and assigns organizers.
2. Organizer - curates events by adding event details, voting type (for judges or open to public), creates teams and voting criteria, assigns judges.
3. Judge - assesses teams according to provided criteria.
4. Anonymous - if public voting enabled, assess teams according to provided criteria (no registration needed).