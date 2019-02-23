// Wrap all Express methods in this function.
// All methods wrapped by this MUST BE ASYNC.
exports.wrap = func => (req, res, next) => {
    func(req, res, next).catch(err => {
        console.error(err);
        next(err);
    });
};
