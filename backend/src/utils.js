exports.wrap = func => (...args) => {
    func(...args).catch(e => {
        args[2](e);
    });
};
