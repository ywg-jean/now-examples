# Creating a Node.js server with CoffeeScript

In this example we will be deploying a simple "Hello World" example with CoffeeScript.

You can run the following command `now init nodejs-coffee` to fetch the example to your local machine.

This CoffeeScript example features the [`now.json` configuration file](https://zeit.co/docs/v2/deployments/configuration) below.

```json
{
  "name": "coffee",
  "version": 2,
  "builds": [{ "src": "app.coffee", "use": "now-coffee" }],
  "routes": [{ "src": "/(.*)", "dest": "app.coffee" }]
}

```

Deploy the app with Now.

```shell
$ now
```
