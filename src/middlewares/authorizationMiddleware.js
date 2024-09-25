import middlewareServices from "../services/middlewareServices.js";

const authorization = async (req, res, next) => {
    try {
        const userAuthorization = req.header('Authorization')?.replace('Key:', '');
        const credentials = req.cookies.credentials;

        console.log([credentials, userAuthorization])

        if (!userAuthorization || !credentials) {
            return res.status(401).json({
                status_code: 401,
                message: 'Unauthorized',
                errors: 'Authorization or credentials are missing'
            });
        }

        const isCredentialsValid = await middlewareServices.auth({userAuthorization, credentials});

        if (isCredentialsValid.errors) {
            return res.status(400).json({
                status_code: isCredentialsValid.status_code,
                message: isCredentialsValid.message,
                errors: isCredentialsValid.errors
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({
            status_code: 500,
            message: 'Internal Server Error',
            errors: err.message
        });
    }
};

export default authorization;