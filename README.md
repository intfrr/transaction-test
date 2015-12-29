# Transactional Test Project

I am attempting to create a Transactional mixin which I can apply to a model that will make it transactional by default.
What this means is that for all basic methods when invoked remotely such as create, update, delete and so on, a transaction
will be created and passed into the options of all CRUD methods automatically and committed when the invocation is ready to return
a result or an error is thrown.

My reason for this is that I tend to have logic in the after save/before save hooks which needs to be carried out as part
of a transaction.

The current implementation is my best attempt so far, but I need help understanding how I can pass the transaction set
within the remote invocation context into the calls being made to the CRUD methods of the model. Also for custom remote
methods, I need to understand how I can retrieve the transaction from the invocation context for passing into my model methods.
See explicitTransaction and implicitTransaction methods in Foo.js.
