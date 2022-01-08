const path = require('path');

class Kernel {
  // Mechanics variables
  #errors
  #canBoot

  // App variables
  #appRootPath
  #settings
  #env

  // Express variables
  #express
  #app

  /**
   * App Class Constructor
   * @param {string} appRootPath;
   */
  constructor(appRootPath) {
    this.#canBoot = true;
    this.#errors = [];

    this.#appRootPath = appRootPath;
    this.#settings

    this.#loadConfig();
    this.#boot();
  }

  async #registerRoutes() {
    let recursiveReadDir = require('recursive-readdir');
    console.log('Registering route from', this.#settings.paths.routersDir);
    global._settings = this.#settings;
    let routerCollection = await recursiveReadDir(this.#settings.paths.routersDir).then(
      function(files) {
        let routerCollection = [];
        for (let file of files) {
          let router = require(file);
          router.file = file;
          routerCollection.push(router);
        }
        return routerCollection;
      },
      function(error) {
        console.error('Error at registering routers', error);
        return [];
      }
    );

    // Register router against ExpressJS
    for (let router of routerCollection) {
      if (path.extname(router.file) == '.js') {
        this.#app.use(router.path, router.router);
      }
    }

    delete global['_settings'];
  }

  async #boot() {
    this.#express = require('express');
    this.#app = this.#express();
    const {twig}  = require( 'twig' );   // Destructing Twig since I only need Twig.twig
    this.#app.set('views', this.#settings.paths.templatesDir);
    this.#app.set('view engine', 'twig' );
  }

  #loadConfig() {
    this.#loadEnv();
    this.#loadSettings();
  }

  #loadSettings() {
    let settingsJsonFile = path.join(this.#appRootPath, 'config', 'settings.json')
    this.#settings = require(settingsJsonFile);
    this.#settings.paths = {
      routersDir: path.join(this.#appRootPath, 'app', 'routers'),
      controllersDir: path.join(this.#appRootPath, 'app', 'controllers'),
      modelsDir: path.join(this.#appRootPath, 'app', 'models'),
      templatesDir: path.join(this.#appRootPath, 'app', 'templates'),
      configDir: path.join(this.#appRootPath, 'config'),
    };
    console.log('Settings :', this.#settings);
  }

  /**
   * Method used to load .env file in the app
   * @returns
   */
  #loadEnv() {
    let env = require('dotenv').config({ path: this.#appRootPath + '/.env' })
    if (env.error) {
      this.#canBoot = false;
      this.#errors.push("Failed to load .env file at '" + this.#appRootPath + "/.env'");
      return false;
    }
    this.#env = env.parsed;

    console.log('.env :', this.#env);
  }

  /**
   * Start Application with ExpressJS underneath
   */
  async run() {
    if (!this.#canBoot) {
      for (let error of this.#errors) {
        console.log("\t => " + error);
      }
      console.log('Cannot start app ! STOP !');
      return false;
    }

    await this.#registerRoutes();
    
    this.#app.listen(this.#settings.server.port, () => {
      console.log(`Started app ! Listening at http://localhost:${this.#settings.server.port}`)
    })
  }

  getApp() {
    return this.#app;
  }
}

module.exports = Kernel;
