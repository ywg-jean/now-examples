# Next.js + MySQL Example

This directory is an example of a [Next.js](https://nextjs.org) app connected to a [MySQL](https://www.mysql.com/) database using the [@now/next](https://zeit.co/docs/v2/deployments/official-builders/next-js-now-next/) and [@now/node](https://zeit.co/docs/v2/deployments/official-builders/node-js-now-node/) [Builders](https://zeit.co/docs/v2/deployments/builders/overview/).

## Example Purpose

The main purpose of this example is to highlight how MySQL can be used successfully in a serverless architecture. For a more detailed explanation of [Next.js](https://nextjs.org) you can visit the [documentation](https://nextjs.org/docs/) or view other examples in this repository such as a [Next.js only build](https://github.com/zeit/now-examples/tree/master/nextjs).

## Directory Contents

This example consists of three directories:

- `/api` - which contains the serverless [lambda](https://zeit.co/docs/v2/deployments/concepts/lambdas/) functions to be deployed inside `/profiles`
- `/lib` - which is where the database connection helper is stored
- `/pages` - where the data received is displayed by [Next.js](https://nextjs.org)

The example includes a `now.json` file, used to configure your build when [deploying](https://zeit.co/docs/v2/deployments/basics/) to Now, and a `.nowignore` file, used to [prevent uploading unnecessary source paths](https://zeit.co/guides/prevent-uploading-sourcepaths-with-nowignore/) to Now, keeping deployment times short.

Also included is a `db.sql` file, which has the example data and SQL commands, this can be used to replicate this example.

Lastly, the `next.config.js` is used to tell [Next.js](https://nextjs.org) that we are targeting a serverless environment.

## How Serverless MySQL Works

Serverless functions will create multiple database connections as traffic increases and therefore all available connections can be consumed quickly, blocking access for others. This example resolves this issue by utilizing [Jeremy Daly's](http://www.jeremydaly.com) MySQL wrapper - [serverless-mysql](https://github.com/jeremydaly/serverless-mysql).

The wrapper provides basic but important functionality that allows connections to be monitored, limited, retried and closed. This is vital for making serverless MySQL work and is explored further in `db.js` below:

```js
const mysql = require('serverless-mysql');

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
});

exports.query = async query => {
  try {
    const results = await db.query(query);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
};
```

`db.js` performs the following actions:

- Requires the `serverless-mysql` package
- Creates a connection to the database using pre-defined [environment variables](https://zeit.co/docs/v2/deployments/environment-variables-and-secrets/)
- Exports a query helper that enforces the `db.end()` method

The most important part, in the serverless context, is `db.end()`.

By using `await db.end()`, `serverless-mysql` ensures the connection is closed before sending the response to the client.

As a result, it ensures that concurrent MySQL connections do not reach their limit, allowing new connections to be created when required.

Next, let's look at `/api/profiles/profile.js` to see what a serverless MySQL query looks like:

```js
const db = require('../../lib/db');
const sql = require('sql-template-strings');
const url = require('url');

module.exports = async (req, res) => {
  const { query } = url.parse(req.url, true);
  const [profile] = await db.query(sql`
    SELECT *
    FROM profiles
    WHERE id = ${query.id}
  `);
  res.end(JSON.stringify({ profile }));
};
```

`index.js` performs the following actions:

- Requires the database connector found in `/lib`, along with the `url` and `sql-template-strings` modules
- Parses the request url to get the query parameters
- Sends a query to the database to get a single profile
- Sends the profile to the client as a response

As you can see, once the connection is created, querying the database is straightforward and easy to follow.

Using this format, you can create whatever queries you require simply by changing the parameter passed to `db.query()` - simple but incredibly effective, not to mention performant.

## Running this Example

To deploy your own version of this example follow the below steps:

- Create a remote MySQL database noting down the host, username, password and database name
- Clone this repository using and `cd` into it
- Install the dependencies with `yarn`
- Add the [environment variables](https://zeit.co/docs/v2/deployments/environment-variables-and-secrets/) from the first step using `now secrets add <ENV_NAME> <VALUE>` - the variable names can be found in `now.json`
- Populate your MySQL database with the data found in `db.sql` using your preferred method
- [Deploy](https://zeit.co/docs/v2/deployments/basics/) your application using a single command - `now`

Congratulations, you've just deployed your very own [Next.js](https://nextjs.org) + [MySQL](https://www.mysql.com/) application!

## Resources

For more information on how you can deploy your own [Next.js](https://nextjs.org) + [MySQL](https://www.mysql.com/) applications, see the following resources:

- [Our Next Builder (@now/next) documentation](https://zeit.co/docs/v2/deployments/official-builders/next-js-now-next/)
- [Our Node Builder (@now/node) documentation](https://zeit.co/docs/v2/deployments/official-builders/node-js-now-node/)
- [The basics of deploying on Now](https://zeit.co/docs/v2/deployments/basics/)
- [Using environment variables and secrets with Now](https://zeit.co/docs/v2/deployments/environment-variables-and-secrets/)
- [The official Next.js documentation](https://nextjs.org)
- [The official MySQL documentation](https://dev.mysql.com/doc/)
- [The official serverless-mysql documentation](https://github.com/jeremydaly/serverless-mysql)
