
exports.postFactory = (delegate) => (req, res, next) => {
    delegate.reset().then(() => res.end()).catch(next);
  };
