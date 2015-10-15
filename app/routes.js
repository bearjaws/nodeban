function Routes(express, controllers) {
    express.get('/', function (req, res) {
        res.send('Hello World!2');
    });

    express.get('/api/status', function(req, res) {
        res.status(200).end();
    });

    express.post('/api/board/create', function(req, res) {
        return controllers.board.createBoard(req.body).then(function(test) {
            return res.status(200).json({
                message: "Board created successfully"
            });
        }).catch(function(err) {
            return handleErrors(req, res, err);
        });
    });
}

/**
 * Handles our standard error types to prevent repeating validation handling.
 *
 * @param  object req Express request object.
 * @param  object res Express response object.
 * @param  object err The error from our promise chain.
 * @return object {express}
 */
function handleErrors(req, res, err) {
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: "JSON fails validation.",
            validation: err.details
        })
    }
    if (err.name === "UserError") {
        return res.status(400).json(err);
    }
}

module.exports = Routes;
