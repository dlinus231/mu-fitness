## Setup

Within Django/Django/settings.py, change the `DATABASES` field to contain the information of your local PostgreSQL database. 

To run the Admin dashboard, first you need to create a superuser. cd into Django, and run `python manage.py createsuperuser`. Choose a username, email, and password. After this, you should be able to run `python manage.py runserver`. Then navigate to the /admin/ of the local domain, e.g.: `http://127.0.0.1:8000/admin`. 

For the full tutorial of setup of database and admin dashboard, checkout this tutorial: https://docs.djangoproject.com/en/5.0/intro/tutorial02/
