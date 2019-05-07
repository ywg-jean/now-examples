# Flaskex with PostgreSQL on ZEIT Now

[Demo](https://flaskex-postgresql.now-examples.now.sh)

This directory is a serverless example of [Flaskex](https://github.com/anfederico/Flaskex), ready to deploy on [ZEIT Now](https://zeit.co/now).

## Features
- Encrypted user authorizaton
- Database initialization
- New user signup
- User login/logout
- User settings
- Bulma CSS framework

To get started with this project yourself, use the following command from [Now CLI](https://zeit.co/docs/v2/getting-started/installation#now-cli):

```shell
$ now init flaskex-postgresql
```

> Alternatively, create a project, and Git repository, with this example template [using the ZEIT dashboard](https://zeit.co/new/flaskex-postgresql).

Once initialized locally, you will see several `.py` files which each correspond to a route in defined in the `now.json` configuration file. Each `.py` file is an input to the [Python Builder](https://zeit.co/docs/v2/deployments/official-builders/python-now-python) which emits a corresponding [Lambda](https://zeit.co/docs/v2/deployments/concepts/lambdas/) for each file.

You will need to add a couple of [secrets](https://zeit.co/docs/v2/deployments/environment-variables-and-secrets) before deploying.

```shell
$ now secrets add flaskex-db-uri 'postgresql+pg8000://username:password@pgsql.example.com/database' 
```

This example uses `postgresql` but you can use any [engine](https://docs.sqlalchemy.org/en/13/core/engines.html) supported by sqlalchemy.

```shell
$ now secrets add flaskex-secret-key '_5#y2LF4Q8z*Uz]' 
```

This [secret key](http://flask.pocoo.org/docs/1.0/quickstart/#sessions) is used by Flask when signing secrets. This can be a randomly generated string.

To [deploy](https://zeit.co/docs/v2/deployments/basics) this application, with [Now installed](https://zeit.co/docs/v2/getting-started/installation), run the following from your terminal:

```shell
$ now
```

Alternatively, your new Flaskex app can be automatically deployed and aliased using [Now for GitHub](https://zeit.co/docs/v2/integrations/now-for-github) or [Now for GitLab](https://zeit.co/docs/v2/integrations/now-for-gitlab). Pushing these files to a new repository with a `now.json` file in the root, and with either [Now for GitHub](https://zeit.co/docs/v2/integrations/now-for-github) or [Now for GitLab](https://zeit.co/docs/v2/integrations/now-for-gitlab) configured for that repository, means your site will be automatically deployed for every push and pull/merge request, and aliased for every push to the default branch!

## Included In This Starter

This starter project includes:
- A `/index.py` file that responds to the `/` route.
- A `/signup.py` file that responds to the `/signup` route.
- A `/settings.py` file that responds to the `/settings` route.
- A `/logout.py` file that responds to the `/logout` route.
- A `requirements.txt` file that installs dependencies such as Flask, SQLAlchemy, bcrypt, pg8000 (PostgreSQL driver)
- A generated `Pipfile.lock` that ensures exact versions of dependencies to avoid the risk of automatically upgrading packages that depend upon each other and breaking your project dependency tree.

## Resources

For more resources on how to configure your new Flask app to do more with Now or to deploy any other kind of application, see the following:

- [New to Now? Get a quick introduction](https://zeit.co/docs/v2/getting-started/introduction-to-now)
- [Learn the basics of deployment on Now](https://zeit.co/docs/v2/deployments/basics)
- [Learn how to configure your Now deployments](https://zeit.co/docs/v2/deployments/configuration)
- [Learn how to configure Now Routes for redirects, caching, and more](https://zeit.co/docs/v2/deployments/routes)
- [Learn how to alias your deployment to a domain or other unique shareable URLs](https://zeit.co/docs/v2/domains-and-aliases/introduction)

For more information on Flask itself, [see their documentation](http://flask.pocoo.org/docs/).






