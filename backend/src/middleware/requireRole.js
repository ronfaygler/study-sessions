export function requireRole(role) {
    return ( req, res, next) => {
        if (role !== req.user.role){
            return res.status(403).json({message: 'Forbidden'});
        }
        return next();

    }

}