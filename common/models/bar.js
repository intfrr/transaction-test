
module.exports = function(Bar) {

  // create an instance of Baz

  Bar.observe('after save', function(ctx, next){

    var Baz = Bar.app.models.Baz;
    Baz.create({ message: 'Baz' }, ctx.options, next);

  });



};
