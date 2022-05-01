
let endpoint_root
let endpointCounter = {}


/**
 * Middleware method for Express app. Counts the endpoint path each time it is used,
 * and stores that number in the object endpointCounter.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Next} next goes to the next method in express 
 */
exports.expressMiddleware = (req, res, next) => {
    let path = req.path.replace(endpoint_root, "");
    this.addCount(path)
    next();
}

/**
 * Save all endpoints
 * @param {object} endpoints 
 */
exports.saveEndpoints = (endPointRoot, endpoints) => {
    endpoint_root = endPointRoot
    for (let e in endpoints) {
        endpointCounter[endpoints[e]] = 0;
    }
}

/**
 * Adds one to the count of a path. If there is no path, the create a key in the name of
 * the path and increments it by 1.
 * @param {string} endpoint Increment the count in the object endpointCounter by 1
 * @returns integer, the current count after incrementation
 */
exports.addCount = endpoint => {
    if (endpointCounter[endpoint] != undefined) {
        return ++endpointCounter[endpoint];
    }
}

/**
 * Returns the endpointCounter
 * @returns endpointCounter object
 */
exports.getEndpointCounts = () => {
    return endpointCounter;
}