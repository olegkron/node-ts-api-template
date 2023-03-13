import compression from 'compression'
import { Request, Response } from 'express'

export const compressionMiddleware = () => {
	return compression({
		filter: (req: Request, res: Response): boolean => {
			if (req.headers['x-no-compression']) {
				// don't compress responses with this header
				return false
			}
			// fallback to standard filter function
			return compression.filter(req, res)
		},
	})
}
