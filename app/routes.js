function Routes(express, controllers) {
    express.get('/api/status', function(req, res) {
        res.status(200).end();
    });

    /**
     * Route for creation of a kanban board.
     *
     * @return 400 error if the post body is invalid, the board already exists;
     * otherwise returns 200
     */
    express.post('/api/board/create', function(req, res) {
        return controllers.board.createBoard(req.body).then(function(test) {
            return res.status(200).json({
                message: "Board created successfully"
            });
        }).catch(function(err) {
            return handleErrors(req, res, err);
        });
    });

    /**
     * Gets a list of all boards available
     *
     * @return empty array if no boards exist, otherwise an array of board names
     */
    express.get('/api/boards', function(req, res) {
        return controllers.board.listBoards().then(function(boards) {
            res.json(boards);
        }).catch(function(err) {
            return handleErrors(req, res, err);
        });
    });

    /**
     * Gets a specific board and all items it contains.
     *
     * @return 404 if :board does not exist, otherwise returns a board object
     */
    express.get('/api/boards/:board', function(req, res) {
        var name = req.params.board;
        return controllers.board.getBoardByName(name).then(function(boards) {
            if (boards.length === 0) {
                res.status(404).end();
            } else {
                res.json(boards);
            }
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

    return res.status(500).end();
}

module.exports = Routes;
