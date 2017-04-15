const koa     = require('koa'),
      router  = require('koa-router')(),
      logger  = require('koa-logger'),
      serve   = require('koa-static'),
      hbs     = require("koa-handlebars");


const app = new koa();

// Logger
app.use(logger());
app.use(serve(process.cwd() + '/dist'));

app.use(hbs({
  defaultLayout: 'main', 
  viewsDir: './views', 
  layoutsDir: './views/layouts', 
  partialsDir: './views/partials', 
  extension: 'hbs',
  cache: false
}));

router.get('/', function *() {
  yield this.render('home', {
    title: 'Home'
  });
});

app.use(router.routes());

if (!module.parent) {
  app.listen(1337);
  console.log('listening on port 1337');
}