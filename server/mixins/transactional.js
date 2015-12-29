
var debug = require('debug')('test:mixin:transactional');

module.exports = function(Model, options){

  var timeout = options.timeout || 10000;

  // For each remote invocation create a transaction

  Model.beforeRemote('**', function(ctx, model, next){

    Model.beginTransaction(
      { timeout: timeout },
      function (err, txn){
        ctx.options.transaction = txn;
        next(err);
      }
    );

  });

  // After the remote invocation commit the transaction

  Model.afterRemote('**', function(ctx, model, next){

    var txn = ctx.options.transaction;
    if(txn) txn.commit(next);

  });

  // On error rollback the transaction

  Model.afterRemoteError('**', function(ctx, next){

    var txn = ctx.options.transaction;
    if(txn) txn.rollback(next);

  });

  // for debugging only to check if a transaction is being used

  var dataSource = Model.dataSource;

  if(dataSource.name === 'mysql' && !dataSource._transactional){

    console.log('Patching datasource: ' + dataSource.name);

    var baseExecuteSQL = dataSource.connector.executeSQL;

    var customExecuteSQL = function (sql, params, options, callback){

      var txn = options.transaction;
      var txnId = txn ? txn.id : 'None';

      function delegate(){
        console.log('Executing SQL: %s, %s, %s', txnId, sql, params);
        baseExecuteSQL.call(dataSource.connector, sql, params, options, callback);
      }

      delegate();
    };

    customExecuteSQL.bind(dataSource.connector);
    dataSource.connector.executeSQL = customExecuteSQL;

    dataSource._transactional = true;
    debug('Patched datasource');
  }

};
