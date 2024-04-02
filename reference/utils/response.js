class Responses {
  successResponse({ message, data, meta }) {
    return {
      status: true,
      message,
      total: meta,
      error: null,
      data,
    };
  }

  errorResponse(error) {
    return {
      status: false,
      message: error.message,
      data: null,
      error,
    };
  }
}

module.exports = new Responses();
