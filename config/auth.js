module.exports = {
    /**
     * Protecting links to non-logged in users
     */
    ensureUserIsAuthenticated: function(req, res, next){
        if(req.user){
            if(req.isAuthenticated()){
                return next();
            }
        }
        req.flash('error', 'You must be logged in');
        res.redirect(301, '/login');
    },
}