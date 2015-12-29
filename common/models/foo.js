
module.exports = function(Foo) {

  // create an instance of Bar

  Foo.observe('after save', function(ctx, next){

    var Bar = Foo.app.models.Bar;
    Bar.create({ message: 'Bar' }, ctx.options, next);

  });

  //

  Foo.explicitTransaction = function(cb){

    Foo.beginTransaction({ timeout: 10000 })
      .then(function(txn){

        return Foo.create({ message: 'test'}, { transaction: txn })
          .then(function(model){
            txn.commit()
              .then(function(){ cb(null, model ); })
          })

      });

  };

  Foo.remoteMethod(
    'explicitTransaction', {
      returns: {arg: 'result', type: 'Foo'}
    }
  );

  // TODO This currently doesn't work. I'm trying to figure out how to implement this;

  Foo.implicitTransaction = function(cb){


    // TODO how can I get a reference to the transaction created in the remote hook
    var options = Foo.app.loopback.getCurrentContext().options;

    Foo.create({ message: 'test'}, options, cb);

  };

  Foo.remoteMethod(
    'implicitTransaction', {
      returns: {arg: 'result', type: 'Foo'}
    }
  );

};
