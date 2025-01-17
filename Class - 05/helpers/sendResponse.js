

export default function sendResponse(res, status, data, error, msg) {
    res.status(status).json({
        error: error,
        data: data,
        msg: msg
    })
} 